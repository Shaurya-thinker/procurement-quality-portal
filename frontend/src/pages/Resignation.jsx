import { useState } from 'react';
import './Resignation.css';
import UserIcon from '../layout/icons/UserIcon';
import CalendarIcon from '../layout/icons/CalendarIcon';
import CheckIcon from '../layout/icons/CheckIcon';

export default function Resignation() {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    lastWorkingDay: '',
    reason: '',
    noticePeriod: false
  });

  const employeeDetails = {
    name: 'Rajesh Kumar',
    employeeId: 'EMP001',
    department: 'Software Development',
    designation: 'Senior Developer',
    joiningDate: '2022-03-15',
    manager: 'Priya Singh'
  };

  const resignationStatus = {
    dateApplied: '2024-11-28',
    managerApproval: {
      status: 'Approved',
      date: '2024-11-30',
      comments: 'Approved with best wishes for future endeavors'
    },
    hrApproval: {
      status: 'Pending',
      date: null,
      comments: null
    },
    finalStatus: 'In Progress'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Resignation submitted:', formData);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return '✓';
      case 'rejected':
        return '✗';
      case 'pending':
        return '⏳';
      default:
        return '○';
    }
  };

  return (
    <div className="resignation-page">
      <h1 className="page-title">Resignation</h1>

      <div className="employee-details-card">
        <div className="card-header">
          <UserIcon size={24} />
          <h2 className="card-title">Employee Details</h2>
        </div>
        <div className="employee-info-grid">
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{employeeDetails.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Employee ID</span>
            <span className="info-value">{employeeDetails.employeeId}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Department</span>
            <span className="info-value">{employeeDetails.department}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Designation</span>
            <span className="info-value">{employeeDetails.designation}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Joining Date</span>
            <span className="info-value">{formatDate(employeeDetails.joiningDate)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Reporting Manager</span>
            <span className="info-value">{employeeDetails.manager}</span>
          </div>
        </div>
      </div>

      <div className="resignation-content-card">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Resignation Details
          </button>
          <button
            className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            Resignation Status
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'details' && (
            <div className="details-tab">
              <form onSubmit={handleSubmit} className="resignation-form">
                <div className="form-group">
                  <label className="form-label">Last Working Day</label>
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      name="lastWorkingDay"
                      value={formData.lastWorkingDay}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                    <CalendarIcon size={18} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Resignation</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Please provide your reason for resignation..."
                    rows={6}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      name="noticePeriod"
                      checked={formData.noticePeriod}
                      onChange={handleInputChange}
                      className="checkbox-input"
                      required
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      I confirm that I will serve the required notice period as per company policy (30 days minimum).
                    </span>
                  </label>
                </div>

                <div className="form-footer">
                  <button type="submit" className="submit-button">
                    Submit Resignation
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="status-tab">
              <div className="status-timeline">
                <div className="timeline-item completed">
                  <div className="timeline-dot">
                    <span className="timeline-icon">📝</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3 className="timeline-title">Application Submitted</h3>
                      <span className="timeline-date">{formatDate(resignationStatus.dateApplied)}</span>
                    </div>
                    <p className="timeline-description">
                      Resignation application has been submitted successfully.
                    </p>
                  </div>
                </div>

                <div className={`timeline-item ${resignationStatus.managerApproval.status.toLowerCase() === 'approved' ? 'completed' : resignationStatus.managerApproval.status.toLowerCase() === 'rejected' ? 'rejected' : 'pending'}`}>
                  <div className="timeline-dot">
                    <span className="timeline-icon">{getStatusIcon(resignationStatus.managerApproval.status)}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3 className="timeline-title">Manager Approval</h3>
                      <div className="timeline-status">
                        <span className={`status-badge status-${resignationStatus.managerApproval.status.toLowerCase()}`}>
                          {resignationStatus.managerApproval.status}
                        </span>
                        <span className="timeline-date">{formatDate(resignationStatus.managerApproval.date)}</span>
                      </div>
                    </div>
                    {resignationStatus.managerApproval.comments && (
                      <p className="timeline-description">
                        {resignationStatus.managerApproval.comments}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`timeline-item ${resignationStatus.hrApproval.status.toLowerCase() === 'approved' ? 'completed' : resignationStatus.hrApproval.status.toLowerCase() === 'rejected' ? 'rejected' : 'pending'}`}>
                  <div className="timeline-dot">
                    <span className="timeline-icon">{getStatusIcon(resignationStatus.hrApproval.status)}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3 className="timeline-title">HR Approval</h3>
                      <div className="timeline-status">
                        <span className={`status-badge status-${resignationStatus.hrApproval.status.toLowerCase()}`}>
                          {resignationStatus.hrApproval.status}
                        </span>
                        <span className="timeline-date">{formatDate(resignationStatus.hrApproval.date)}</span>
                      </div>
                    </div>
                    {resignationStatus.hrApproval.comments && (
                      <p className="timeline-description">
                        {resignationStatus.hrApproval.comments}
                      </p>
                    )}
                  </div>
                </div>

                <div className="timeline-item pending">
                  <div className="timeline-dot">
                    <span className="timeline-icon">🎯</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3 className="timeline-title">Final Status</h3>
                      <span className={`status-badge status-${resignationStatus.finalStatus.toLowerCase().replace(' ', '-')}`}>
                        {resignationStatus.finalStatus}
                      </span>
                    </div>
                    <p className="timeline-description">
                      Final resignation processing and documentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}