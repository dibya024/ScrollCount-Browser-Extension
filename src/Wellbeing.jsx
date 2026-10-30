import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Homepage from "./components/HomePage";
import Settings from "./components//Settings";
import HistoryPage from "./components/HistoryPage";

import "./CSS/dashboard.css";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
          <Route path="/history-page" element={<HistoryPage />}></Route>
        </Routes>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <DashboardLayout />
    </BrowserRouter>
  </React.StrictMode>,
);
