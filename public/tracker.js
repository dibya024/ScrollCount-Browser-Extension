
(() => {
    console.log("ScrollCount: tracker injected");

    const countedVideoIds = new Set();
    let lastVideoId = null;
    let ready = false;

    function getTodayKey() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `scrollCount:${year}-${month}-${day}`;
    }

    let todayKey = getTodayKey();
    async function loadToday() {
        try {
            const data = await chrome.storage.local.get(todayKey);
            const saved = data[todayKey];

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
        const currentDayKey = getTodayKey();
        if (!ready) return;

        if (currentDayKey !== todayKey) {
            todayKey = currentDayKey;
            countedVideoIds.clear();
            lastVideoId = null;
            if (!ready) return;
            ready = false;
            await loadToday();
            return;
        }

        const match = location.pathname.match(/^\/shorts\/([^/]+)/);
        if (!match) return;

        const videoId = match[1];

        if (videoId === lastVideoId) return;
        lastVideoId = videoId;

        if (countedVideoIds.has(videoId)) {
            console.log("ScrollCount : already counted", videoId);
            return;
        }
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
            console.error("ScrollCount: failed to save short", error);
        }
    }


    const observer = new MutationObserver(checkCurrentShort);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    loadToday();

    setInterval(() => {
        if (ready) {
            checkCurrentShort();
        }
    }, 500);

})();
