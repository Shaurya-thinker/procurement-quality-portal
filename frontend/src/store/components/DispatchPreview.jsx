export default function DispatchPreview({ dispatch }) {
  if (!dispatch) return null;

  const totalQty = dispatch.line_items.reduce(
    (sum, li) => sum + Number(li.quantity_dispatched),
    0
  );

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "32px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Material Dispatch</h2>
        <p style={{ color: "#6b7280", marginTop: 4 }}>
          Dispatch No: <b>{dispatch.dispatch_number}</b>
        </p>
      </div>

      {/* ===== SUMMARY ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Info label="Status" value={dispatch.dispatch_status} />
        <Info label="Dispatch Date" value={new Date(dispatch.dispatch_date).toLocaleDateString()} />
        <Info label="Requested By" value={dispatch.created_by} />
        <Info
          label="Reference"
          value={`${dispatch.reference_type} – ${dispatch.reference_id}`}
        />
        <Info label="Total Quantity" value={totalQty} />
      </div>

      {/* ===== RECEIVER ===== */}
      <Section title="Receiver & Transport">
        <Info label="Receiver Name" value={dispatch.receiver_name} />
        <Info label="Receiver Contact" value={dispatch.receiver_contact} />
        <Info label="Vehicle Number" value={dispatch.vehicle_number} />
        <Info label="Driver Name" value={dispatch.driver_name} />
        <Info label="Driver Contact" value={dispatch.driver_contact} />
        <Info label="Delivery Address" value={dispatch.delivery_address} />
      </Section>

      {/* ===== ITEMS ===== */}
      <Section title="Dispatched Items">
        <table width="100%" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH>Item Code</TH>
              <TH>Item Name</TH>
              <TH>UOM</TH>
              <TH>Quantity</TH>
              <TH>Remarks</TH>
            </tr>
          </thead>
          <tbody>
            {dispatch.line_items.map((item, idx) => (
              <tr key={idx}>
                <TD>{item.item_code}</TD>
                <TD>{item.item_name}</TD>
                <TD>{item.uom}</TD>
                <TD>{item.quantity_dispatched}</TD>
                <TD>{item.remarks || "-"}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ===== SMALL HELPERS ===== */

function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 14 }}>{value || "-"}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

function TH({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        borderBottom: "2px solid #e5e7eb",
        padding: "8px",
        fontSize: 12,
      }}
    >
      {children}
    </th>
  );
}

function TD({ children }) {
  return (
    <td
      style={{
        borderBottom: "1px solid #e5e7eb",
        padding: "8px",
        fontSize: 13,
      }}
    >
      {children}
    </td>
  );
}
