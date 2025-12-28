import './Dashboard.css';
import UserIcon from '../layout/icons/UserIcon';
import CheckIcon from '../layout/icons/CheckIcon';
import ClipboardIcon from '../layout/icons/ClipboardIcon';
import CalendarIcon from '../layout/icons/CalendarIcon';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const dashboardStats = [
    { label: 'Present Today', value: '198', icon: <CheckIcon size={24} />, color: 'success' },
    { label: 'Total Employees', value: '245', icon: <UserIcon size={24} />, color: 'primary' },
    { label: 'Pending Leaves', value: '12', icon: <ClipboardIcon size={24} />, color: 'warning' },
    { label: 'Today\'s Events', value: '5', icon: <CalendarIcon size={24} />, color: 'info' },
  ];

  const recentActivity = [
    { type: 'Leave Request', user: 'Rajesh Kumar', status: 'Approved', time: '2 hours ago', action: 'submitted a leave request' },
    { type: 'Attendance', user: 'Priya Singh', status: 'Present', time: '4 hours ago', action: 'marked attendance' },
    { type: 'Leave Request', user: 'Amit Sharma', status: 'Pending', time: '1 day ago', action: 'submitted a leave request' },
    { type: 'Profile Update', user: 'Sneha Patel', status: 'Approved', time: '2 days ago', action: 'updated profile information' },
    { type: 'Document', user: 'Vikram Singh', status: 'Rejected', time: '3 days ago', action: 'uploaded document' },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
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
            {recentActivity.map((activity, index) => (
              <div key={index} className="timeline-item">
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
            ))}
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
              onClick={() => navigate("/reports")}
            >
              View Reports
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
