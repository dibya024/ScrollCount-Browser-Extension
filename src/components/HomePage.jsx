import { useState, useEffect } from "react";
import { RotateCcw, Activity, Eye, Layers, TrendingUp } from "lucide-react";

import "../CSS/homePage.css";

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  return `scrollCount:${year}-${month}-${date}`;
}

const HomePage = () => {
  const [totalShortsWatched, setTotalShortsWatched] = useState(0);
  const [uniqueShorts, setUniqueShorts] = useState(0);
  const [lifetimeTotal, setLifetimeTotal] = useState(0);

  useEffect(() => {
    async function loadTodayStats() {
      try {
        const key = getTodayKey();
        const data = await chrome.storage.local.get(key);
        const today = data[key];

        const totalData = await chrome.storage.local.get(
          "scrollCount:lifetimeTotal",
        );

        setLifetimeTotal(totalData["scrollCount:lifetimeTotal"] ?? 0);
        setUniqueShorts(today?.videoIds?.length ?? 0);
        setTotalShortsWatched(today?.totalViews ?? 0);
      } catch (error) {
        console.log("Failed to load today's statistics", error);
      }
    }

    loadTodayStats();

    const handleStorageChange = (changes, areaName) => {
      if (areaName === "local") {
        loadTodayStats();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  async function handleReset() {
    const confirmed = window.confirm(
      "Reset today's count? Your lifetime count will be preserved.",
    );

    if (!confirmed) return;

    try {
      const key = getTodayKey();

      await chrome.storage.local.set({
        [key]: {
          videoIds: [],
          count: 0,
          totalViews: 0,
        },
      });

      setUniqueShorts(0);
      setTotalShortsWatched(0);
    } catch (error) {
      console.error("Failed to reset today's count:", error);
    }
  }

  return (
    <main className="content-wellbeing-page">
      <header className="overview-header">
        <div className="overview-heading">
          <span className="eyebrow">
            <Activity size={20} />
            YOUR DIGITAL WELLBEING
          </span>

          <h1 className="bg-linear-to-r from-cyan-200 via-cyan-400 to-green-500 bg-clip-text text-transparent ">
            Digital Detox
          </h1>

          <p>
            Understand your scrolling habits and build healthier screen-time.
          </p>
        </div>

        <div className="overview-date">
          <span className="live-dot" />
          Tracking dashboard
        </div>
      </header>

      <section className="overview-intro">
        <div>
          <h2>Your activity at a glance</h2>
          <p>Here is a summary of your YouTube Shorts activity.</p>
        </div>
        <span className="intro-icon">
          <TrendingUp size={30} />
        </span>
      </section>

      <section className="stats-container">
        <article className="stats-card unique-card">
          <div className="stats-card-top">
            <span className="stats-icon">
              <Eye size={20} />
            </span>
            <span className="stats-period">TODAY</span>
          </div>

          <p className="stats-label bg-linear-to-r from-cyan-200 via-green-300 to-red-400 bg-clip-text text-transparent ">Unique Shorts</p>
          <p className="stats-number">{uniqueShorts}</p>
          <p className="stats-description">Different Shorts watched today</p>
        </article>

        <article className="stats-card total-card">
          <div className="stats-card-top">
            <span className="stats-icon">
              <Activity size={20} />
            </span>
            <span className="stats-period">TODAY</span>
          </div>

          <p className="stats-label bg-linear-to-r from-cyan-200 via-green-300 to-red-400 bg-clip-text text-transparent ">Total Shorts</p>
          <p className="stats-number">{totalShortsWatched}</p>
          <p className="stats-description">Including repeated visits</p>
        </article>

        <article className="stats-card lifetime-card">
          <div className="stats-card-top">
            <span className="stats-icon">
              <Layers size={20} />
            </span>
            <span className="stats-period">ALL TIME</span>
          </div>

          <p className="stats-label bg-linear-to-r from-cyan-200 via-red-400 to-red-600 bg-clip-text text-transparent ">Lifetime Total</p>
          <p className="stats-number">{lifetimeTotal}</p>
          <p className="stats-description">Total Shorts watched till today.</p>
        </article>
      </section>

      {/* <section className="wellbeing-panel">
        <div className="wellbeing-panel-icon">
          <Activity size={22} />
        </div>

        <div className="wellbeing-panel-content">
          <h2>Small steps, healthier habits</h2>
          <p>
            Keep an eye on your activity and make intentional decisions about
            how you spend your time online.
          </p>
        </div>
      </section> */}

      <footer className="overview-footer">
        <span>
          ScrollCount <span className="footer-separator">/</span> Overview
        </span>

        <button className="reset-btn" onClick={handleReset}>
          <RotateCcw size={15} />
          Reset today's count
        </button>
      </footer>
    </main>
  );
};

export default HomePage;
