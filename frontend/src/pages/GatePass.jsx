import { useState } from 'react';
import './GatePass.css';
import CalendarIcon from '../layout/icons/CalendarIcon';
import ClipboardIcon from '../layout/icons/ClipboardIcon';

export default function GatePass() {
  const [formData, setFormData] = useState({
    type: 'official',
    exitDate: '',
    exitTime: '',
    returnTime: '',
    reason: '',
    document: null,
    confirmation: false
  });

  const gatePassHistory = [
    {
      id: 1,
      date: '2024-12-02',
      exitTime: '02:30 PM',
      returnTime: '04:15 PM',
      duration: '1h 45m',
      reason: 'Bank work - salary account update',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-11-28',
      exitTime: '11:00 AM',
      returnTime: '12:30 PM',
      duration: '1h 30m',
      reason: 'Client meeting at nearby office',
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-11-25',
      exitTime: '03:00 PM',
      returnTime: '05:00 PM',
      duration: '2h 00m',
      reason: 'Medical appointment',
      status: 'Approved'
    },
    {
      id: 4,
      date: '2024-11-20',
      exitTime: '01:15 PM',
      returnTime: '02:45 PM',
      duration: '1h 30m',
      reason: 'Personal work - document collection',
      status: 'Pending'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Gate Pass submitted:', formData);
    // Reset form
    setFormData({
      type: 'official',
      exitDate: '',
      exitTime: '',
      returnTime: '',
      reason: '',
      document: null,
      confirmation: false
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="gate-pass-page">
      <h1 className="page-title">Gate Pass</h1>

      <div className="gate-pass-form-card">
        <div className="card-header">
          <ClipboardIcon size={24} />
          <h2 className="card-title">Request Gate Pass</h2>
        </div>

        <form onSubmit={handleSubmit} className="gate-pass-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="official">Official</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Exit Date</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  name="exitDate"
                  value={formData.exitDate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <CalendarIcon size={18} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Exit Time</label>
              <input
                type="time"
                name="exitTime"
                value={formData.exitTime}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Return Time</label>
              <input
                type="time"
                name="returnTime"
                value={formData.returnTime}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Please provide detailed reason for gate pass..."
              rows={4}
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Supporting Document (Optional)</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="document"
                name="document"
                onChange={handleInputChange}
                className="file-input"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="document" className="file-upload-button">
                <span className="upload-icon">📎</span>
                <span className="upload-text">
                  {formData.document ? formData.document.name : 'Choose file or drag here'}
                </span>
              </label>
            </div>
            <p className="file-hint">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max size: 5MB)
            </p>
          </div>

          <div className="form-group full-width">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                name="confirmation"
                checked={formData.confirmation}
                onChange={handleInputChange}
                className="checkbox-input"
                required
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                I confirm that the information provided is accurate and I will return within the specified time.
              </span>
            </label>
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-button">
              Submit Gate Pass Request
            </button>
          </div>
        </form>
      </div>

      <div className="history-card">
        <div className="card-header">
          <CalendarIcon size={24} />
          <h2 className="card-title">Gate Pass History</h2>
        </div>

        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Exit Time</th>
                <th>Return Time</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {gatePassHistory.map((record) => (
                <tr key={record.id}>
                  <td className="date-cell">
                    {formatDate(record.date)}
                  </td>
                  <td className="time-cell">{record.exitTime}</td>
                  <td className="time-cell">{record.returnTime}</td>
                  <td className="duration-cell">{record.duration}</td>
                  <td className="reason-cell">
                    <span className="reason-text" title={record.reason}>
                      {record.reason}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge status-${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {gatePassHistory.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🚪</div>
            <h3 className="empty-title">No gate pass records</h3>
            <p className="empty-text">You haven't requested any gate passes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}