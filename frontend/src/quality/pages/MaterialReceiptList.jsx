// frontend/src/quality/pages/MaterialReceiptList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuality } from "../hooks/useQuality";
import POStatusBadge from "../../procurement/components/POStatusBadge";


const MaterialReceiptList = () => {
  const navigate = useNavigate();
  const { getMaterialReceipts, loading, error } = useQuality();

  const [receipts, setReceipts] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [loadingError, setLoadingError] = useState("");

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    setLoadingError("");
    try {
      const data = await getMaterialReceipts();
      setReceipts(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadingError("Failed to load material receipts");
      setReceipts([]);
    }
  };

  /* ======================= STYLES (COPIED FROM PO LIST) ======================= */

  const containerStyle = {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headingStyle = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "32px",
    color: "#1e293b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    letterSpacing: "-0.5px",
  };

  const buttonStyle = {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const tableContainerStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    padding: "18px 20px",
    textAlign: "left",
    borderBottom: "2px solid #cbd5e1",
    fontWeight: "700",
    fontSize: "14px",
    color: "#1e293b",
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
  };

  const tdStyle = {
    padding: "18px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: "500",
    verticalAlign: "middle",
  };

  const getRowStyle = (isHovered) => ({
    transition: "all 0.3s ease",
    backgroundColor: isHovered ? "#f8fafc" : "transparent",
    transform: isHovered ? "translateX(4px)" : "translateX(0)",
    cursor: "pointer",
  });

  const actionButtonStyle = {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  };

  const errorAlertStyle = {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    padding: "12px 16px",
    borderRadius: "4px",
    marginBottom: "16px",
    fontSize: "13px",
    fontWeight: "500",
  };

  const emptyStateStyle = {
    padding: "80px 24px",
    textAlign: "center",
    color: "#64748b",
  };

  const emptyStateIconStyle = {
    fontSize: "80px",
    marginBottom: "24px",
    opacity: "0.6",
  };

  const emptyStateHeadingStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "12px",
  };

  const emptyStateTextStyle = {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "32px",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* ======================= RENDER ======================= */

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div>Material Receipts</div>
        <button
          style={buttonStyle}
          onClick={() => navigate("/quality/material-receipt/create")}
        >
          <span style={{ fontSize: "18px" }}>+</span>
          Create Material Receipt
        </button>
      </div>

      {(loadingError || error) && (
        <div style={errorAlertStyle}>
          <strong>Error:</strong> {loadingError || error}
        </div>
      )}

      {loading && <div style={{ padding: "24px" }}>Loading material receipts…</div>}

      {!loading && receipts.length === 0 && (
        <div style={tableContainerStyle}>
          <div style={emptyStateStyle}>
            <div style={emptyStateIconStyle}>📦</div>
            <div style={emptyStateHeadingStyle}>
              No Material Receipts Yet
            </div>
            <div style={emptyStateTextStyle}>
              Start by creating your first material receipt for quality inspection.
            </div>
            <button
              style={buttonStyle}
              onClick={() => navigate("/quality/material-receipt/create")}
            >
              Create Your First Receipt
            </button>
          </div>
        </div>
      )}

      {!loading && receipts.length > 0 && (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>MR Number</th>
                <th style={thStyle}>PO ID</th>
                <th style={thStyle}>Vendor</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Received Date</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((mr) => (
                <tr
                  key={mr.id}
                  style={getRowStyle(hoveredRow === mr.id)}
                  onMouseEnter={() => setHoveredRow(mr.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() =>
                    navigate(`/quality/material-receipt/${mr.id}`)
                  }
                >
                  <td style={tdStyle}>{mr.mr_number}</td>
                  <td style={tdStyle}>{mr.po_id}</td>
                  <td style={tdStyle}>{mr.vendor_name || "-"}</td>
                  <td style={tdStyle}>
                    <POStatusBadge status={mr.status} />
                  </td>
                  <td style={tdStyle}>{formatDate(mr.received_at)}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/quality/material-receipt/${mr.id}`);
                      }}
                      className="btn-primary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaterialReceiptList;
