(() => {
    console.log("ScrollCount: tracker injected");

    const LIFETIME_KEY = "scrollCount:lifetimeTotal";

    const countedVideoIds = new Set();
    let totalShortsWatched = 0;
    let lastVideoId = null;
    let ready = false;
    let todayKey = getTodayKey();
    let checkInProgress = false;

    function getTodayKey() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `scrollCount:${year}-${month}-${day}`;
    }

    async function loadToday() {
        try {
            const data = await chrome.storage.local.get([todayKey, LIFETIME_KEY]);
            const saved = data[todayKey];
            totalShortsWatched = saved?.totalViews ?? 0;

            countedVideoIds.clear();

            if (Array.isArray(saved?.videoIds)) {
                saved.videoIds.forEach(id => countedVideoIds.add(id));
            }
            ready = true;
            console.log("ScrollCount: today's saved count", countedVideoIds.size);
            checkCurrentShort();

        } catch (error) {
            console.error("ScrollCount: failed to load saved count", error);
        }
    }

    async function checkCurrentShort() {
        if (!ready || checkInProgress) return;

        const currentDayKey = getTodayKey();

        if (currentDayKey !== todayKey) {
            todayKey = currentDayKey;
            lastVideoId = null;
            ready = false;
            await loadToday();
            return;
        }

        const match = location.pathname.match(/^\/shorts\/([^/]+)/);
        if (!match) {
            lastVideoId = null;
            return;
        }

        const videoId = match[1];

        if (videoId === lastVideoId) return;

        lastVideoId = videoId;
        checkInProgress = true;

        const isUnique = !countedVideoIds.has(videoId);

        if (isUnique) {
            countedVideoIds.add(videoId);
        }

        try {
            const data = await chrome.storage.local.get(LIFETIME_KEY);
            const lifetimetotal = (data[LIFETIME_KEY] ?? 0) + 1;
            totalShortsWatched++;

            await chrome.storage.local.set({
                [todayKey]: {
                    videoIds: [...countedVideoIds],
                    count: countedVideoIds.size,
                    totalViews: totalShortsWatched,
                },
                [LIFETIME_KEY]: lifetimetotal,
            });

            console.log("ScrollCount: Short recorded!", {
                videoId,
                uniqueToday: countedVideoIds.size, totalToday: totalShortsWatched, lifetimetotal
            });
        } catch (error) {
            if (isUnique) {
                countedVideoIds.delete(videoId);
            }
            totalShortsWatched = Math.max(0, totalShortsWatched - 1);
            lastVideoId = null;

            console.error("ScrollCount: failed to save short", error);
        } finally {
            checkInProgress = false;
        }
    }


    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== "local" || !changes[todayKey]) return;

        const newValue = changes[todayKey].newValue;

        if (
            newValue?.videoIds?.length === 0 &&
            (newValue?.totalViews ?? 0) === 0
        ) {
            countedVideoIds.clear();
            totalShortsWatched = 0;

            const match = location.pathname.match(/^\/shorts\/([^/]+)/);
            lastVideoId = match ? match[1] : null;
        }
    });

    window.addEventListener("yt-navigate-finish", checkCurrentShort);
    window.addEventListener("popstate", checkCurrentShort);

    const observer = new MutationObserver(checkCurrentShort);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    loadToday();

    setInterval(checkCurrentShort, 500);

})();
