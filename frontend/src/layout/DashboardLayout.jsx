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
import Logo from "../assets/logo.png"
import { fetchEvents, fetchTrainings, fetchMeetings } from "../api/announcements.api"

export default function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata')
  const [showEventsDropdown, setShowEventsDropdown] = useState(false)
  const [eventsData, setEventsData] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const userEmail = localStorage.getItem("userEmail") || "user@smg.com"

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const loadEventsDropdown = async () => {
    setEventsLoading(true)
    try {
      const [events, trainings, meetings] = await Promise.all([
        fetchEvents().catch(() => []),
        fetchTrainings().catch(() => []),
        fetchMeetings().catch(() => [])
      ])

      const eventsList = Array.isArray(events) ? events : events.data || []
      const trainingsList = Array.isArray(trainings) ? trainings : trainings.data || []
      const meetingsList = Array.isArray(meetings) ? meetings : meetings.data || []

      const combined = [
        ...eventsList.map(e => ({ ...e, type: 'Event', icon: '📅' })),
        ...trainingsList.map(t => ({ ...t, type: 'Training', icon: '🎓' })),
        ...meetingsList.map(m => ({ ...m, type: 'Meeting', icon: '📋' }))
      ]

      setEventsData(combined.slice(0, 5))
    } catch (err) {
      console.warn('Failed to load events:', err)
      setEventsData([])
    } finally {
      setEventsLoading(false)
    }
  }

  useEffect(() => {
    if (showEventsDropdown) {
      loadEventsDropdown()
    }
  }, [showEventsDropdown])

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

  { path: "/apply-leave", label: "Apply Leave", icon: <MailIcon /> },
  { path: "/announcements", label: "Announcements", icon: <BellIcon /> },

  { path: "/procurement", label: "Procurement", icon: <ClipboardIcon /> },
  { path: "/quality", label: "Quality", icon: <CheckIcon /> },
  { path: "/store", label: "Store", icon: <BoxIcon /> },
  {
  path: "/contractors", label: "Contractors", icon: <ClipboardIcon /> },
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
              <div className="dropdown-header-with-close">
                <span>Events & Announcements</span>
                <button
                  className="close-dropdown-btn"
                  onClick={() => setShowEventsDropdown(false)}
                  title="Close"
                >
                  ✕
                </button>
              </div>
              {eventsLoading ? (
                <div className="dropdown-loading">Loading events...</div>
              ) : eventsData.length > 0 ? (
                eventsData.map((item, idx) => (
                  <div key={idx} className="events-dropdown-item">
                    <div className="event-item-header">
                      <span className="event-icon">{item.icon}</span>
                      <span className="event-type">{item.type}</span>
                    </div>
                    <div className="event-title">{item.title || item.meeting_title || 'Untitled'}</div>
                    {item.event_date && (
                      <div className="event-date">
                        {new Date(item.event_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="dropdown-empty">No events scheduled</div>
              )}
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
      <aside className="dashboard-sidebar">

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

       <div className="sidebar-footer">
  <button
    onClick={handleLogout}
    className="nav-link logout-nav"
  >
    <span className="nav-icon">
      <LogoutIcon />
    </span>
    <span className="nav-label">Logout</span>
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
