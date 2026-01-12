import api from './api';

/* =======================
   FETCH (NON-DELETED)
======================= */

export const fetchEvents = async () => {
  const res = await api.get('/api/v1/announcements/events');
  return res.data;
};

export const fetchTrainings = async () => {
  const res = await api.get('/api/v1/announcements/trainings');
  return res.data;
};

export const fetchMeetings = async () => {
  const res = await api.get('/api/v1/announcements/meetings');
  return res.data;
};

/* =======================
   CREATE
======================= */

export const createEvent = async (payload) => {
  try {
    const res = await api.post('/api/v1/announcements/events', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to create event';
  }
};

export const createTraining = async (payload) => {
  try {
    const res = await api.post('/api/v1/announcements/trainings', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to create training';
  }
};

export const createMeeting = async (payload) => {
  try {
    const res = await api.post('/api/v1/announcements/meetings', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to create meeting';
  }
};

/* =======================
   UPDATE
======================= */

export const updateEvent = async (id, payload) => {
  try {
    const res = await api.put(`/api/v1/announcements/events/${id}`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to update event';
  }
};

export const updateTraining = async (id, payload) => {
  try {
    const res = await api.put(`/api/v1/announcements/trainings/${id}`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to update training';
  }
};

export const updateMeeting = async (id, payload) => {
  try {
    const res = await api.put(`/api/v1/announcements/meetings/${id}`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to update meeting';
  }
};

/* =======================
   SOFT DELETE
======================= */

export const deleteEvent = async (id) => {
  try {
    const res = await api.delete(`/api/v1/announcements/events/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to delete event';
  }
};

export const deleteTraining = async (id) => {
  try {
    const res = await api.delete(`/api/v1/announcements/trainings/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to delete training';
  }
};

export const deleteMeeting = async (id) => {
  try {
    const res = await api.delete(`/api/v1/announcements/meetings/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data?.detail || 'Failed to delete meeting';
  }
};
