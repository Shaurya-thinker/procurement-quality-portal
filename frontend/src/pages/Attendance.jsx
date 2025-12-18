import { useState } from 'react';
import './Attendance.css';

export default function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedYear, setSelectedYear] = useState('2024');

  const attendanceData = [
    { date: '01 Dec 2024', checkIn: '09:00 AM', checkOut: '06:15 PM', status: 'Present', hours: '9h 15m' },
    { date: '02 Dec 2024', checkIn: '09:10 AM', checkOut: '06:00 PM', status: 'Present', hours: '8h 50m' },
    { date: '03 Dec 2024', checkIn: '—', checkOut: '—', status: 'Absent', hours: '0h' },
    { date: '04 Dec 2024', checkIn: '09:05 AM', checkOut: '05:45 PM', status: 'Present', hours: '8h 40m' },
    { date: '05 Dec 2024', checkIn: '—', checkOut: '—', status: 'Leave', hours: '0h' },
    { date: '06 Dec 2024', checkIn: '09:00 AM', checkOut: '06:30 PM', status: 'Present', hours: '9h 30m' },
  ];

  const attendanceSummary = {
    present: 18,
    absent: 2,
    leave: 4,
    halfDay: 1,
    totalWorkingDays: 25,
  };

  return (
    <div className="attendance-page">
      <h1 className="page-title">Attendance</h1>

      <div className="attendance-summary-section">
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-icon present">✓</span>
            <div className="summary-info">
              <p className="summary-label">Present</p>
              <p className="summary-count">{attendanceSummary.present}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon absent">✕</span>
            <div className="summary-info">
              <p className="summary-label">Absent</p>
              <p className="summary-count">{attendanceSummary.absent}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon leave">📋</span>
            <div className="summary-info">
              <p className="summary-label">Leave</p>
              <p className="summary-count">{attendanceSummary.leave}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon halfday">◐</span>
            <div className="summary-info">
              <p className="summary-label">Half Day</p>
              <p className="summary-count">{attendanceSummary.halfDay}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="attendance-table-section">
        <div className="table-header">
          <h2 className="section-title">Attendance Record</h2>
          <div className="table-filters">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="filter-select"
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
            >
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut}</td>
                  <td>
                    <span className={`status-badge status-${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
