import api from './axios';

const ATTENDANCE_API = '/api/v1/attendance';

export const attendanceApi = {
  // Create attendance record
  createAttendance: async (attendanceData) => {
    const response = await api.post(ATTENDANCE_API, attendanceData);
    return response.data;
  },

  // Get attendance record by ID
  getAttendanceById: async (attendanceId) => {
    const response = await api.get(`${ATTENDANCE_API}/${attendanceId}`);
    return response.data;
  },

  // Get user attendance records
  getUserAttendance: async (userId, month = null, year = null) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await api.get(`${ATTENDANCE_API}/user/${userId}`, { params });
    return response.data;
  },

  // Check in
  checkIn: async (userId) => {
    const response = await api.post(`${ATTENDANCE_API}/check-in`, {
      user_id: userId,
      action: 'check_in',
    });
    return response.data;
  },

  // Check out
  checkOut: async (userId) => {
    const response = await api.post(`${ATTENDANCE_API}/check-out`, {
      user_id: userId,
      action: 'check_out',
    });
    return response.data;
  },

  // Get today's attendance status
  getTodayStatus: async (userId) => {
    const response = await api.get(`${ATTENDANCE_API}/user/${userId}/today`);
    return response.data;
  },

  // Get attendance summary
  getAttendanceSummary: async (userId, month, year) => {
    const response = await api.get(
      `${ATTENDANCE_API}/user/${userId}/summary`,
      {
        params: { month, year },
      }
    );
    return response.data;
  },

  // Update attendance record
  updateAttendance: async (attendanceId, attendanceData) => {
    const response = await api.put(
      `${ATTENDANCE_API}/${attendanceId}`,
      attendanceData
    );
    return response.data;
  },
};
