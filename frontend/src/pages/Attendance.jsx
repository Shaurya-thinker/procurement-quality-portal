import { useEffect, useState } from 'react';
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
} from '../api/attendanceApi';

import AttendanceStatusBadge from './AttendanceStatusBadge';
import './Attendance.css';

export default function Attendance() {
  const [todayData, setTodayData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);


  const userId = 1; // TODO: auth context

  useEffect(() => {
    refresh();
  }, []);

  /* ================= DATA LOAD ================= */

  const refresh = () => {
    loadToday();
    loadHistory();
  };

  const loadToday = async () => {
    try {
      const res = await getTodayAttendance(userId);
      setTodayData(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setTodayData({
          user_id: userId,
          check_in_time: null,
          check_out_time: null,
          total_worked_minutes: null,
          status: 'NOT_STARTED',
          can_check_in: true,
          can_check_out: false,
        });
      } else {
        handleError(err, "Failed to load today's attendance");
      }
    }
  };

  const loadHistory = async () => {
    try {
      const res = await getAttendanceHistory(userId);
      setHistory(res.data.records || []);
    } catch (err) {
      handleError(err, 'Failed to load attendance history');
    }
  };

  /* ================= ACTIONS ================= */

  const handleCheckIn = async () => {
    setLoading(true);
    clearMessages();
    try {
      await checkIn(userId);
      setSuccess('Checked in successfully');
      refresh();
    } catch (err) {
      handleError(err, 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!window.confirm('Are you sure you want to check out?')) return;

    setLoading(true);
    clearMessages();
    try {
      await checkOut(userId);
      setSuccess('Checked out successfully');
      refresh();
    } catch (err) {
      handleError(err, 'Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleError = (err, fallback) => {
    const msg =
      err.response?.data?.detail ||
      err.message ||
      fallback;

    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const formatTime = (v) =>
    v
      ? new Date(v).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '--';

  const formatDuration = (m) => {
    if (m === null || m === undefined) return '--';
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });


  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Empty slots before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Actual days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const getStatusForDate = (date) => {
    if (!date) return null;

    const dayStr = date.toISOString().split('T')[0];

    const record = history.find(
      (h) => h.attendance_date === dayStr
    );

    return record?.status || null;
  };


  /* ================= RENDER ================= */

  return (
    <div className="attendance-page">
      <h1 className="page-title">Attendance & Time Tracking</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}


      {/* ================= CALENDAR ================= */}
      <div className="attendance-card">
        <div className="card-header calendar-header">
          <h2 className="section-title">
            {currentMonth.toLocaleString('default', { month: 'long' })}{' '}
            {currentMonth.getFullYear()}
          </h2>

          <div className="calendar-nav">
            <button onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
              )
            }>
              ‹
            </button>
            <button onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
              )
            }>
              ›
            </button>
          </div>
        </div>

        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="weekday">{d}</div>
          ))}
        </div>

        <div className="calendar-days">
          {getMonthDays(currentMonth).map((day, idx) => {
            const status = getStatusForDate(day);

            return (
              <div
                key={idx}
                className={`calendar-day 
                  ${!day ? 'empty' : ''} 
                  ${status ? status.toLowerCase() : ''}`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day?.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="attendance-card">
          <h3 className="section-title">
            {formatDate(selectedDate)}
          </h3>
          <p>Status: {getStatusForDate(selectedDate) || 'No record'}</p>
        </div>
      )}

      {/* ================= TODAY ================= */}
      <div className="attendance-card">
        <div className="card-header">
          <h2 className="section-title">Today's Attendance</h2>
        </div>

        <div className="summary-grid">
          <SummaryItem label="Check-in" value={formatTime(todayData?.check_in_time)} />
          <SummaryItem label="Check-out" value={formatTime(todayData?.check_out_time)} />
          <SummaryItem
            label="Total Worked"
            value={formatDuration(todayData?.total_worked_minutes)}
          />
          <div className="summary-item status">
            <div className="summary-label">Status</div>
            <AttendanceStatusBadge status={todayData?.status} />
          </div>
        </div>

        <div className="attendance-actions">
          <button
            className="btn-primary"
            disabled={loading || !todayData?.can_check_in || todayData?.status === 'COMPLETED'}
            onClick={handleCheckIn}
          >
            {loading ? 'Processing…' : 'Check In'}
          </button>

          <button
            className="btn-danger"
            disabled={loading || !todayData?.can_check_out}
            onClick={handleCheckOut}
          >
            {loading ? 'Processing…' : 'Check Out'}
          </button>
        </div>
      </div>

      {/* ================= HISTORY ================= */}
      <div className="attendance-card">
        <div className="card-header">
          <h2 className="section-title">Attendance History</h2>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <div className="empty-title">No attendance records</div>
            <div className="empty-text">
              Start by checking in to track your workday
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r, i) => (
                  <tr key={i}>
                    <td>{formatDate(r.attendance_date)}</td>
                    <td>{formatTime(r.check_in_time)}</td>
                    <td>{formatTime(r.check_out_time)}</td>
                    <td>{formatDuration(r.total_worked_minutes)}</td>
                    <td>
                      <AttendanceStatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SUB COMPONENT ================= */

const SummaryItem = ({ label, value }) => (
  <div className="summary-item">
    <div className="summary-label">{label}</div>
    <div className="summary-value">{value}</div>
  </div>
);

