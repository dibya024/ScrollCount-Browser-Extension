import { useState } from "react";
import { Play, RotateCcw, ArrowUpRight, Activity } from "lucide-react";

import "../CSS/popupHome.css";

const PopupHome = ({ count, loading, loadCount }) => {
  const [rotating, setRotating] = useState(false);

  const handleRefresh = async () => {
    if (rotating || typeof loadCount !== "function") return;

    setRotating(true);
    try {
      await loadCount();
    } finally {
      setTimeout(() => setRotating(false), 500);
    }
  };

  return (
    <main className="popup">
      <header className="header">
        <div className="popup-brand-icon">
          <Play size={19} fill="currentColor" strokeWidth={1.8} />
        </div>

        <div className="popup-brand-text">
          <h1>ScrollCount</h1>
          <p>Your scrolling activity</p>
        </div>
      </header>

      <section className="count-card">
        <div className="count-card-top">
          <div className="count-icon">
            <Activity size={17} strokeWidth={2} />
          </div>
          <span className="count-period">TODAY</span>
        </div>

        <p className="label">YouTube Shorts</p>

        <div className="count-row">
          <span className="count">{loading ? "—" : count ?? 0}</span>
          <span className="count-unit">shorts</span>
        </div>

        <p className="subtitle">
          Unique Shorts watched today
        </p>

        <div className="count-divider" />

        <button
          className="content-wellbeing"
          onClick={() => {
            chrome.tabs.create({
              url: chrome.runtime.getURL("HomePage.html"),
            });
          }}
        >
          <span>Open Content Wellbeing</span>
          <ArrowUpRight size={17} />
        </button>
      </section>

      <footer className="footer">
        <div className="tracking-status">
          <span className="status-dot" />
          <div className="tracking-copy">
            <span className="tracking-title">Tracking active</span>
            <span className="tracking-subtitle">YouTube Shorts</span>
          </div>
        </div>

        <button
          className="refresh-btn"
          title="Refresh count"
          aria-label="Refresh count"
          disabled={rotating || loading || typeof loadCount !== "function"}
          onClick={handleRefresh}
        >
          <RotateCcw
            size={17}
            className={rotating ? "rotate-icon" : ""}
          />
        </button>
      </footer>
    </main>
  );
};

export default PopupHome;
