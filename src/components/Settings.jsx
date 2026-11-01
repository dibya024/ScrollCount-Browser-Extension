import React, { useEffect, useState } from "react";
import { Activity, RotateCcw, ShieldCheck, Power } from "lucide-react";

import "../CSS/settings.css";

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `scrollCount:${year}-${month}-${day}`;
};

const Settings = () => {
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const data = await chrome.storage.local.get("scrollCountSettings");
        const settings = data.scrollCountSettings ?? {};

        if (mounted) {
          setTrackingEnabled(settings.trackingEnabled ?? true);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        if (mounted) setError("Could not load your settings.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSettings();

    const handleStorageChange = (changes, areaName) => {
      if (
        areaName === "local" &&
        changes.scrollCountSettings &&
        mounted
      ) {
        const settings = changes.scrollCountSettings.newValue ?? {};
        setTrackingEnabled(settings.trackingEnabled ?? true);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      mounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const handleToggle = async () => {
    if (saving) return;

    const nextValue = !trackingEnabled;
    const action = nextValue ? "enable" : "disable";

    const confirmed = window.confirm(
      nextValue
        ? "Enable Shorts Count? The extension will start tracking Shorts again."
        : "Disable Shorts Count? The extension will stop tracking Shorts until you enable it again."
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await chrome.storage.local.get("scrollCountSettings");
      const currentSettings = data.scrollCountSettings ?? {};

      await chrome.storage.local.set({
        scrollCountSettings: {
          ...currentSettings,
          trackingEnabled: nextValue,
        },
      });

      setTrackingEnabled(nextValue);
      setMessage(
        nextValue
          ? "Shorts Count is now enabled."
          : "Shorts Count is now disabled."
      );
    } catch (err) {
      console.error(`Failed to ${action} Shorts Count:`, err);
      setError("Could not update the setting. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToday = async () => {
    if (resetting) return;

    const confirmed = window.confirm(
      "Reset today's Shorts count and total views to zero? This cannot be undone. Your lifetime total will remain unchanged."
    );

    if (!confirmed) return;

    setResetting(true);
    setMessage("");
    setError("");

    try {
      await chrome.storage.local.set({
        [getTodayKey()]: {
          videoIds: [],
          count: 0,
          totalViews: 0,
        },
      });

      setMessage("Today's count has been reset.");
    } catch (err) {
      console.error("Failed to reset today's count:", err);
      setError("Could not reset today's count. Please try again.");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <main className="settings-page">
        <p className="settings-status">Loading settings...</p>
      </main>
    );
  }

  return (
    <main className="settings-page">
      <header className="settings-header">
        <div className="settings-heading-icon">
          <Activity size={22} />
        </div>

        <div>
          <p className="settings-eyebrow">SCROLLCOUNT</p>
          <h1>Settings</h1>
          <p className="settings-description">
            Manage your Shorts tracking.
          </p>
        </div>
      </header>

      <section className="settings-section">
        <div className="settings-section-heading">
          <h2>Tracking</h2>
          <p>Control how ScrollCount works.</p>
        </div>

        <article className="settings-card">
          <div className="settings-card-icon">
            <Power size={19} />
          </div>

          <div className="settings-card-content">
            <h3>Shorts Count</h3>
            <p>
              {trackingEnabled
                ? "Tracking is enabled. Shorts activity can be counted."
                : "Tracking is disabled. Shorts activity will not be counted."}
            </p>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              trackingEnabled ? "is-on" : ""
            }`}
            role="switch"
            aria-checked={trackingEnabled}
            aria-label="Shorts Count"
            disabled={saving}
            onClick={handleToggle}
          >
            <span className="settings-toggle-thumb" />
          </button>
        </article>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <h2>Daily count</h2>
          <p>Start today's count over from zero.</p>
        </div>

        <article className="settings-card settings-reset-card">
          <div className="settings-card-icon">
            <RotateCcw size={19} />
          </div>

          <div className="settings-card-content">
            <h3>Reset today's count</h3>
            <p>
              Clears today's unique Shorts count and total views.
              Lifetime statistics will not be affected.
            </p>
          </div>

          <button
            type="button"
            className="settings-reset-button"
            onClick={handleResetToday}
            disabled={resetting}
          >
            {resetting ? "Resetting..." : "Reset"}
          </button>
        </article>
      </section>

      {(message || error) && (
        <p
          className={`settings-feedback ${error ? "is-error" : "is-success"}`}
          role={error ? "alert" : "status"}
        >
          {message || error}
        </p>
      )}

      <footer className="settings-footer">
        <ShieldCheck size={16} />
        <span>Your tracking preferences are stored locally.</span>
      </footer>
    </main>
  );
};

export default Settings;
