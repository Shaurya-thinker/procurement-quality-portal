
import React, { useEffect, useState } from "react";
import { fetchEvents, fetchTrainings, fetchMeetings } from "../api/announcements.api";
import AnnouncementForm from "./AnnouncementForm";

export default function Announcement() {
  const [events, setEvents] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [eventsData, trainingsData, meetingsData] = await Promise.all([
        fetchEvents(),
        fetchTrainings(),
        fetchMeetings(),
      ]);
      setEvents(eventsData);
      setTrainings(trainingsData);
      setMeetings(meetingsData);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || "Failed to load announcements";
      console.error("Announcements load error:", err);
      setError(msg);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <div>Loading Announcements...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Announcements</h2>
      {error && (
        <div style={{ marginBottom: 12 }} className="card">
          <strong style={{ color: 'red' }}>Error:</strong> {error}
          <div style={{ marginTop: 8 }}>
            <button className="btn-secondary" onClick={loadData}>Retry</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Upcoming Events</h3>
            {events.length === 0 ? <div>No events yet</div> : (
              <ul>
                {events.map((e) => (
                  <li key={e.id} style={{ marginBottom: 12 }}>
                    <strong>{e.title}</strong> — <span style={{ color: '#6b7280' }}>{e.event_date}</span>
                    <div style={{ marginTop: 6 }}>{e.description}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Trainings</h3>
            {trainings.length === 0 ? <div>No trainings yet</div> : (
              <ul>
                {trainings.map((t) => (
                  <li key={t.id} style={{ marginBottom: 12 }}>
                    <strong>{t.training_name}</strong>
                    <div style={{ color: '#6b7280' }}>{t.start_date} — {t.end_date}</div>
                    <div style={{ marginTop: 6 }}>{t.description}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Meetings</h3>
            {meetings.length === 0 ? <div>No meetings yet</div> : (
              <ul>
                {meetings.map((m) => (
                  <li key={m.id} style={{ marginBottom: 12 }}>
                    <strong>{m.meeting_title}</strong>
                    <div style={{ color: '#6b7280' }}>{m.meeting_date} {m.meeting_time || ''}</div>
                    {m.meeting_link && <div style={{ marginTop: 6 }}><a href={m.meeting_link}>Join meeting</a></div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <AnnouncementForm onSuccess={loadData} />
        </div>
      </div>
    </div>
  );
}
