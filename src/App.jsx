import { useState, useEffect } from "react";

import "./App.css";
import PopupHome from "./components/PopupHome";
import HomePage from "./components/HomePage";

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

  useEffect(() => {
    loadCount();
  }, []);

  return (
    <>
      <PopupHome count={count} loading={loading} />
    </>
  );
}

export default App;
