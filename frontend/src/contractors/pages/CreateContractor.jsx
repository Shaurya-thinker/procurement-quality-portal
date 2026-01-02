import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createContractor } from "../../api/contractors.api";

export default function CreateContractor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await createContractor(formData);
      navigate("/contractors");
    } catch (err) {
      console.error("Failed to create contractor", err);
      setError("Failed to save contractor. Please check backend.");
      setSaving(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/contractors")}
        style={backButtonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#cbd5f5")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#e2e8f0")
        }
      >
        ← Back to Contractors
      </button>

      {/* Card */}
      <div style={cardStyle}>
        <h1 style={headingStyle}>Create Contractor</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <FormField
              label="Contractor Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FormField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormTextarea
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div style={actionRowStyle}>
            <button
              type="button"
              onClick={() => navigate("/contractors")}
              style={secondaryButtonStyle}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={primaryButtonStyle}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Contractor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

function FormTextarea({ label, name, value, onChange }) {
  return (
    <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        style={textareaStyle}
      />
    </div>
  );
}

/* ---------- Styles ---------- */

const pageStyle = {
  padding: "32px",
  maxWidth: "900px",
  margin: "0 auto",
};

const backButtonStyle = {
  marginBottom: "20px",
  padding: "10px 18px",
  background: "#e2e8f0",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.2s ease",
};

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "32px",
  border: "1px solid #f1f5f9",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const headingStyle = {
  fontSize: "26px",
  fontWeight: 700,
  marginBottom: "28px",
  color: "#0f172a",
};

const errorStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "12px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "20px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px 24px",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "6px",
  color: "#1e293b",
};

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  outline: "none",
};

const textareaStyle = {
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  resize: "vertical",
};

const actionRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "32px",
};

const secondaryButtonStyle = {
  padding: "12px 22px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  fontWeight: 600,
  cursor: "pointer",
};

const primaryButtonStyle = {
  padding: "12px 26px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};
