import api from "./api";

export const checkIn = (userId) =>
  api.post("/api/v1/attendance/check-in", { user_id: userId });

export const checkOut = (userId) =>
  api.post("/api/v1/attendance/check-out", { user_id: userId });

export const getTodayAttendance = (userId) =>
  api.get(`/api/v1/attendance/today/${userId}`);

export const getAttendanceHistory = (userId, limit = 30) =>
  api.get(`/api/v1/attendance/history/${userId}?limit=${limit}`);