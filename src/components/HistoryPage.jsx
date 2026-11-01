import React, { useEffect, useState, useRef } from "react";
import {
  History,
  CalendarDays,
  Eye,
  Activity,
  Layers,
  ChevronDown,
  Clock3,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import "../CSS/historyPage.css";

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `scrollCount:${year}-${month}-${day}`;
};

const formatDate = (date) =>
  date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const HistoryPage = () => {
  const [filter, setFilter] = useState("7 days");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filterRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        const data = await chrome.storage.local.get(null);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const records = Array.from({ length: 7 }, (_, index) => {
          const date = new Date(today);
          date.setDate(today.getDate() - index);

          const saved = data[getDateKey(date)];

          return {
            date:
              index === 0
                ? "Today"
                : index === 1
                  ? "Yesterday"
                  : date.toLocaleDateString("en-IN", {
                      weekday: "long",
                    }),
            fullDate: formatDate(date),
            dateKey: getDateKey(date),
            unique: saved?.count ?? 0,
            total: saved?.totalViews ?? 0,
          };
        });

        if (active) {
          setHistory(records);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load ScrollCount history:", err);
        if (active) setError("Unable to load your history.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadHistory();

    const handleStorageChange = (changes, areaName) => {
      if (
        areaName === "local" &&
        Object.keys(changes).some((key) =>
          /^scrollCount:\d{4}-\d{2}-\d{2}$/.test(key),
        )
      ) {
        loadHistory();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      active = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const filteredHistory =
    filter === "Today"
      ? history.slice(0, 1)
      : filter === "3 days"
        ? history.slice(0, 3)
        : history;

  const totalUnique = filteredHistory.reduce((sum, day) => sum + day.unique, 0);

  const totalVisits = filteredHistory.reduce((sum, day) => sum + day.total, 0);

  const averageVisits = filteredHistory.length
    ? (totalVisits / filteredHistory.length).toFixed(1)
    : "0.0";

  const maxVisits = Math.max(...filteredHistory.map((day) => day.total), 1);

  if (loading) {
    return <main className="history-page">Loading your history...</main>;
  }

  if (error) {
    return (
      <main className="history-page">
        <h1>Watch History</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  return (
    <main className="history-page">
      <header className="history-header">
        <div className="history-heading">
          <div className="history-eyebrow">
            <History size={23} />
            <span>YOUR DIGITAL WELLBEING</span>
          </div>

          <h1 className=" bg-linear-to-r from-violet-300 via-cyan-300-400 to-green-500 bg-clip-text text-transparent ">
            Your activity, in perspective.
          </h1>
          <p className="text-xl">
            Understand habits, celebrate progress, improve focus and scroll with
            intention.
          </p>
        </div>

        <label className="history-filter">
          <CalendarDays size={20} />

          <select
            ref={filterRef}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter history"
          >
            <option value="Today">Today</option>
            <option value="3 days">Last 3 days</option>
            <option value="7 days">Last 7 days</option>
          </select>

          <ChevronDown
            size={20}
            className="history-filter-chevron"
            onClick={() => {
              filterRef.current?.focus();
              filterRef.current?.click();
            }}
          />
        </label>
      </header>

      <section className="history-stats">
        <article className="history-stat-card stat-blue">
          <div className="history-stat-top">
            <span className="history-stat-icon">
              <Eye size={19} />
            </span>
            <span className="history-period">UNIQUE CONTENT</span>
          </div>
          <h2>{totalUnique}</h2>
          <p className="history-stat-title">Shorts discovered</p>
          <span className="history-stat-note">Daily unique counts summed</span>
        </article>

        <article className="history-stat-card stat-green">
          <div className="history-stat-top">
            <span className="history-stat-icon">
              <Activity size={19} />
            </span>
            <span className="history-period">TOTAL ACTIVITY</span>
          </div>
          <h2>{totalVisits}</h2>
          <p className="history-stat-title">Viewing visits</p>
          <span className="history-stat-note">Including repeat visits</span>
        </article>

        <article className="history-stat-card stat-purple">
          <div className="history-stat-top">
            <span className="history-stat-icon">
              <Layers size={19} />
            </span>
            <span className="history-period">DAILY AVERAGE</span>
          </div>
          <h2>{averageVisits}</h2>
          <p className="history-stat-title">Visits per day</p>
          <span className="history-stat-note">
            Across selected calendar days
          </span>
        </article>
      </section>

      <section className="history-chart-card">
        <div className="history-section-heading">
          <div>
            <div className="history-eyebrow">
              <TrendingUp size={16} />
              ACTIVITY OVERVIEW
            </div>
            <h2>Your scrolling rhythm</h2>
            <p>See how your viewing activity changes day to day</p>
          </div>
          <span className="history-chart-badge">
            <span className="history-live-dot" />
            {filteredHistory.length}{" "}
            {filteredHistory.length === 1 ? "day" : "days"}
          </span>
        </div>

        <div className="history-chart">
          {filteredHistory
            .slice()
            .reverse()
            .map((day) => {
              const barHeight = (day.total / maxVisits) * 100;

              return (
                <div className="history-chart-column" key={day.dateKey}>
                  <div className="history-chart-value">{day.total}</div>

                  <div className="history-chart-bar-wrapper">
                    <div
                      className={`history-chart-bar ${
                        day.date === "Today" ? "today-bar" : ""
                      }`}
                      style={{
                        height: `${day.total > 0 ? Math.max(barHeight, 4) : 0}%`,
                      }}
                      title={`${day.fullDate}: ${day.total} visits`}
                    />
                  </div>

                  <span className="history-chart-label">
                    {day.date === "Yesterday"
                      ? "Yest."
                      : day.date === "Today"
                        ? "Today"
                        : day.fullDate.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
              );
            })}
        </div>

        <div className="history-chart-legend">
          <span className="history-legend-dot" />
          Total viewing visits
        </div>
      </section>

      <section className="history-list-card">
        <div className="history-list-header">
          <div>
            <div className="history-eyebrow">
              <Clock3 size={14} />
              YOUR TIMELINE
            </div>
            <h2>Daily activity</h2>
            <p>A closer look at your viewing habits.</p>
          </div>

          <span className="history-record-count">
            {filteredHistory.length}{" "}
            {filteredHistory.length === 1 ? "day" : "days"}
          </span>
        </div>

        <div className="history-table">
          <div className="history-table-heading">
            <span>DATE</span>
            <span>UNIQUE SHORTS</span>
            <span>TOTAL VISITS</span>
          </div>

          {filteredHistory.map((day) => (
            <article className="history-row" key={day.dateKey}>
              <div className="history-date">
                <span className="history-date-icon">
                  <CalendarDays size={17} />
                </span>
                <div>
                  <strong>{day.date}</strong>
                  <span>{day.fullDate}</span>
                </div>
              </div>

              <div className="history-value">
                <span className="history-number">{day.unique}</span>
                <div className="history-bar">
                  <span
                    style={{
                      width: `${
                        (day.unique /
                          Math.max(
                            ...filteredHistory.map((item) => item.unique),
                            1,
                          )) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="history-total">
                <span>{day.total}</span>
                <span className="history-visit-label">visits</span>
              </div>
            </article>
          ))}

          {filteredHistory.every((day) => day.total === 0) && (
            <div className="history-empty">
              <Sparkles size={24} />
              <strong>No activity yet</strong>
              <span>Your viewing history will appear here.</span>
            </div>
          )}
        </div>
      </section>

      <footer className="history-footer">
        <span className="history-footer-icon">
          <Sparkles size={15} />
        </span>
        <span>Progress over perfection. Scroll with intention.</span>
        <ArrowUpRight size={15} />
      </footer>
    </main>
  );
};

export default HistoryPage;
