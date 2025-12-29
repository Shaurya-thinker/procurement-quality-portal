"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { logout } from "../auth/Login"
import "./DashboardLayout.css"
import DashboardIcon from "./icons/DashboardIcon"
import CalendarIcon from "./icons/CalendarIcon"
import ClipboardIcon from "./icons/ClipboardIcon"
import CheckIcon from "./icons/CheckIcon"
import BoxIcon from "./icons/BoxIcon"
import UserIcon from "./icons/UserIcon"
import BellIcon from "./icons/BellIcon"
import MailIcon from "./icons/MailIcon"
import LogoutIcon from "./icons/LogoutIcon"
import Logo from "../assets/logo.png";


export default function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata')
  const [showEventsDropdown, setShowEventsDropdown] = useState(false)
  const userEmail = localStorage.getItem("userEmail") || "user@smg.com"

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timezones = {
    'Asia/Kolkata': 'Indian Standard Time',
    'America/Sao_Paulo': 'Brazil',
    'Asia/Colombo': 'Srilanka', 
    'Europe/London': 'UK',
    'Europe/Amsterdam': 'Netherlands',
    'Australia/Melbourne': 'Australia(Melbourne)'
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: selectedTimezone
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: selectedTimezone
    })
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleProfileClick = () => {
    navigate("/profile")
    setShowUserDropdown(false)
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/attendance", label: "Attendance", icon: <CalendarIcon /> },
    { path: "/procurement", label: "Procurement", icon: <ClipboardIcon /> },
    { path: "/quality", label: "Quality", icon: <CheckIcon /> },
    { path: "/announcements", label: "Announcements", icon: <BellIcon /> },
    { path: "/store", label: "Store", icon: <BoxIcon /> },
    { path: "/profile", label: "Profile", icon: <UserIcon /> },
  ]

  const isActive = (path) => location.pathname.startsWith(path)

  return (
  <div className="dashboard-layout">

    {/* FULL WIDTH HEADER */}
    <header className="dashboard-header">
      <div className="header-left">
        <div className="header-logo-wrapper">
  <img src={Logo} alt="SMG Logo" className="header-logo" />
</div>


      </div>

      <div className="header-center">
        <div className="header-search">
          <input
            type="text"
            placeholder="Search anything..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-datetime">
          <span className="header-time">{formatTime(currentTime)}</span>
          <span className="header-date">{formatDate(currentTime)}</span>
          <div className="timezone-selector">
            <button 
              className="timezone-button"
              onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
            >
              <span className="timezone-label">{timezones[selectedTimezone]}</span>
              <span className="timezone-arrow">▼</span>
            </button>
            {showTimezoneDropdown && (
              <div className="timezone-dropdown">
                {Object.entries(timezones).map(([tz, label]) => (
                  <button
                    key={tz}
                    className={`timezone-option ${selectedTimezone === tz ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedTimezone(tz)
                      setShowTimezoneDropdown(false)
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="header-icon-button">
          <BellIcon />
        </button>

        <div className="events-menu">
          <button 
            className="header-icon-button events-button"
            onClick={() => setShowEventsDropdown(!showEventsDropdown)}
          >
            <MailIcon />
          </button>
          {showEventsDropdown && (
            <div className="events-dropdown">
              <div className="dropdown-header">Events & Information</div>
              <button className="dropdown-item">
                <span>📅 Events and Information</span>
              </button>
              <button className="dropdown-item">
                <span>🎓 Upcoming Training</span>
              </button>
              <button className="dropdown-item">
                <span>📋 Meeting Schedule</span>
              </button>
            </div>
          )}
        </div>

        <div className="user-menu">
          <button
            className="user-avatar-button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <span className="avatar-circle">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </button>

          {showUserDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-header">{userEmail}</div>
              <button onClick={handleProfileClick} className="dropdown-item">
                <UserIcon />
                <span>Profile</span>
              </button>
              <button onClick={handleLogout} className="dropdown-item logout-item">
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* BODY */}
    <div className="dashboard-body">

      {/* SIDEBAR */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className={`toggle-icon ${sidebarCollapsed ? "collapsed" : ""}`}>
              ‹
            </span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className={`nav-link logout-nav ${sidebarCollapsed ? "collapsed" : ""}`}
          title={sidebarCollapsed ? "Logout" : ""}
        >
          <span className="nav-icon">
            <LogoutIcon />
          </span>
          {!sidebarCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        {children}
      </main>

    </div>
  </div>
 )
}
