import { useEffect, useState } from "react";
import {
  Settings2,
  Eye,
  Sun,
  Moon,
  Trash2,
  ShieldCheck,
  ChevronRight,
  Check,
  AlertTriangle,
} from "lucide-react";
import "../CSS/settings.css";

const SETTINGS_KEY = "scrollCountSettings";

const HISTORY_KEYS = [
  "scrollCountHistory",
  "shortsHistory",
  "dailyStats",
];

const defaultSettings = {
  trackingEnabled: true,
  theme: "dark",
};

const isExtension = () =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

async function readSettings() {
  if (isExtension()) {
    const result = await chrome.storage.local.get(SETTINGS_KEY);
    return { ...defaultSettings, ...result[SETTINGS_KEY] };
  }

  try {
    return {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"),
    };
  } catch {
    return defaultSettings;
  }
}

async function saveSettings(settings) {
  if (isExtension()) {
    await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
  } else {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    readSettings()
      .then(setSettings)
      .catch(() => setMessage("Could not load settings."))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  async function updateSetting(changes) {
    const updated = { ...settings, ...changes };
    setSettings(updated);

    try {
      await saveSettings(updated);
      setMessage("Settings saved");
    } catch {
      setMessage("Could not save settings.");
    }
  }

  async function clearHistory() {
    setClearing(true);

    try {
      if (isExtension()) {
        const stored = await chrome.storage.local.get(null);
        const keysToRemove = HISTORY_KEYS.filter((key) =>
          Object.prototype.hasOwnProperty.call(stored, key)
        );

        if (keysToRemove.length === 0) {
          setMessage(
            "No matching history keys found. Update HISTORY_KEYS to match your storage."
          );
        } else {
          await chrome.storage.local.remove(keysToRemove);
          setMessage("Stored history data cleared.");
        }
      } else {
        HISTORY_KEYS.forEach((key) => localStorage.removeItem(key));
        setMessage("Matching local history data cleared.");
      }
    } catch {
      setMessage("Could not clear history.");
    } finally {
      setClearing(false);
      setShowConfirm(false);
    }
  }

  if (!loaded) {
    return (
      <main className="settings-page">
        <p className="settings-loading">Loading settings...</p>
      </main>
    );
  }

  return (
    <main className="settings-page">
      <div className="settings-container">
        <header className="settings-header">
          <div className="settings-heading-icon">
            <Settings2 size={23} />
          </div>
          <div>
            <span className="settings-eyebrow">PERSONALIZE</span>
            <h1>Settings</h1>
            <p>Make ScrollCount work the way you want.</p>
          </div>
        </header>

        <section className="settings-section">
          <div className="settings-section-heading">
            <h2>Tracking preferences</h2>
            <p>Control how ScrollCount tracks your Shorts activity.</p>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon blue">
              <Eye size={21} />
            </div>
            <div className="settings-row-content">
              <h3>Shorts tracking</h3>
              <p>
                {settings.trackingEnabled
                  ? "Tracking preference is enabled."
                  : "Tracking preference is paused."}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.trackingEnabled}
              aria-label="Enable Shorts tracking"
              className={`settings-switch ${
                settings.trackingEnabled ? "active" : ""
              }`}
              onClick={() =>
                updateSetting({
                  trackingEnabled: !settings.trackingEnabled,
                })
              }
            >
              <span />
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <h2>Appearance</h2>
            <p>Choose the look that feels right for you.</p>
          </div>

          <div className="theme-options">
            <button
              type="button"
              className={`theme-option ${
                settings.theme === "dark" ? "selected" : ""
              }`}
              onClick={() => updateSetting({ theme: "dark" })}
              aria-pressed={settings.theme === "dark"}
            >
              <span className="theme-preview dark-preview">
                <Moon size={23} />
                <span className="preview-line" />
                <span className="preview-line short" />
              </span>
              <span className="theme-option-label">
                <span>Dark mode</span>
                {settings.theme === "dark" && <Check size={17} />}
              </span>
            </button>

            <button
              type="button"
              className={`theme-option ${
                settings.theme === "light" ? "selected" : ""
              }`}
              onClick={() => updateSetting({ theme: "light" })}
              aria-pressed={settings.theme === "light"}
            >
              <span className="theme-preview light-preview">
                <Sun size={23} />
                <span className="preview-line" />
                <span className="preview-line short" />
              </span>
              <span className="theme-option-label">
                <span>Light mode</span>
                {settings.theme === "light" && <Check size={17} />}
              </span>
            </button>
          </div>
        </section>

        <section className="settings-section danger-section">
          <div className="settings-row">
            <div className="settings-row-icon red">
              <Trash2 size={21} />
            </div>
            <div className="settings-row-content">
              <h3>Clear watch history</h3>
              <p>Remove your stored Shorts activity data.</p>
            </div>
            <button
              type="button"
              className="clear-history-button"
              onClick={() => setShowConfirm(true)}
            >
              Clear history <ChevronRight size={16} />
            </button>
          </div>
        </section>

        <div className="settings-privacy-note">
          <ShieldCheck size={19} />
          <p>
            <strong>Your activity, your choice.</strong>
            <span>
              Your preferences are saved locally in this browser or extension.
            </span>
          </p>
        </div>

        {message && (
          <p className="settings-message" role="status">
            {message}
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setMessage("")}
            >
              ×
            </button>
          </p>
        )}
      </div>

      {showConfirm && (
        <div
          className="settings-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirm(false);
            }
          }}
        >
          <section
            className="settings-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-history-title"
          >
            <div className="confirm-icon">
              <AlertTriangle size={25} />
            </div>
            <h2 id="clear-history-title">Clear watch history?</h2>
            <p>
              This will remove matching stored activity data. This action
              cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowConfirm(false)}
                disabled={clearing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-clear-button"
                onClick={clearHistory}
                disabled={clearing}
              >
                {clearing ? "Clearing..." : "Yes, clear history"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}