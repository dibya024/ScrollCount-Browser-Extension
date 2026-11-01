# ScrollCount

ScrollCount is a Chrome extension that helps you understand your YouTube Shorts
activity. It counts Shorts as you navigate through YouTube and displays your
statistics in a popup and a separate Content Wellbeing dashboard.

## Features

- Tracks YouTube Shorts navigation on `www.youtube.com`.
- Shows today's unique Shorts count in the extension popup.
- Shows today's unique Shorts, total views, and lifetime total in the dashboard.
- Provides activity history for today, the last 3 days, or the last 7 days.
- Lets you reset today's counts without resetting the lifetime total.
- Stores activity data locally with Chrome Storage.

## Built with

- React and React Router
- Vite
- Tailwind CSS 4 and regular CSS
- Lucide React icons
- Chrome Extension Manifest V3 APIs

## Project structure

```text
ScrollCount/
├── public/
│   ├── manifest.json
│   └── tracker.js
├── src/
│   ├── components/
│   │   ├── DefaultPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── PopupHome.jsx
│   │   ├── Settings.jsx
│   │   └── Sidebar.jsx
│   ├── CSS/
│   │   ├── dashboard.css
│   │   ├── defaultPage.css
│   │   ├── historyPage.css
│   │   ├── homePage.css
│   │   ├── popupHome.css
│   │   ├── settings.css
│   │   └── sidebar.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── Wellbeing.jsx
├── HomePage.html
├── index.html
├── package.json
└── vite.config.js
```

`index.html` is the extension popup. `HomePage.html` is the dashboard entry
point, with overview, history, and settings routes.

## Develop and build

### Prerequisites

- Google Chrome
- Node.js and npm

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

The development server is useful for working on the UI. To test the extension
with Chrome APIs, build it and load the generated extension instead:

```bash
npm run build
```

The available project scripts are:

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Load the extension in Chrome

1. Run `npm run build`.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the generated `dist/` folder.
5. Visit YouTube and navigate through Shorts to generate activity.
6. Open the ScrollCount extension popup and select **Open Content Wellbeing**
   to view the dashboard.

After rebuilding, return to `chrome://extensions/` and reload ScrollCount.

## How tracking works

The Manifest V3 content script runs on YouTube pages. It observes YouTube
navigation and records Shorts IDs and visit totals in `chrome.storage.local`.
Daily records are kept under date-specific keys; the lifetime total is stored
separately. The popup and dashboard read those local records to display counts.

## Privacy

ScrollCount stores its activity records and tracking preference in Chrome's
local storage. The current extension does not require an account or a remote
database. Its content script is configured to run on YouTube pages only.

## Contributing

Bug reports, suggestions, and pull requests are welcome. For a change:

1. Fork the repository and create a feature branch.
2. Install dependencies with `npm install`.
3. Make and test your changes.
4. Open a pull request describing the change.

## Author

**Dibyaranjan Sahoo**  
GitHub: [@dibya024](https://github.com/dibya024)

---

*ScrollCount — scroll less mindlessly. Live more intentionally.*
