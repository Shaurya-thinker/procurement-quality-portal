import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  fetchEvents as apiFetchEvents,
  fetchTrainings as apiFetchTrainings,
  fetchMeetings as apiFetchMeetings,
  createEvent as apiCreateEvent,
  createTraining as apiCreateTraining,
  createMeeting as apiCreateMeeting,
} from '../../api/announcements.api';

const AnnouncementsContext = createContext(null);

export function AnnouncementsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ev, tr, mt] = await Promise.all([
        apiFetchEvents(),
        apiFetchTrainings(),
        apiFetchMeetings(),
      ]);
      setEvents(Array.isArray(ev) ? ev : []);
      setTrainings(Array.isArray(tr) ? tr : []);
      setMeetings(Array.isArray(mt) ? mt : []);
    } catch (err) {
      setError(err?.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const createEvent = async (payload) => {
    const res = await apiCreateEvent(payload);
    await loadAll();
    return res;
  };

  const createTraining = async (payload) => {
    const res = await apiCreateTraining(payload);
    await loadAll();
    return res;
  };

  const createMeeting = async (payload) => {
    const res = await apiCreateMeeting(payload);
    await loadAll();
    return res;
  };

  const announcements = [
    ...events.map((e) => ({ ...e, type: 'Event', date: e.event_date })),
    ...trainings.map((t) => ({ ...t, type: 'Training', date: t.start_date })),
    ...meetings.map((m) => ({ ...m, type: 'Meeting', date: m.meeting_date })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <AnnouncementsContext.Provider value={{ events, trainings, meetings, announcements, loading, error, loadAll, createEvent, createTraining, createMeeting }}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  return useContext(AnnouncementsContext);
}

export default AnnouncementsContext;
