# ScrollCount 🎯

**Track how many YouTube Shorts you watch each day.**

ScrollCount is a Chrome extension designed to help you become more aware of your short-form content consumption by tracking the unique YouTube Shorts you view daily.

## ✨ Features

- 📊 **Daily Tracking** — Counts unique YouTube Shorts watched each day.
- 🔁 **Duplicate Prevention** — Avoids counting the same Short multiple times on the same day.
- 💾 **Local Storage** — Saves daily viewing data using Chrome Storage API.
- 🔄 **Daily Reset** — Starts a new count each day while preserving previous days' stored data.
- ⚡ **Lightweight Extension** — Runs directly in Chrome with minimal setup.

## 🛠️ Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Build Tool:** Vite
- **Browser Platform:** Chrome Extension Manifest V3
- **Storage:** Chrome Storage API
- **Icons:** Lucide React

## 📂 Project Structure

```text
ScrollCount/
├── public/
│   ├── manifest.json
│   └── tracker.js
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Google Chrome
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ScrollCount.git
cd ScrollCount
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Install dependencies

```bash
npm install
```

### 3. Build the extension

```bash
npm run build
```

This generates the production-ready extension in the `dist/` directory.

### 4. Load the extension in Chrome

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the project's `dist` folder.
5. Open YouTube Shorts and start browsing.

## ⚙️ How It Works

1. The content script runs on YouTube Shorts pages.
2. It detects the ID of the currently viewed Short.
3. Unique video IDs are stored under the current date using Chrome's local storage.
4. Rewatching a previously counted Short does not increase the daily count.
5. The extension popup displays the daily total.

## 🔒 Privacy

ScrollCount is designed to store tracking data locally in your browser using Chrome Storage API. The current prototype does not require a backend or user account.

## 🗺️ Roadmap

- [ ] Display daily viewing statistics in the popup.
- [ ] Add weekly and monthly summaries.
- [ ] Visualize viewing trends with charts.
- [ ] Improve the popup UI and user experience.
- [ ] Explore support for additional short-form video platforms.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

## 👨‍💻 Author

**Dibyaranjan Sahoo**

- GitHub: [@dibya024](https://github.com/dibya024)

## 📄 License

No license has been specified yet. All rights are reserved by default unless a license is added to the repository.

---

**ScrollCount — Scroll mindfully.**

If you find ScrollCount useful, consider giving the repository a ⭐ on GitHub!
