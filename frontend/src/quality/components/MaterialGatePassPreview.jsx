import POBrandHeader from "../../procurement/components/POBrandHeader";
import POStatusBadge from "../../procurement/components/POStatusBadge";
export default function GatePassPreview({ gatePassData, onDispatch, dispatching}) {
  const containerStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    border: "2px solid #1f2937",
    padding: "32px",
    maxWidth: "800px",
    margin: "0 auto",
  };

  const headerStyle = {
    textAlign: "center",
    borderBottom: "2px solid #1f2937",
    paddingBottom: "20px",
    marginBottom: "24px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "4px",
  };

  const subtitleStyle = {
    fontSize: "13px",
    color: "#6b7280",
  };

  const infoSectionStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: "1px solid #e5e7eb",
  };

  const infoFieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const valueStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1f2937",
  };

  const tableContainerStyle = {
    marginBottom: "24px",
    pageBreakInside: "avoid",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    borderBottom: "2px solid #1f2937",
  };

  const thStyle = {
    padding: "10px 12px",
    borderBottom: "2px solid #1f2937",
    fontWeight: "700",
    backgroundColor: "#f9fafb",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    fontSize: "12px",
  };

  const tdStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid #e5e7eb",
  };


  const footerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    paddingTop: "24px",
    borderTop: "2px solid #1f2937",
  };

  const signatureStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const signatureLineStyle = {
    height: "40px",
    borderTop: "1px solid #1f2937",
    marginBottom: "4px",
  };

  const signatureNameStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#1f2937",
  };

  const actionButtonsStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    justifyContent: "center",
  };

  const dispatchButtonStyle = {
    padding: "10px 24px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  };

  const printButtonStyle = {
    padding: "10px 24px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  };

  const Info = ({ label, value }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        fontSize: 12,
        color: "#6b7280",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.4px",
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
        {value || "-"}
      </div>
    </div>
  );


  const handlePrint = () => {
    window.print();
  };

  const acceptedItems = gatePassData.items || [];

  return (
    <div className="print-gate-pass" style={containerStyle}>
      {/* ================= BRAND HEADER ================= */}
      <POBrandHeader />

      {/* ================= TITLE + STATUS ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          paddingBottom: 16,
          borderBottom: "2px solid #1f2937",
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            Gate Pass
          </div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Gate Pass No: <strong>{gatePassData.gate_pass_number}</strong>
          </div>
        </div>

        <POStatusBadge status={gatePassData.store_status} />
      </div>

      {/* ================= INFO ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginTop: 24,
          paddingBottom: 24,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {/* LEFT */}
        <div>
          <Info label="MR Number" value={gatePassData.mr_number} />
          <Info label="PO Number" value={gatePassData.po_number} />
          <Info label="Vendor" value={gatePassData.vendor_name} />
        </div>

        {/* RIGHT */}
        <div>
          <Info label="Component Details" value={gatePassData.component_details} />
          <Info label="Destination" value="Store" />
        </div>
      </div>


      {/* ================= ITEMS TABLE ================= */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: "2px solid #e5e7eb",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
            color: "#1f2937",
          }}
        >
          Accepted Items
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "20%" }}>Item Code</th>
              <th style={{ ...thStyle, width: "45%" }}>Description</th>
              <th style={{ ...thStyle, width: "15%", textAlign: "center" }}>Unit</th>
              <th style={{ ...thStyle, width: "20%", textAlign: "right" }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {acceptedItems.map((item, index) => (
              <tr key={index}>
                <td style={{ ...tdStyle, width: "20%" }}>
                  {item.item_code || "-"}
                </td>
                <td style={{ ...tdStyle, width: "45%" }}>
                  {item.description || "-"}
                </td>
                <td style={{ ...tdStyle, width: "15%", textAlign: "center" }}>
                  {item.unit || "-"}
                </td>
                <td style={{ ...tdStyle, width: "20%", textAlign: "right", fontWeight: 600 }}>
                  {item.accepted_quantity || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= SIGNATURES ================= */}
      <div style={footerStyle}>
        <div style={signatureStyle}>
          <div style={signatureLineStyle}></div>
          <div style={signatureNameStyle}>Inspector</div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            {gatePassData.issued_by}
          </div>
        </div>

        <div style={signatureStyle}>
          <div style={signatureLineStyle}></div>
          <div style={signatureNameStyle}>Authorized By</div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            {gatePassData.issued_date}
          </div>
        </div>
      </div>

      {/* ================= ACTION BUTTONS (HIDDEN IN PRINT) ================= */}
      <div className="no-print" style={actionButtonsStyle}>
        <button onClick={handlePrint} style={printButtonStyle}>
          Print Gate Pass
        </button>

        {/* SHOW DISPATCH ONLY IF SENT_TO_STORE */}
        {gatePassData.store_status === "PENDING" && (
          <button
            onClick={onDispatch}
            disabled={dispatching}
            style={{
              ...dispatchButtonStyle,
              opacity: dispatching ? 0.6 : 1,
              cursor: dispatching ? "not-allowed" : "pointer",
            }}
          >
            ✓ Dispatch to Store
          </button>
        )}

        {gatePassData.store_status === "SENT_TO_STORE" && (
          <div className="status-pill">
            Sent to Store
          </div>
        )}

        {/* SHOW STATUS IF RECEIVED */}
        {gatePassData.store_status === "RECEIVED" && (
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "#ecfdf5",
              color: "#065f46",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ✔ Received in Store
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 32,
          paddingTop: 8,
          borderTop: "1px solid #e5e7eb",
          fontSize: 11,
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        This is a system generated Gate Pass. No signature required.
      </div>
    </div>
  );
}
