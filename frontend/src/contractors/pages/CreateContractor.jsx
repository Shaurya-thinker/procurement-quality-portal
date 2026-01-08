import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createContractor } from "../../api/contractors.api";
import ContractorForm from "../components/ContractorForm";

export default function CreateContractor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    alternate_phone: "",
    email: "",
    address: "",
    remarks: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createContractor(formData);
      navigate("/contractors");
    } catch (err) {
      console.error(err);
      setError("Failed to save contractor");
      setSaving(false);
    }
  };

  return (
    <div style={pageStyle}>
      <button
        onClick={() => navigate("/contractors")}
        style={backButtonStyle}
      >
        ← Back to Contractors
      </button>

      <div style={cardStyle}>
        <h1 style={headingStyle}>Create Contractor</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <ContractorForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/contractors")}
          submitLabel={saving ? "Saving..." : "Save Contractor"}
        />
      </div>
    </div>
  );
}

/* ---------- Styles (keep as-is) ---------- */

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
