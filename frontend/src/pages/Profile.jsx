import { useState } from 'react';
import { getRole } from '../auth/Login';
import './Profile.css';

export default function Profile() {
  const userEmail = localStorage.getItem('userEmail') || 'user@smg.com';
  const role = getRole() || 'N/A';
  const [activeTab, setActiveTab] = useState('details');

  const profileData = {
    name: 'Rajesh Kumar',
    employeeId: 'EMP-001234',
    department: 'Procurement',
    designation: 'Senior Manager',
    reportingManager: 'Amit Singh',
    dateOfJoining: '15 March 2020',
    employmentType: 'Full Time',
    workLocation: 'Delhi NCR',
    email: userEmail,
    phone: '+91 9876543210',
    avatar: 'RK'
  };

  return (
    <div className="profile-page">
      <h1 className="profile-page-title">Profile</h1>
      <div className="profile-header-section">
        <div className="profile-card-container">
          <div className="profile-photo-section">
            <div className="profile-photo">
              <span className="photo-avatar">{profileData.avatar}</span>
            </div>
          </div>

          <div className="profile-info-section">
            <h1 className="profile-name">{profileData.name}</h1>
            <p className="profile-designation">{profileData.designation}</p>
            <p className="profile-department">{profileData.department}</p>
          </div>
        </div>
      </div>

      <div className="profile-content-section">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Employee Details
          </button>
          <button
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Information
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="profile-form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Employee Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  readOnly
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  value={profileData.employeeId}
                  readOnly
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  value={profileData.department}
                  readOnly
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  value={profileData.designation}
                  readOnly
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Reporting Manager</label>
                <input
                  type="text"
                  value={profileData.reportingManager}
                  readOnly
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Joining</label>
                <input
                  type="text"
                  value={profileData.dateOfJoining}
                  readOnly
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <input
                  type="text"
                  value={profileData.employmentType}
                  readOnly
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Work Location</label>
                <input
                  type="text"
                  value={profileData.workLocation}
                  readOnly
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="profile-form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  readOnly
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
