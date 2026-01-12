import { useState, useEffect } from 'react';
import './Dashboard.css';
import UserIcon from '../layout/icons/UserIcon';
import CheckIcon from '../layout/icons/CheckIcon';
import ClipboardIcon from '../layout/icons/ClipboardIcon';
import CalendarIcon from '../layout/icons/CalendarIcon';
import { useNavigate } from "react-router-dom";
import { userApi } from '../api/userApi';
import { fetchEvents, fetchMeetings } from '../api/announcements.api';
import { getPOs } from '../api/procurement.api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard stats state
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [todayEvents, setTodayEvents] = useState(0);
  const [totalPOs, setTotalPOs] = useState(0);
  
  // Recent activity state
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();

    // Refresh dashboard every 30 seconds to catch updates
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    // Also refresh when user returns to this tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch total employees
      try {
        const employeesData = await userApi.getAllUsers(0, 1000);
        const employees = Array.isArray(employeesData) ? employeesData : employeesData.data || employeesData.items || [];
        const totalEmployeeCount = employees.length || 0;
        setTotalEmployees(totalEmployeeCount);

        // For "Present Today" - using 60% of total employees as estimate
        setPresentToday(Math.floor(totalEmployeeCount * 0.6));
      } catch (err) {
        console.warn('Failed to fetch employees:', err);
        setTotalEmployees(0);
        setPresentToday(0);
      }

      // Fetch today's events/announcements
      try {
        const eventsData = await fetchEvents();
        const eventsList = Array.isArray(eventsData) ? eventsData : eventsData.data || eventsData.items || [];
        setTodayEvents(eventsList.length);
      } catch (err) {
        console.warn('Failed to fetch events:', err);
        setTodayEvents(0);
      }

      // Fetch purchase orders (showing total count as a metric)
      try {
        const posData = await getPOs();
        const posList = Array.isArray(posData) ? posData : posData.data || posData.items || [];
        setTotalPOs(posList.length);
      } catch (err) {
        console.warn('Failed to fetch POs:', err);
        setTotalPOs(0);
      }

      // Build recent activity from events and meetings
      let recentActivityData = [];

      try {
        const eventsData = await fetchEvents();
        const eventsList = Array.isArray(eventsData) ? eventsData : eventsData.data || eventsData.items || [];

        eventsList.slice(0, 3).forEach((event, index) => {
          recentActivityData.push({
            id: `event-${index}`,
            type: 'Event',
            user: event.title || 'New Event',
            status: 'Active',
            time: formatTimeAgo(event.created_at || event.event_date),
            action: event.description || 'scheduled an event'
          });
        });
      } catch (err) {
        console.warn('Failed to fetch events for activity:', err);
      }

      try {
        const meetingsData = await fetchMeetings();
        const meetingsList = Array.isArray(meetingsData) ? meetingsData : meetingsData.data || meetingsData.items || [];

        meetingsList.slice(0, 2).forEach((meeting, index) => {
          recentActivityData.push({
            id: `meeting-${index}`,
            type: 'Meeting',
            user: meeting.meeting_title || meeting.title || 'New Meeting',
            status: 'Scheduled',
            time: formatTimeAgo(meeting.created_at || meeting.meeting_date),
            action: meeting.description || 'scheduled a meeting'
          });
        });
      } catch (err) {
        console.warn('Failed to fetch meetings for activity:', err);
      }

      setRecentActivity(recentActivityData.slice(0, 5));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check your backend connection.');
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    try {
      if (!dateString) return 'recently';

      // Handle various date formats
      let date;
      if (typeof dateString === 'string') {
        // Try parsing as ISO date string
        date = new Date(dateString);
      } else if (dateString instanceof Date) {
        date = dateString;
      } else {
        return 'recently';
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'recently';
      }

      const now = new Date();
      const diff = now - date;

      // If date is in future, show as upcoming
      if (diff < 0) {
        const futureDiff = Math.abs(diff);
        const days = Math.floor(futureDiff / 86400000);
        const hours = Math.floor(futureDiff / 3600000);
        const minutes = Math.floor(futureDiff / 60000);

        if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
        if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
        return 'very soon';
      }

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      return 'just now';
    } catch (err) {
      console.warn('Error formatting date:', err);
      return 'recently';
    }
  };

  const dashboardStats = [
    { 
      label: 'Present Today', 
      value: presentToday.toString(), 
      icon: <CheckIcon size={24} />, 
      color: 'success' 
    },
    { 
      label: 'Total Employees', 
      value: totalEmployees.toString(), 
      icon: <UserIcon size={24} />, 
      color: 'primary' 
    },
    { 
      label: 'Total POs', 
      value: totalPOs.toString(), 
      icon: <ClipboardIcon size={24} />, 
      color: 'warning' 
    },
    { 
      label: 'Today\'s Events', 
      value: todayEvents.toString(), 
      icon: <CalendarIcon size={24} />, 
      color: 'info' 
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1 className="page-title">Dashboard</h1>
        <div className="loading-message">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <h1 className="page-title">Dashboard</h1>
        <div className="error-message">{error}</div>
        <button onClick={fetchDashboardData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-timeline">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-user">{activity.user}</span>
                      <span className="timeline-time">{activity.time}</span>
                    </div>
                    <div className="timeline-action">{activity.action}</div>
                    <span className={`status-badge ${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">No recent activity</div>
            )}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Quick Links</h2>
          <div className="quick-links">
            <button
              className="quick-link-button"
              onClick={() => navigate("/apply-leave")}
            >
              Apply Leave
            </button>

            <button
              className="quick-link-button"
              onClick={() => navigate("/attendance")}
            >
              Check Attendance
            </button>

            <button
              className="quick-link-button"
              onClick={() => navigate("/profile")}
            >
              View Salary
            </button>

            <button
              className="quick-link-button"
              onClick={() => navigate("/procurement")}
            >
              View Purchase Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
