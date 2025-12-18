import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../auth/Login';
import './DashboardLayout.css';
import DashboardIcon from './icons/DashboardIcon';
import CalendarIcon from './icons/CalendarIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';
import BoxIcon from './icons/BoxIcon';
import UserIcon from './icons/UserIcon';
import BellIcon from './icons/BellIcon';
import MailIcon from './icons/MailIcon';
import SearchIcon from './icons/SearchIcon';
import LogoutIcon from './icons/LogoutIcon';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || 'user@smg.com';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowUserDropdown(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/attendance', label: 'Attendance', icon: <CalendarIcon /> },
    { path: '/procurement', label: 'Procurement', icon: <ClipboardIcon /> },
    { path: '/quality', label: 'Quality', icon: <CheckIcon /> },
    { path: '/store', label: 'Store', icon: <BoxIcon /> },
    { path: '/profile', label: 'Profile', icon: <UserIcon /> },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="dashboard-layout">
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-wrap">
              <img src="/logo192.png" alt="Company Logo" className="company-logo" onError={(e)=>{e.target.style.display='none'}} />
              {!sidebarCollapsed && <h2 className="logo-title">SMG</h2>}
            </div>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed ? (
                <path d="M9 18l6-6-6-6M3 6v12h3v-12H3z" />
              ) : (
                <path d="M15 18l-6-6 6-6M21 6v12h-3v-12h3z" />
              )}
            </svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : ''}>
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-link" title={sidebarCollapsed ? 'Logout' : ''}>
            <LogoutIcon />
            {!sidebarCollapsed && <span style={{marginLeft:10}}>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <div className="header-brand">
              <img src="/logo192.png" alt="Company Logo" className="header-logo-img" onError={(e)=>{e.target.style.display='none'}} />
              <div className="header-logo-text">SMG</div>
            </div>
          </div>

          <div className="header-center">
            <div className="header-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                aria-label="Search"
              />
            </div>
          </div>

          <div className="header-right">
            <button className="header-icon-button" title="Notifications" aria-label="Notifications">
              <BellIcon />
            </button>
            <button className="header-icon-button" title="Messages" aria-label="Messages">
              <MailIcon />
            </button>
            <div className="user-menu">
              <button
                className="user-avatar-button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                aria-haspopup="true"
                aria-expanded={showUserDropdown}
              >
                <span className="avatar-circle">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </button>
              {showUserDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">{userEmail}</div>
                  <button
                    onClick={handleProfileClick}
                    className="dropdown-item"
                  >
                    <UserIcon />
                    <span style={{marginLeft:10}}>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-item"
                  >
                    <LogoutIcon />
                    <span style={{marginLeft:10}}>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
