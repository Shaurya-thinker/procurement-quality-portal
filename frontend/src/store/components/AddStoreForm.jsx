import { useState } from "react";
import { useStore } from "../hooks/useStore";

export default function AddStoreForm({
  initialData = {},
  isEdit = false,
  onSubmit,
  onCreated,
  onCancel,
}) {
  const { createStore, loading, error, clearError } = useStore();

  const [form, setForm] = useState({
    store_id: initialData.store_id || "",
    name: initialData.name || "",
    plant_name: initialData.plant_name || "",
    in_charge_name: initialData.in_charge_name || "",
    in_charge_mobile: initialData.in_charge_mobile || "",
    in_charge_email: initialData.in_charge_email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError && clearError();

    try {
      if (isEdit) {
        const { store_id, ...updatePayload } = form;
        await onSubmit(updatePayload);
      } else {
        await createStore(form);
        onCreated && onCreated();
      }
    } catch {
      // handled in hook
    }
  };

  /* ======================= STYLES ======================= */

  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "20px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  };

  const inputStyle = {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const actionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
  };

  const primaryBtn = {
    padding: "12px 28px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
    opacity: loading ? 0.7 : 1,
  };

  const secondaryBtn = {
    padding: "12px 28px",
    background: "white",
    color: "#374151",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  };

  const errorStyle = {
    marginTop: "16px",
    padding: "12px 16px",
    borderRadius: "8px",
    background: "#FEE2E2",
    color: "#B91C1C",
    fontSize: "14px",
    fontWeight: "500",
  };

  /* ======================= RENDER ======================= */

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>
        {isEdit ? "Edit Store" : "Create New Store"}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={gridStyle}>
          {/* Store ID */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Store ID</label>
            <input
              name="store_id"
              value={form.store_id}
              onChange={handleChange}
              disabled={isEdit}
              required
              style={{
                ...inputStyle,
                backgroundColor: isEdit ? "#f8fafc" : "white",
                cursor: isEdit ? "not-allowed" : "text",
              }}
            />
          </div>

          {/* Store Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Store Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Plant Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Plant Name</label>
            <input
              name="plant_name"
              value={form.plant_name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* In-Charge Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>In-Charge Name</label>
            <input
              name="in_charge_name"
              value={form.in_charge_name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Mobile */}
          <div style={fieldStyle}>
            <label style={labelStyle}>In-Charge Mobile</label>
            <input
              name="in_charge_mobile"
              value={form.in_charge_mobile}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={fieldStyle}>
            <label style={labelStyle}>In-Charge Email</label>
            <input
              type="email"
              name="in_charge_email"
              value={form.in_charge_email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div style={actionsStyle}>
          <button type="button" style={secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" style={primaryBtn} disabled={loading}>
            {isEdit ? "Update Store" : "Create Store"}
          </button>
        </div>
      </form>

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}
