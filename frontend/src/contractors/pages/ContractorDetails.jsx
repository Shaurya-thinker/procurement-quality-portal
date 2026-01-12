import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchContractorById,
  deactivateContractor,
  blacklistContractor,
  activateContractor,
} from "../../api/contractors.api";

export default function ContractorDetails() {
  const { contractorId } = useParams();
  const navigate = useNavigate();

  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!contractorId) {
      setError("Invalid contractor id");
      setLoading(false);
      return;
    }

    const loadContractor = async () => {
      try {
        const data = await fetchContractorById(contractorId);
        setContractor(data);
      } catch (err) {
        setError("Failed to load contractor details");
      } finally {
        setLoading(false);
      }
    };

    loadContractor();
  }, [contractorId]);

  const handleDeactivate = async () => {
    if (!window.confirm("Deactivate this contractor?")) return;
    setActionLoading(true);
    const updated = await deactivateContractor(contractorId);
    setContractor(updated);
    setActionLoading(false);
  };

  const handleBlacklist = async () => {
    if (!window.confirm("Blacklist this contractor permanently?")) return;
    setActionLoading(true);
    const updated = await blacklistContractor(contractorId);
    setContractor(updated);
    setActionLoading(false);
  };

  const handleActivate = async () => {
    setActionLoading(true);
    const updated = await activateContractor(contractorId);
    setContractor(updated);
    setActionLoading(false);
  };

  if (loading) return <div style={{ padding: 24 }}>Loading contractor...</div>;
  if (error) return <div style={{ padding: 24, color: "#b91c1c" }}>{error}</div>;
  if (!contractor) return <div style={{ padding: 24 }}>Contractor not found</div>;

  return (
    <div style={pageStyle}>
      <button
        onClick={() => navigate("/contractors")}
        style={backButtonStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#cbd5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#e2e8f0")}
      >
        ← Back to Contractors
      </button>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={nameStyle}>{contractor.name}</h1>
            <span
              style={{
                ...statusPill,
                background:
                  contractor.status === "ACTIVE"
                    ? "#dcfce7"
                    : contractor.status === "INACTIVE"
                    ? "#fef3c7"
                    : "#fee2e2",
                color:
                  contractor.status === "ACTIVE"
                    ? "#166534"
                    : contractor.status === "INACTIVE"
                    ? "#92400e"
                    : "#991b1b",
              }}
            >
              {contractor.status}
            </span>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={detailsGrid}>
          <DetailItem label="Phone" value={contractor.phone} />
          <DetailItem label="Alternate Phone" value={contractor.alternate_phone} />
          <DetailItem label="Contact Person" value={contractor.contact_person} />
          <DetailItem label="Email" value={contractor.email} />
          <DetailItem label="Address" value={contractor.address} full />
          <DetailItem label="Remarks" value={contractor.remarks} full />
        </div>

        <div style={actionBar}>
          {contractor.status === "ACTIVE" && (
            <>
              <button
                style={editButtonStyle}
                onClick={() =>
                  navigate(`/contractors/${contractorId}/edit`)
                }
              >
                Edit Contractor
              </button>

              <button
                style={warningButtonStyle}
                onClick={handleDeactivate}
                disabled={actionLoading}
              >
                Deactivate
              </button>
            </>
          )}

          {contractor.status === "INACTIVE" && (
            <>
              <button
                style={successButtonStyle}
                onClick={handleActivate}
                disabled={actionLoading}
              >
                Activate
              </button>

              <button
                style={deleteButtonStyle}
                onClick={handleBlacklist}
                disabled={actionLoading}
              >
                Blacklist
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function DetailItem({ label, value, full = false }) {
  return (
    <div
      style={{
        ...detailItem,
        gridColumn: full ? "1 / -1" : "auto",
      }}
    >
      <div style={detailLabel}>{label}</div>
      <div style={detailValue}>{value || "-"}</div>
    </div>
  );
}

/* ---------- Styles ---------- */

const pageStyle = {
  padding: "32px",
  maxWidth: "1000px",
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

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const nameStyle = {
  fontSize: "28px",
  fontWeight: 700,
  marginBottom: "10px",
  color: "#0f172a",
};

const statusPill = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const dividerStyle = {
  height: "1px",
  background: "#e5e7eb",
  margin: "24px 0",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
};

const detailItem = {
  background: "#f8fafc",
  borderRadius: "12px",
  padding: "16px",
};

const detailLabel = {
  fontSize: "13px",
  color: "#64748b",
  marginBottom: "6px",
  fontWeight: 600,
};

const detailValue = {
  fontSize: "15px",
  fontWeight: 600,
  color: "#1e293b",
};

const actionBar = {
  display: "flex",
  gap: "14px",
  justifyContent: "flex-end",
  marginTop: "32px",
};

const editButtonStyle = {
  padding: "12px 22px",
  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
};

const warningButtonStyle = {
  padding: "12px 22px",
  background: "linear-gradient(135deg, #f59e0b, #d97706)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
};

const successButtonStyle = {
  padding: "12px 22px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(34,197,94,0.35)",
};

const deleteButtonStyle = {
  padding: "12px 22px",
  background: "linear-gradient(135deg, #ef4444, #b91c1c)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(239,68,68,0.35)",
};
