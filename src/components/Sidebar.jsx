import { useState } from 'react';
import { AcademicCap, DashboardIcon, UsersIcon, BookOpenIcon, AnalyticsIcon, SettingsIcon } from './Icons';

function Sidebar({ activeSection, onSectionChange }) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard' },
    { id: 'students', icon: UsersIcon, label: 'Students' },
    { id: 'courses', icon: BookOpenIcon, label: 'Departments' },
    { id: 'analytics', icon: AnalyticsIcon, label: 'Analytics' },
  ];

  return (
    <aside className={`floating-sidebar ${collapsed ? 'collapsed' : ''}`} id="main-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-badge">
            <AcademicCap size={22} className="logo-svg" />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">UniPortal</span>
              <span className="logo-sub">Registry</span>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
              title={item.label}
            >
              <span className="nav-icon">
                <IconComponent size={20} />
              </span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {isActive && <span className="nav-active-pip"></span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-nav-item" title="Settings" id="nav-settings">
          <span className="nav-icon">
            <SettingsIcon size={20} />
          </span>
          {!collapsed && <span className="nav-label">Settings</span>}
        </button>

        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          id="sidebar-collapse-btn"
        >
          <span className="collapse-arrow">{collapsed ? "EXPAND" : "COLLAPSE"}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;