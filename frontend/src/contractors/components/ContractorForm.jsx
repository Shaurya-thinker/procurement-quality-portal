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
      {/* Contractor Name */}
      <div className="form-group">
        <label className="form-label">Contractor Name *</label>
        <input
          type="text"
          name="name"
          className="form-input"
          value={formData.name}
          onChange={onChange}
          required
          autoFocus
        />
      </div>

      {/* Contact Person */}
      <div className="form-group">
        <label className="form-label">Contact Person</label>
        <input
          type="text"
          name="contact_person"
          className="form-input"
          value={formData.contact_person || ""}
          onChange={onChange}
        />
      </div>

      {/* Phone */}
      <div className="form-group">
        <label className="form-label">Phone Number *</label>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          placeholder="10-digit number"
          className="form-input"
          value={formData.phone}
          onChange={onChange}
          required
        />
      </div>

      {/* Alternate Phone */}
      <div className="form-group">
        <label className="form-label">Alternate Phone</label>
        <input
          type="text"
          name="alternate_phone"
          className="form-input"
          value={formData.alternate_phone || ""}
          onChange={onChange}
        />
      </div>

      {/* Email */}
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

      {/* Address */}
      <div className="form-group">
        <label className="form-label">Address</label>
        <textarea
          name="address"
          rows={2}
          className="form-input"
          value={formData.address || ""}
          onChange={onChange}
        />
      </div>

      {/* Remarks */}
      <div className="form-group">
        <label className="form-label">Remarks</label>
        <textarea
          name="remarks"
          rows={2}
          className="form-input"
          value={formData.remarks || ""}
          onChange={onChange}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="button" className="btn-danger" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" className="btn-primary" disabled={submitLabel === "Saving..."}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
