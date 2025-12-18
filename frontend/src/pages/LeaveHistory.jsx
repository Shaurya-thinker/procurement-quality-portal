import { useState } from 'react';
import './LeaveHistory.css';
import CalendarIcon from '../layout/icons/CalendarIcon';

export default function LeaveHistory() {
  const [statusFilter, setStatusFilter] = useState('all');

  const leaveHistory = [
    {
      id: 1,
      dateApplied: '2024-11-28',
      fromDate: '2024-12-05',
      toDate: '2024-12-07',
      leaveType: 'Medical Leave',
      days: 3,
      reason: 'Fever and flu symptoms, doctor advised rest',
      status: 'Approved'
    },
    {
      id: 2,
      dateApplied: '2024-11-15',
      fromDate: '2024-11-20',
      toDate: '2024-11-22',
      leaveType: 'Work From Home',
      days: 3,
      reason: 'Family function in hometown',
      status: 'Approved'
    },
    {
      id: 3,
      dateApplied: '2024-11-10',
      fromDate: '2024-11-25',
      toDate: '2024-11-25',
      leaveType: 'Medical Leave',
      days: 1,
      reason: 'Dental appointment',
      status: 'Pending'
    },
    {
      id: 4,
      dateApplied: '2024-10-20',
      fromDate: '2024-10-28',
      toDate: '2024-10-30',
      leaveType: 'Work From Home',
      days: 3,
      reason: 'Personal work',
      status: 'Rejected'
    },
    {
      id: 5,
      dateApplied: '2024-10-05',
      fromDate: '2024-10-15',
      toDate: '2024-10-16',
      leaveType: 'Medical Leave',
      days: 2,
      reason: 'Regular health checkup',
      status: 'Approved'
    }
  ];

  const filteredHistory = statusFilter === 'all' 
    ? leaveHistory 
    : leaveHistory.filter(leave => leave.status.toLowerCase() === statusFilter);

  const formatDateRange = (fromDate, toDate) => {
    const from = new Date(fromDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const to = new Date(toDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    return fromDate === toDate ? from : `${from} – ${to}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="leave-history-page">
      <div className="page-header">
        <h1 className="page-title">Leave History</h1>
        <div className="header-actions">
          <CalendarIcon size={24} />
        </div>
      </div>

      <div className="history-container">
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Filter by Status:</label>
            <div className="status-filters">
              <button
                className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-button ${statusFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </button>
              <button
                className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date Applied</th>
                  <th>From – To</th>
                  <th>Leave Type</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((leave) => (
                  <tr key={leave.id}>
                    <td className="date-cell">
                      {formatDate(leave.dateApplied)}
                    </td>
                    <td className="date-range-cell">
                      {formatDateRange(leave.fromDate, leave.toDate)}
                    </td>
                    <td className="type-cell">
                      <span className={`type-badge ${leave.leaveType.toLowerCase().replace(' ', '-')}`}>
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="days-cell">
                      <span className="days-count">{leave.days}</span>
                      <span className="days-text">day{leave.days !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="reason-cell">
                      <span className="reason-text" title={leave.reason}>
                        {leave.reason}
                      </span>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge status-${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No leave records found</h3>
              <p className="empty-text">
                {statusFilter === 'all' 
                  ? 'You haven\'t applied for any leave yet.' 
                  : `No ${statusFilter} leave applications found.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}