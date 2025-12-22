import { useState, useEffect } from 'react';
import { checkIn, checkOut, getTodayAttendance, getAttendanceHistory } from '../api/attendanceApi';

export default function Attendance() {
  const [todayData, setTodayData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Mock user ID - in real app, get from auth context
  const userId = 1;

  useEffect(() => {
    loadTodayAttendance();
    loadHistory();
  }, []);

  const loadTodayAttendance = async () => {
    try {
      const response = await getTodayAttendance(userId);
      setTodayData(response.data);
    } catch (err) {
      console.log('Today attendance error:', err.response?.data);
      // Only show error for actual server errors, not missing attendance
      if (err.response?.status !== 404) {
        handleError(err, 'Failed to load today\'s attendance');
      } else {
        // Handle 404 as NOT_STARTED state
        const today = new Date().toISOString().split('T')[0];
        setTodayData({
          user_id: userId,
          attendance_date: today,
          check_in_time: null,
          check_out_time: null,
          total_worked_minutes: null,
          status: 'NOT_STARTED',
          can_check_in: true,
          can_check_out: false
        });
      }
    }
  };

  const loadHistory = async () => {
    try {
      const response = await getAttendanceHistory(userId);
      setHistory(response.data.records || []);
    } catch (err) {
      console.log('History error:', err.response?.data);
      handleError(err, 'Failed to load attendance history');
    }
  };

  const handleError = (err, defaultMessage) => {
    console.log('Full error object:', err);
    console.log('Error response data:', err.response?.data);
    
    let errorMessage = defaultMessage;
    
    if (err.response?.data) {
      const errorData = err.response.data;
      
      if (errorData.detail && Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map(error => 
          `${error.loc?.join('.')} - ${error.msg}`
        ).join('; ');
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    console.log('[FRONTEND] Attempting check-in for user:', userId);
    console.log('[FRONTEND] API call will be made to:', 'POST /api/v1/attendance/check-in');
    
    try {
      const response = await checkIn(userId);
      console.log('[FRONTEND] Check-in response:', response);
      setSuccess('Successfully checked in!');
      loadTodayAttendance();
      loadHistory();
    } catch (err) {
      console.log('[FRONTEND] Check-in error:', err);
      console.log('[FRONTEND] Error response:', err.response);
      handleError(err, 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await checkOut(userId);
      setSuccess('Successfully checked out!');
      loadTodayAttendance();
      loadHistory();
    } catch (err) {
      handleError(err, 'Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1f2937' }}>
        Attendance & Time Tracking
      </h1>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#7f1d1d',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#dcfce7',
          color: '#15803d',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {success}
        </div>
      )}

      {/* Today's Summary */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Today's Attendance
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Check-in Time</div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
              {formatTime(todayData?.check_in_time)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Check-out Time</div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
              {formatTime(todayData?.check_out_time)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Worked</div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
              {formatDuration(todayData?.total_worked_minutes)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: todayData?.status === 'COMPLETED' ? '#059669' : 
                     todayData?.status === 'IN_PROGRESS' ? '#d97706' : '#6b7280',
              textTransform: 'capitalize'
            }}>
              {todayData?.status?.replace('_', ' ') || 'Not Started'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCheckIn}
            disabled={loading || !todayData?.can_check_in}
            style={{
              padding: '10px 20px',
              backgroundColor: todayData?.can_check_in ? '#10b981' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: todayData?.can_check_in ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Processing...' : 'Check In'}
          </button>
          
          <button
            onClick={handleCheckOut}
            disabled={loading || !todayData?.can_check_out}
            style={{
              padding: '10px 20px',
              backgroundColor: todayData?.can_check_out ? '#ef4444' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: todayData?.can_check_out ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Processing...' : 'Check Out'}
          </button>
        </div>
      </div>

      {/* Attendance History */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Attendance History
        </h2>
        
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '24px' }}>
            No attendance records found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', fontSize: '12px', color: '#374151', fontWeight: '600' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', fontSize: '12px', color: '#374151', fontWeight: '600' }}>
                    Check In
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', fontSize: '12px', color: '#374151', fontWeight: '600' }}>
                    Check Out
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', fontSize: '12px', color: '#374151', fontWeight: '600' }}>
                    Total Time
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', fontSize: '12px', color: '#374151', fontWeight: '600' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                      {formatDate(record.attendance_date)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                      {formatTime(record.check_in_time)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                      {formatTime(record.check_out_time)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                      {formatDuration(record.total_worked_minutes)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                      <span style={{
                        color: record.status === 'COMPLETED' ? '#059669' : '#d97706',
                        textTransform: 'capitalize'
                      }}>
                        {record.status?.replace('_', ' ')}
                      </span>
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