# ScrollCount ⏱️

**ScrollCount** is a Chrome extension designed to help you become more aware of your short-form video consumption. It tracks your YouTube Shorts activity and presents your scrolling statistics through a dedicated Content Wellbeing dashboard.

Instead of scrolling mindlessly, understand your habits and take control of your screen time.

## ✨ Features

- **YouTube Shorts Tracking** — Detects Shorts activity as you navigate through YouTube.
- **Unique Shorts Count** — Tracks distinct Shorts watched during the day.
- **Daily Statistics** — View your daily unique Shorts count and total viewing activity.
- **Lifetime Statistics** — Keep track of your accumulated Shorts activity.
- **Content Wellbeing Dashboard** — View your activity in a dedicated dashboard.
- **Reset Daily Count** — Reset today's statistics while preserving your lifetime total.
- **Local Data Storage** — Uses Chrome's local storage API to store activity data on your device.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development server and production builds |
| JavaScript | Tracking logic and application functionality |
| HTML & CSS | Dashboard structure and styling |
| Chrome Extension APIs | Browser integration and local storage |
| Chrome Extension Manifest V3 | Extension architecture |

## 📁 Project Structure

```text
ScrollCount/
├── public/
│   ├── manifest.json
│   └── tracker.js
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── HomePage.jsx
│   │   ├── Settings.jsx
│   │   └── HistoryPage.jsx
│   ├── CSS/
│   │   ├── dashboard.css
│   │   └── homePage.css
│   └── Wellbeing.jsx
├── index.html
├── HomePage.html
├── vite.config.js
├── package.json
└── README.md
```

*The structure above reflects the main files used in the project; your local repository may contain additional files.*

## 🚀 Getting Started

### Prerequisites

- Google Chrome
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/dibya024/ScrollCount.git
cd ScrollCount
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

This starts Vite for development. To generate the production extension build, run:

```bash
npm run build
```

### 4. Load the extension in Chrome

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the project's `dist` folder after building.
5. Open YouTube Shorts and test the tracking functionality.

Make sure the production build contains `manifest.json` and all referenced extension assets. Reload the extension from `chrome://extensions/` after rebuilding.

## 📊 How It Works

1. The extension detects navigation between YouTube Shorts.
2. The tracker identifies Shorts and maintains activity counts.
3. Daily activity data is stored using `chrome.storage.local`.
4. The Content Wellbeing dashboard reads stored statistics and displays them.
5. The lifetime counter preserves an accumulated total independently of the daily count.

## 🔒 Privacy

ScrollCount is designed around local-first tracking.

- Activity statistics are stored locally using Chrome storage.
- The current tracking approach does not require a user account or a remote database.
- Your statistics are intended to remain on your device unless future functionality introduces external synchronization.

Review the extension's permissions and source code to understand exactly what data is accessed and stored.

## 🗺️ Future Improvements

- [ ] Support tracking additional short-form video platforms.
- [ ] Add weekly and monthly analytics.
- [ ] Introduce daily scrolling goals and reminders.
- [ ] Add session-duration tracking.
- [ ] Improve historical activity visualizations.
- [ ] Explore optional cross-device synchronization.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request describing your improvements.

## 👨‍💻 Author

**Dibyaranjan Sahoo**

GitHub: [@dibya024](https://github.com/dibya024)

---

*ScrollCount — Scroll less mindlessly. Live more intentionally.*
