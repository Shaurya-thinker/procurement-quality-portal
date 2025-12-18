import { useState } from 'react';
import './Attendance.css';
import CheckIcon from '../layout/icons/CheckIcon';
import CalendarIcon from '../layout/icons/CalendarIcon';

export default function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedYear, setSelectedYear] = useState('2024');

  const attendanceData = [
    { date: '01 Dec 2024', checkIn: '09:00 AM', checkOut: '06:15 PM', status: 'Present', break: '45m', overtime: '1h 15m' },
    { date: '02 Dec 2024', checkIn: '09:10 AM', checkOut: '06:00 PM', status: 'Late', break: '30m', overtime: '0h' },
    { date: '03 Dec 2024', checkIn: '—', checkOut: '—', status: 'Absent', break: '—', overtime: '—' },
    { date: '04 Dec 2024', checkIn: '09:05 AM', checkOut: '05:45 PM', status: 'Present', break: '40m', overtime: '0h' },
    { date: '05 Dec 2024', checkIn: '—', checkOut: '—', status: 'Leave', break: '—', overtime: '—' },
    { date: '06 Dec 2024', checkIn: '09:00 AM', checkOut: '06:30 PM', status: 'Present', break: '50m', overtime: '1h 30m' },
    { date: '07 Dec 2024', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', break: '45m', overtime: '0h' },
    { date: '08 Dec 2024', checkIn: '09:15 AM', checkOut: '06:00 PM', status: 'Late', break: '35m', overtime: '0h' },
  ];

  const attendanceSummary = {
    present: 18,
    absent: 2,
    late: 3,
    overtime: 12,
  };

  const timeDistribution = {
    productive: 75,
    break: 15,
    overtime: 10,
  };

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthStart = 5; // December 2024 starts on Sunday (0-indexed)

  return (
    <div className="attendance-page">
      <h1 className="page-title">Attendance</h1>

      <div className="attendance-layout">
        <div className="calendar-section">
          <div className="calendar-header">
            <h2 className="calendar-title">December 2024</h2>
            <CalendarIcon size={20} />
          </div>
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {Array.from({ length: monthStart }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day empty"></div>
              ))}
              {calendarDays.map(day => (
                <div key={day} className={`calendar-day ${day <= 8 ? 'present' : ''} ${day === 3 ? 'absent' : ''} ${day === 5 ? 'leave' : ''}`}>
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-card present">
              <div className="summary-icon"><CheckIcon size={20} /></div>
              <div className="summary-content">
                <div className="summary-value">{attendanceSummary.present}</div>
                <div className="summary-label">Present</div>
              </div>
            </div>
            <div className="summary-card absent">
              <div className="summary-icon">✕</div>
              <div className="summary-content">
                <div className="summary-value">{attendanceSummary.absent}</div>
                <div className="summary-label">Absent</div>
              </div>
            </div>
            <div className="summary-card late">
              <div className="summary-icon">⏰</div>
              <div className="summary-content">
                <div className="summary-value">{attendanceSummary.late}</div>
                <div className="summary-label">Late</div>
              </div>
            </div>
            <div className="summary-card overtime">
              <div className="summary-icon">⏱</div>
              <div className="summary-content">
                <div className="summary-value">{attendanceSummary.overtime}</div>
                <div className="summary-label">Overtime</div>
              </div>
            </div>
          </div>
        </div>

        <div className="attendance-details">
          <div className="time-distribution">
            <h3 className="distribution-title">Time Distribution</h3>
            <div className="distribution-bar">
              <div className="bar-segment productive" style={{ width: `${timeDistribution.productive}%` }}>
                <span className="bar-label">{timeDistribution.productive}%</span>
              </div>
              <div className="bar-segment break" style={{ width: `${timeDistribution.break}%` }}>
                <span className="bar-label">{timeDistribution.break}%</span>
              </div>
              <div className="bar-segment overtime" style={{ width: `${timeDistribution.overtime}%` }}>
                <span className="bar-label">{timeDistribution.overtime}%</span>
              </div>
            </div>
            <div className="distribution-legend">
              <div className="legend-item">
                <span className="legend-dot productive"></span>
                <span className="legend-text">Productive Hours</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot break"></span>
                <span className="legend-text">Break Time</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot overtime"></span>
                <span className="legend-text">Overtime</span>
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
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th>Break</th>
                    <th>Overtime</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td className="date-cell">{record.date}</td>
                      <td>{record.checkIn}</td>
                      <td>{record.checkOut}</td>
                      <td>
                        <span className={`status-badge status-${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.break}</td>
                      <td className="overtime-cell">{record.overtime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
