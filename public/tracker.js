
(() => {
    console.log("ScrollCount: tracker injected");

    const countedVideoIds = new Set();
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
            const data = await chrome.storage.local.get(todayKey);
            const saved = data[todayKey];

            countedVideoIds.clear();

            if (saved?.videoIds) {
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

        if (countedVideoIds.has(videoId)) {
            console.log("ScrollCount : already counted", videoId);
            return;
        }
        checkInProgress = true;
        countedVideoIds.add(videoId);

        try {
            await chrome.storage.local.set({
                [todayKey]: {
                    videoIds: [...countedVideoIds],
                    count: countedVideoIds.size,
                }
            });


            console.log("ScrollCount: Short recorded!", {
                videoId,
                todayCount: countedVideoIds.size,
            });
        } catch (error) {
            countedVideoIds.delete(videoId);
            lastVideoId = null;
            console.error("ScrollCount: failed to save short", error);
        } finally {
            checkInProgress = false;
        }
    }

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
