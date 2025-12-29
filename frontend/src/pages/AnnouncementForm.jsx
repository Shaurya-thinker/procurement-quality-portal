import React, { useState } from "react";
import { createEvent, createTraining, createMeeting } from "../api/announcements.api";

export default function AnnouncementForm({ onSuccess }) {
  const [type, setType] = useState("event");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setForm({});
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (type === "event") await createEvent(form);
      else if (type === "training") await createTraining(form);
      else if (type === "meeting") await createMeeting(form);
      setForm({});
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || "Failed to add announcement";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: 24 }} className="card">
      <h3 style={{ marginTop: 0 }}>Add Announcement</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontWeight: 600 }}>Type:</label>
          <select value={type} onChange={handleTypeChange} className="form-select">
            <option value="event">Event</option>
            <option value="training">Training</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>

        {type === "event" && (
          <>
            <input name="title" className="form-input" placeholder="Title" value={form.title || ""} onChange={handleChange} required />
            <input name="event_date" className="form-input" type="date" value={form.event_date || ""} onChange={handleChange} required />
            <textarea name="description" className="form-textarea" placeholder="Description" value={form.description || ""} onChange={handleChange} />
          </>
        )}

        {type === "training" && (
          <>
            <input name="training_name" className="form-input" placeholder="Training Name" value={form.training_name || ""} onChange={handleChange} required />
            <input name="start_date" className="form-input" type="date" value={form.start_date || ""} onChange={handleChange} required />
            <input name="end_date" className="form-input" type="date" value={form.end_date || ""} onChange={handleChange} required />
            <textarea name="description" className="form-textarea" placeholder="Description" value={form.description || ""} onChange={handleChange} />
          </>
        )}

        {type === "meeting" && (
          <>
            <input name="meeting_title" className="form-input" placeholder="Meeting Title" value={form.meeting_title || ""} onChange={handleChange} required />
            <input name="meeting_date" className="form-input" type="date" value={form.meeting_date || ""} onChange={handleChange} required />
            <input name="meeting_time" className="form-input" type="time" value={form.meeting_time || ""} onChange={handleChange} required />
            <input name="meeting_link" className="form-input" placeholder="Meeting Link" value={form.meeting_link || ""} onChange={handleChange} />
          </>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Adding..." : "Add"}</button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
      </form>
    </div>
  );
}
