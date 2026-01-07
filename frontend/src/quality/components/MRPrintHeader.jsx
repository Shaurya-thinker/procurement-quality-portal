export default function MRPrintHeader({ mr }) {
  const label = {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
    marginBottom: 4,
  };

  const value = {
    fontSize: 14,
    fontWeight: 600,
    color: "#0f172a",
  };

  return (
    <div style={{ marginBottom: 24 }}>
      {/* TOP BRAND ROW */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #e5e7eb",
        paddingBottom: 16,
        marginBottom: 16,
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            Your Company Name
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            Company Address • GSTIN
          </div>
        </div>

        <div style={{ fontSize: 22, fontWeight: 800 }}>
          MATERIAL RECEIPT
        </div>
      </div>

      {/* INFO GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}>
        {/* LEFT */}
        <div>
          <div style={label}>MR Number</div>
          <div style={value}>{mr.mr_number}</div>

          <div style={{ height: 12 }} />

          <div style={label}>MR Date</div>
          <div style={value}>
            {new Date(mr.created_at).toLocaleDateString()}
          </div>

          <div style={{ height: 12 }} />

          <div style={label}>Status</div>
          <div style={value}>{mr.status}</div>
        </div>

        {/* RIGHT */}
        <div>
          <div style={label}>PO Number</div>
          <div style={value}>{mr.po_number || "-"}</div>

          <div style={{ height: 12 }} />

          <div style={label}>Vendor</div>
          <div style={value}>{mr.vendor_name || "-"}</div>

          <div style={{ height: 12 }} />

          <div style={label}>Gate Pass</div>
          <div style={value}>{mr.gate_pass_number || "-"}</div>
        </div>
      </div>
    </div>
  );
}