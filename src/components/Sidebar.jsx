import { NavLink } from "react-router-dom";
import { LayoutDashboard, History, Settings } from "lucide-react";

import "../CSS/sidebar.css";

const menuItems = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "History", path: "/history-page", icon: History },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = ({ choosenPage, setChoosenPage }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        {/* <div className="brand-logo">S</div> */}

        <div className="brand-logo">
          <svg
            width="38"
            height="38"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="scrollcount-s" x1="8" y1="8" x2="31" y2="32">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="65%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#FB923C" />
              </linearGradient>
            </defs>

            <rect width="40" height="40" rx="12" fill="#111C30" />

            <path
              d="M27 12.5C24.8 10.8 22.5 10 19.5 10C14.5 10 11.5 12.5 11.5 16C11.5 19.5 14.5 21 19.5 22C24.5 23 27.5 24.2 27.5 28C27.5 31.5 24 34 19.2 34C15.8 34 12.8 32.8 10.5 30.5"
              stroke="url(#scrollcount-s)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <circle cx="29.5" cy="10.5" r="2.5" fill="#FB923C" />
          </svg>
        </div>

        <div>
          <h2>ScrollCount</h2>
          <p>Content Wellbeing</p>
        </div>
      </div>

      <p className="menu-label">WORKSPACE</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => {
                setChoosenPage(true);
              }}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <p>Build healthier scrolling habits.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
