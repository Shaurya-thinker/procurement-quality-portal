export default function GatePassPreview({ gatePassData, onDispatch }) {
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
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  };

  const thStyle = {
    padding: "10px 12px",
    textAlign: "left",
    borderBottom: "2px solid #d1d5db",
    fontWeight: "600",
    color: "#374151",
    backgroundColor: "#f9fafb",
    fontSize: "12px",
  };

  const tdStyle = {
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#1f2937",
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

  const handlePrint = () => {
    window.print();
  };

  const acceptedItems = gatePassData.items || [];

  return (
    <div style={containerStyle}>
      {/* ================= HEADER ================= */}
      <div style={headerStyle}>
        <div style={titleStyle}>GATE PASS</div>
        <div style={subtitleStyle}>
          Gate Pass #{gatePassData.gate_pass_number}
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div style={infoSectionStyle}>
        <div style={infoFieldStyle}>
          <div style={labelStyle}>MR Number</div>
          <div style={valueStyle}>{gatePassData.mr_number}</div>
        </div>
        <div style={infoFieldStyle}>
          <div style={labelStyle}>PO Number</div>
          <div style={valueStyle}>{gatePassData.po_number}</div>
        </div>
        <div style={infoFieldStyle}>
          <div style={labelStyle}>Vendor Name</div>
          <div style={valueStyle}>{gatePassData.vendor_name}</div>
        </div>
        <div style={infoFieldStyle}>
          <div style={labelStyle}>Destination</div>
          <div style={valueStyle}>Store</div>
        </div>
      </div>

      {/* ================= ITEMS TABLE ================= */}
      <div style={tableContainerStyle}>
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
              <th style={thStyle}>Item Code</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {acceptedItems.length > 0 ? (
              acceptedItems.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{item.item_code || "-"}</td>
                  <td style={tdStyle}>{item.description || "-"}</td>
                  <td style={tdStyle}>{item.unit || "-"}</td>
                  <td style={tdStyle}>{item.accepted_quantity || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    color: "#9ca3af",
                  }}
                >
                  No accepted items
                </td>
              </tr>
            )}
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
          🖨️ Print Gate Pass
        </button>
        <button onClick={onDispatch} style={dispatchButtonStyle}>
          ✓ Dispatch to Store
        </button>
      </div>
    </div>
  );
}
