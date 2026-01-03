const normalize = (obj) => {
  const copy = { ...obj };
  delete copy.created_at;
  delete copy.updated_at;
  return copy;
};


import React, { useEffect, useState } from "react";
import {
  createEvent,
  createTraining,
  createMeeting,
  updateEvent,
  updateTraining,
  updateMeeting,
} from "../api/announcements.api";

export default function AnnouncementForm({
  onSuccess,
  editingItem,
  clearEdit,
}) {
  const [type, setType] = useState("event");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalData, setOriginalData] = useState(null);


  const isEditMode = Boolean(editingItem);

  /* ================= PREFILL ON EDIT ================= */

  useEffect(() => {
    if (editingItem) {
      const clean = normalize(editingItem.data);
      setType(editingItem.type);
      setForm(clean);
      setOriginalData(clean);
    }
  }, [editingItem]);



  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setForm({});
    setError("");
    if (clearEdit) clearEdit();
  };

  const isUnchanged = () => {
    if (!originalData) return false;

    return (
      JSON.stringify(normalize(form)) ===
      JSON.stringify(normalize(originalData))
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isEditMode && isUnchanged()) {
      setError("No changes detected. Please modify something before updating.");
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        if (type === "event") await updateEvent(form.id, normalize(form));
        if (type === "training") await updateTraining(form.id, normalize(form));
        if (type === "meeting") await updateMeeting(form.id, normalize(form));

      } else {
        if (type === "event") await createEvent(form);
        if (type === "training") await createTraining(form);
        if (type === "meeting") await createMeeting(form);
      }

      setForm({});
      if (clearEdit) clearEdit();
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err?.response?.status === 409) {
        setError("An announcement with the same details already exists.");
      } else {
        setError(
          err?.response?.data?.detail ||
          err.message ||
          "Failed to save announcement"
        );
      }
    } finally {
      setLoading(false);
    }
  };



  /* ================= COMMON STYLES ================= */

  const fieldWrapper = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const gridTwo = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  };

  const sectionGap = {
    display: "grid",
    gap: 18,
  };

  return (
    <div className="attendance-card" style={{ padding: 24 }}>
      {/* HEADER */}
      <div className="card-header" style={{ marginBottom: 20 }}>
        <h2 className="section-title">
          {isEditMode ? "Edit Announcement" : "Add Announcement"}
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          {isEditMode
            ? "Update the selected announcement"
            : "Create an event, training, or meeting"}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 22 }}>
        {/* TYPE SELECT */}
        <div style={fieldWrapper}>
          <label className="summary-label">Announcement Type</label>
          <select
            value={type}
            onChange={handleTypeChange}
            className="form-select"
            disabled={isEditMode}
            style={{ height: 42 }}
          >
            <option value="event">Event</option>
            <option value="training">Training</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>

        {/* ================= EVENT ================= */}
        {type === "event" && (
          <div style={sectionGap}>
            <div style={fieldWrapper}>
              <label className="summary-label">Title</label>
              <input
                name="title"
                className="form-input"
                placeholder="Event title"
                value={form.title || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div style={fieldWrapper}>
              <label className="summary-label">Event Date</label>
              <input
                name="event_date"
                type="date"
                className="form-input"
                value={form.event_date || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div style={fieldWrapper}>
              <label className="summary-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Optional description"
                value={form.description || ""}
                onChange={handleChange}
                style={{ minHeight: 90, resize: "vertical" }}
              />
            </div>
          </div>
        )}

        {/* ================= TRAINING ================= */}
        {type === "training" && (
          <div style={sectionGap}>
            <div style={fieldWrapper}>
              <label className="summary-label">Training Name</label>
              <input
                name="training_name"
                className="form-input"
                placeholder="Training program name"
                value={form.training_name || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div style={gridTwo}>
              <div style={fieldWrapper}>
                <label className="summary-label">Start Date</label>
                <input
                  name="start_date"
                  type="date"
                  className="form-input"
                  value={form.start_date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={fieldWrapper}>
                <label className="summary-label">End Date</label>
                <input
                  name="end_date"
                  type="date"
                  className="form-input"
                  value={form.end_date || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={fieldWrapper}>
              <label className="summary-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Optional description"
                value={form.description || ""}
                onChange={handleChange}
                style={{ minHeight: 90, resize: "vertical" }}
              />
            </div>
          </div>
        )}

        {/* ================= MEETING ================= */}
        {type === "meeting" && (
          <div style={sectionGap}>
            <div style={fieldWrapper}>
              <label className="summary-label">Meeting Title</label>
              <input
                name="meeting_title"
                className="form-input"
                placeholder="Meeting subject"
                value={form.meeting_title || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div style={gridTwo}>
              <div style={fieldWrapper}>
                <label className="summary-label">Meeting Date</label>
                <input
                  name="meeting_date"
                  type="date"
                  className="form-input"
                  value={form.meeting_date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={fieldWrapper}>
                <label className="summary-label">Meeting Time</label>
                <input
                  name="meeting_time"
                  type="time"
                  className="form-input"
                  value={form.meeting_time || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={fieldWrapper}>
              <label className="summary-label">Meeting Link</label>
              <input
                name="meeting_link"
                className="form-input"
                placeholder="Optional meeting link"
                value={form.meeting_link || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || (isEditMode && isUnchanged())}
            style={{ height: 44, fontSize: 15, fontWeight: 600 }}
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Announcement"
              : "Add Announcement"}
          </button>

          {isEditMode && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setForm({});
                clearEdit();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
