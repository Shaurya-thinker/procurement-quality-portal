import { useState, useEffect } from 'react';
import './ApplyLeave.css';
import UserIcon from '../layout/icons/UserIcon';
import CalendarIcon from '../layout/icons/CalendarIcon';

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('medical');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [reason, setReason] = useState('');
  const [medicalDocument, setMedicalDocument] = useState(null);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const employeeDetails = {
    name: 'Rajesh Kumar',
    employeeId: 'EMP001',
    department: 'Software Development',
    designation: 'Senior Developer',
    manager: 'Priya Singh',
    email: 'rajesh.kumar@company.com'
  };

  useEffect(() => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setNumberOfDays(diffDays);
    } else {
      setNumberOfDays(0);
    }
  }, [fromDate, toDate]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setMedicalDocument(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log('Leave application submitted:', {
      leaveType,
      fromDate,
      toDate,
      numberOfDays,
      reason,
      medicalDocument,
      declarationAccepted
    });
  };

  const handleCancel = () => {
    // Reset form or navigate back
    setFromDate('');
    setToDate('');
    setReason('');
    setMedicalDocument(null);
    setDeclarationAccepted(false);
  };

  return (
    <div className="apply-leave-page">
      <h1 className="page-title">Apply Leave</h1>

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
            <span className="info-label">Reporting Manager</span>
            <span className="info-value">{employeeDetails.manager}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{employeeDetails.email}</span>
          </div>
        </div>
      </div>

      <div className="leave-type-section">
        <h3 className="section-title">Leave Type</h3>
        <div className="toggle-buttons">
          <button
            type="button"
            className={`toggle-button ${leaveType === 'medical' ? 'active' : ''}`}
            onClick={() => setLeaveType('medical')}
          >
            <span className="toggle-icon">🏥</span>
            <span className="toggle-label">Medical Leave</span>
          </button>
          <button
            type="button"
            className={`toggle-button ${leaveType === 'wfh' ? 'active' : ''}`}
            onClick={() => setLeaveType('wfh')}
          >
            <span className="toggle-icon">🏠</span>
            <span className="toggle-label">Work From Home</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="leave-form">
        <div className="form-section">
          <h3 className="section-title">Leave Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">From Date</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-input date-input"
                  required
                />
                <CalendarIcon size={18} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="form-input date-input"
                  min={fromDate}
                  required
                />
                <CalendarIcon size={18} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Number of Days</label>
              <div className="days-display">
                <span className="days-count">{numberOfDays}</span>
                <span className="days-text">day{numberOfDays !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group full-width">
            <label className="form-label">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-textarea"
              placeholder="Please provide a detailed reason for your leave application..."
              rows={4}
              required
            />
          </div>
        </div>

        {leaveType === 'medical' && (
          <div className="form-section medical-section">
            <h3 className="section-title">Medical Documentation</h3>
            <div className="form-group">
              <label className="form-label">Upload Medical Document</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="medical-document"
                  onChange={handleFileUpload}
                  className="file-input"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label htmlFor="medical-document" className="file-upload-button">
                  <span className="upload-icon">📎</span>
                  <span className="upload-text">
                    {medicalDocument ? medicalDocument.name : 'Choose file or drag here'}
                  </span>
                </label>
              </div>
              <p className="file-hint">
                Supported formats: PDF, JPG, PNG, DOC, DOCX (Max size: 5MB)
              </p>
            </div>
            <div className="form-group">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="checkbox-input"
                  required
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  I declare that the information provided is true and accurate. I understand that any false information may result in disciplinary action.
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="form-footer">
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}