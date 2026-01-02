export default function ContractorForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Save Contractor",
}) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <div className="form-group">
        <label className="form-label">Contractor Name</label>
        <input
          type="text"
          name="name"
          className="form-input"
          value={formData.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          type="text"
          name="phone"
          className="form-input"
          value={formData.phone}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-input"
          value={formData.email || ""}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Address</label>
        <textarea
          name="address"
          rows={3}
          className="form-input"
          value={formData.address || ""}
          onChange={onChange}
        />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
