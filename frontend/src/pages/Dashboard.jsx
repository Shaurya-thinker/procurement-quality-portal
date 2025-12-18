import './Dashboard.css';

export default function Dashboard() {
  const dashboardStats = [
    { label: 'Total Employees', value: '245', icon: '👥' },
    { label: 'Present Today', value: '198', icon: '✓' },
    { label: 'Pending Leaves', value: '12', icon: '📋' },
    { label: 'Today\'s Events', value: '5', icon: '📅' },
  ];

  const recentActivity = [
    { type: 'Leave Request', user: 'Rajesh Kumar', status: 'Approved', time: '2 hours ago' },
    { type: 'Attendance', user: 'Priya Singh', status: 'Present', time: '4 hours ago' },
    { type: 'Leave Request', user: 'Amit Sharma', status: 'Pending', time: '1 day ago' },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-info">
                  <p className="activity-type">{activity.type}</p>
                  <p className="activity-user">{activity.user}</p>
                </div>
                <div className="activity-status">
                  <span className={`status-badge ${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Quick Links</h2>
          <div className="quick-links">
            <button className="quick-link-button">📝 Apply Leave</button>
            <button className="quick-link-button">✓ Check Attendance</button>
            <button className="quick-link-button">💼 View Salary</button>
            <button className="quick-link-button">📊 View Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
}
