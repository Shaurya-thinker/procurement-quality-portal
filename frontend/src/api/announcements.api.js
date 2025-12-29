import api from './axios';

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

export const createEvent = async (payload) => {
  const res = await api.post('/api/v1/announcements/events', payload);
  return res.data;
};

export const createTraining = async (payload) => {
  const res = await api.post('/api/v1/announcements/trainings', payload);
  return res.data;
};

export const createMeeting = async (payload) => {
  const res = await api.post('/api/v1/announcements/meetings', payload);
  return res.data;
};
