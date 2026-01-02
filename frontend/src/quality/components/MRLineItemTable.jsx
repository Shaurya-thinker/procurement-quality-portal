export default function MRLineItemTable({
  items = [],
  onChange,
  mode = "view", // "create" | "view"
}) {
  const isCreate = mode === "create";

  /* ================== STYLES (UNCHANGED) ================== */

  const containerStyle = {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
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
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    lineHeight: "1.4",
  };

  const tdStyle = {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#1e293b",
    verticalAlign: "middle",
  };

  const inputStyle = {
    padding: "10px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    width: "100%",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    transition: "all 0.3s ease",
    fontWeight: "500",
  };

  /* ================== LOGIC (FIXED) ================== */

  const handleReceivedQtyChange = (index, value) => {
    if (!onChange) return;

    const updatedItems = items.map((item, i) =>
      i === index
        ? { ...item, received_quantity: value }
        : item
    );

    onChange(updatedItems);
  };

  /* ================== EMPTY STATE ================== */

  if (!items || items.length === 0) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.5 }}>
            📦
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
            No Items Added
          </div>
          <div style={{ fontSize: "14px" }}>
            Select a Purchase Order to load items
          </div>
        </div>
      </div>
    );
  }

  /* ================== RENDER ================== */

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Item Code</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Unit</th>
            <th style={thStyle}>Ordered Qty</th>
            <th style={thStyle}>Remaining Qty</th>
            <th style={thStyle}>Received Qty</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={item.po_line_id ?? index}>
              {/* Item Code */}
              <td style={tdStyle}>
                <input
                  type="text"
                  value={item.item_code || ""}
                  disabled
                  style={inputStyle}
                />
              </td>

              {/* Description */}
              <td style={tdStyle}>
                <input
                  type="text"
                  value={item.description || ""}
                  disabled
                  style={inputStyle}
                />
              </td>

              {/* Unit */}
              <td style={tdStyle}>
                <input
                  type="text"
                  value={item.unit || ""}
                  disabled
                  style={inputStyle}
                />
              </td>

              {/* Ordered Quantity */}
              <td style={tdStyle}>
                <input
                  type="number"
                  value={item.ordered_quantity ?? ""}
                  disabled
                  style={inputStyle}
                />
              </td>


              <td style={tdStyle}>
                <input 
                  type="number" 
                  style={inputStyle}
                  max={item.remaining_quantity}
                  value={item.remaining_quantity} 
                  disabled />
              </td>

              {/* Received Quantity */}
              <td style={tdStyle}>
                <input
                  type="number"
                  value={item.received_quantity ?? ""}
                   max={item.remaining_quantity}
                  disabled={!isCreate}
                  onChange={(e) =>
                    handleReceivedQtyChange(
                      index,
                      Number(e.target.value)
                    )
                  }
                  style={{
                    ...inputStyle,
                    backgroundColor: isCreate ? "white" : "#f8fafc",
                    cursor: isCreate ? "text" : "not-allowed",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
