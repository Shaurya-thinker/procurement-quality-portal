import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchContractorById,
  updateContractor,
} from "../../api/contractors.api";
import ContractorForm from "../components/ContractorForm";

export default function EditContractor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContractorById(id)
      .then(setFormData)
      .catch(() => setError("Failed to load contractor details"));
  }, [id]);

  if (!formData) {
    return <div style={{ padding: 32 }}>Loading contractor...</div>;
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateContractor(id, formData);
      navigate(`/contractors/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update contractor");
      setSaving(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* Back Button */}
      <button
        onClick={() => navigate(`/contractors/${id}`)}
        style={backButtonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#cbd5f5")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#e2e8f0")
        }
      >
        ← Back to Contractor Details
      </button>

      {/* Card */}
      <div style={cardStyle}>
        <h1 style={headingStyle}>Edit Contractor</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <ContractorForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/contractors/${id}`)}
          submitLabel={saving ? "Updating..." : "Update Contractor"}
        />
      </div>
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
