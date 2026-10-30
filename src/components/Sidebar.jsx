import { NavLink } from "react-router-dom";
import { LayoutDashboard, History, Settings } from "lucide-react";

import "../CSS/sidebar.css";

const menuItems = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "History", path: "/history-page", icon: History },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">S</div>
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
