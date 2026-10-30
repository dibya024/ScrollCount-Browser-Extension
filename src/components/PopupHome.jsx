import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";

import "../CSS/popupHome.css";

const PopupHome = ({ count, loading }) => {
  const [rotating, setrotating] = useState(false);

  const handleRefresh = async () => {
    setrotating(true);
    try {
      await loadCount();
    } finally {
      setTimeout(() => setrotating(false), 500);
    }
  };

  return (
    <div>
      <main className="popup">
        <header className="header">
          <div className="logo">
            <Play size={20} fill="currentColor" />
          </div>
          <div>
            <h1>ScrollCount</h1>
            <p>Your scrolling activity</p>
          </div>
        </header>
        <section className="count-card">
          <p className="label">Today's YT Shorts</p>
          <div className="count">{loading ? "-" : count}</div>
          <p className="subtitle">Unique shorts watched today </p>
          <button
            className="content-wellbeing"
            onClick={() => {
              chrome.tabs.create({
                url: chrome.runtime.getURL("HomePage.html"),
              });
            }}
          >
            Content Wellbeing
          </button>
        </section>
        <footer className="footer">
          <div>
            <span className="status-dot" />
            <span>Tracking on YT</span>
          </div>
          <button
            className="refresh-btn"
            title="Refresh Count"
            aria-label="Refresh Count"
            disabled={rotating}
            onClick={handleRefresh}
          >
            <RotateCcw size={15} className={rotating ? "rotate-icon" : ""} />
          </button>
        </footer>
      </main>
    </div>
  );
};

export default PopupHome;
