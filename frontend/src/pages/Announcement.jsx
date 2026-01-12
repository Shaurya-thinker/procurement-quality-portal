import React, { useEffect, useState } from "react";
import {
  fetchEvents,
  fetchTrainings,
  fetchMeetings,
  deleteEvent,
  deleteTraining,
  deleteMeeting,
} from "../api/announcements.api";

import AnnouncementForm from "./AnnouncementForm";

export default function Announcement() {
  const [events, setEvents] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingItem, setEditingItem] = useState(null);
  // { type: 'event' | 'training' | 'meeting', data }

  /* ================= LOAD ================= */

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [eventsData, trainingsData, meetingsData] = await Promise.all([
        fetchEvents(),
        fetchTrainings(),
        fetchMeetings(),
      ]);
      setEvents(eventsData || []);
      setTrainings(trainingsData || []);
      setMeetings(meetingsData || []);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to load announcements"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      if (type === "event") await deleteEvent(id);
      if (type === "training") await deleteTraining(id);
      if (type === "meeting") await deleteMeeting(id);

      loadData();
    } catch (err) {
      alert(err?.response?.data?.detail || "Delete failed");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (type, data) => {
    setEditingItem({ type, data });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= COMMON INLINE STYLES ================= */

  const itemRow = {
    padding: "16px 0",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  };

  const itemContent = {
    flex: 1,
  };

  const actionGroup = {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginTop: 4,
  };

  return (
    <div className="attendance-page">
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Announcements</h1>
        <p style={{ color: "#64748b", marginTop: 6 }}>
          Company events, trainings, and meeting schedules
        </p>
      </div>

      {/* ================= LOADING / ERROR ================= */}
      {loading && (
        <div className="attendance-card">
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <div className="empty-title">Loading announcements</div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="attendance-card">
          <div className="alert alert-error">{error}</div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ================= LEFT ================= */}
          <div>
            {/* EVENTS */}
            <div className="attendance-card">
              <h2 className="section-title">Upcoming Events</h2>

              {events.length === 0 ? (
                <div className="empty-state">No events</div>
              ) : (
                events.map((e) => (
                  <div key={e.id} style={itemRow}>
                    <div style={itemContent}>
                      <div style={{ fontWeight: 700 }}>{e.title}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>
                        {e.event_date}
                      </div>
                      {e.description && (
                        <div style={{ marginTop: 6 }}>{e.description}</div>
                      )}
                    </div>

                    <div style={actionGroup}>
                      <button
                        className="btn-primary"
                        onClick={() => handleEdit("event", e)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger btn-small"
                        onClick={() => handleDelete("event", e.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* TRAININGS */}
            <div className="attendance-card">
              <h2 className="section-title">Trainings</h2>

              {trainings.length === 0 ? (
                <div className="empty-state">No trainings</div>
              ) : (
                trainings.map((t) => (
                  <div key={t.id} style={itemRow}>
                    <div style={itemContent}>
                      <div style={{ fontWeight: 700 }}>
                        {t.training_name}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>
                        {t.start_date} → {t.end_date}
                      </div>
                      {t.description && (
                        <div style={{ marginTop: 6 }}>{t.description}</div>
                      )}
                    </div>

                    <div style={actionGroup}>
                      <button
                        className="btn-primary"
                        onClick={() => handleEdit("training", t)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger btn-small"
                        onClick={() => handleDelete("training", t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* MEETINGS */}
            <div className="attendance-card">
              <h2 className="section-title">Meetings</h2>

              {meetings.length === 0 ? (
                <div className="empty-state">No meetings</div>
              ) : (
                meetings.map((m) => (
                  <div key={m.id} style={itemRow}>
                    <div style={itemContent}>
                      <div style={{ fontWeight: 700 }}>
                        {m.meeting_title}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>
                        {m.meeting_date} {m.meeting_time || ""}
                      </div>
                    </div>

                    <div style={actionGroup}>
                      <button
                        className="btn-primary"
                        onClick={() => handleEdit("meeting", m)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger btn-small"
                        onClick={() => handleDelete("meeting", m.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ================= RIGHT FORM ================= */}
          <div style={{ position: "sticky", top: 24 }}>
            <AnnouncementForm
              editingItem={editingItem}
              clearEdit={() => setEditingItem(null)}
              onSuccess={() => {
                setEditingItem(null);
                loadData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
