import { useState, useEffect } from "react";
import { Play, RotateCcw } from "lucide-react";
import "./App.css";

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  return `scrollCount:${year}-${month}-${date}`;
}

function App() {
  const [count, setCount] = useState(0);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    async function loadCount() {
      try {
        const key = getTodayKey();
        const data = await chrome.storage.local.get(key);
        setCount(data[key]?.videoIds?.length ?? 0);
      } catch (error) {
        console.error("Could not load today's count:", error);
      } finally {
        setloading(false);
      }
    }
    loadCount();
  }, []);

  return (
    <>
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
        </section>
        <footer className="footer">
          <span className="status-dot" />
          <span>Tracking on YT</span>
          <RotateCcw size={15} />
        </footer>
      </main>
    </>
  );
}

export default App;
