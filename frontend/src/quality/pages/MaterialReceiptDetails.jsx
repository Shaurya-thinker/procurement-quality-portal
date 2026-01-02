import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuality } from "../hooks/useQuality";
import MRHeader from "../components/MRHeader";
import MRLineItemTable from "../components/MRLineItemTable";
import POStatusBadge from "../../procurement/components/POStatusBadge";

export default function MaterialReceiptDetails() {
  const { mrId } = useParams();
  const navigate = useNavigate();
  const { getMaterialReceiptDetails } = useQuality();

  const [mr, setMr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mrId) return;

    setLoading(true);
    getMaterialReceiptDetails(mrId)
      .then(setMr)
      .finally(() => setLoading(false));
  }, [mrId]);

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>Loading material receipt…</div>
      </div>
    );
  }

  if (!mr) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>Material Receipt not found</div>
      </div>
    );
  }

  const isReadOnly = mr.status !== "CREATED";

  return (
    <div style={containerStyle}>
      {/* ================= HEADER ================= */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Material Receipt</h1>
          <div style={subTitleStyle}>{mr.mr_number}</div>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <POStatusBadge status={mr.status} />
          <button
            onClick={() => navigate("/quality")}
            className="btn-secondary btn-small"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* ================= RECEIPT DETAILS ================= */}
      <div style={cardStyle}>
        <MRHeader
          mrData={mr}
          onChange={setMr}
          isReadOnly={isReadOnly}
        />
      </div>

      {/* ================= LINE ITEMS ================= */}
      <div style={{ ...cardStyle, marginTop: 24 }}>
        <div style={sectionTitleStyle}>Line Items</div>
        <MRLineItemTable items={mr.lines} isReadOnly />
      </div>

      {/* ================= ACTIONS ================= */}
      <div style={actionBarStyle}>
        {mr.status === "CREATED" && (
          <button
            className="btn-primary"
            onClick={() =>
              navigate(`/quality/inspection/${mr.id}`)
            }
          >
            Proceed to Inspection
          </button>
        )}

        {mr.status !== "CREATED" && (
          <span style={infoTextStyle}>
            This receipt is read-only after inspection.
          </span>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES (MATCH PROCUREMENT) ================= */

const containerStyle = {
  padding: "24px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "4px",
};

const subTitleStyle = {
  fontSize: "14px",
  color: "#64748b",
  fontWeight: "500",
};

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  border: "1px solid #f1f5f9",
  padding: "24px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const sectionTitleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "16px",
};

const actionBarStyle = {
  marginTop: "32px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "16px",
};

const infoTextStyle = {
  fontSize: "14px",
  color: "#64748b",
};
