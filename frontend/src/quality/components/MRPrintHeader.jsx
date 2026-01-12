import POBrandHeader from "../../procurement/components/POBrandHeader";
import POStatusBadge from "../../procurement/components/POStatusBadge";

export default function MRPrintHeader({ mr }) {
  const label = {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  };

  const value = {
    fontSize: 14,
    fontWeight: 600,
    color: "#0f172a",
  };

  const field = { marginBottom: 12 };

  return (
    <div style={{ marginBottom: 24 }}>
      {/* ================= BRAND HEADER (SAME AS PO) ================= */}
      <POBrandHeader />

      {/* ================= TITLE + STATUS ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          paddingBottom: 16,
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            Material Receipt
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            MR No: <strong>{mr.mr_number}</strong>
          </div>
        </div>

        {/* ✅ STATUS ONLY — NO GATE PASS */}
        <POStatusBadge status={mr.status} />
      </div>

      {/* ================= DETAILS GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          marginTop: 24,
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          <div style={field}>
            <div style={label}>Receipt Date</div>
            <div style={value}>
              {mr.receipt_date || mr.created_at || "-"}
            </div>
          </div>

          <div style={field}>
            <div style={label}>Bill No</div>
            <div style={value}>{mr.bill_no || "-"}</div>
          </div>

          <div style={field}>
            <div style={label}>Entry No</div>
            <div style={value}>{mr.entry_no || "-"}</div>
          </div>

          <div style={field}>
            <div style={label}>Vehicle No</div>
            <div style={value}>{mr.vehicle_no || "-"}</div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div style={field}>
            <div style={label}>Vendor</div>
            <div style={value}>{mr.vendor_name || "-"}</div>
          </div>

          <div style={field}>
            <div style={label}>Store</div>
            <div style={value}>
              {mr.store_name || mr.store?.name || "-"}
            </div>
          </div>

          <div style={field}>
            <div style={label}>Bin</div>
            <div style={value}>
              {mr.bin_no || "-"}
            </div>
          </div>

          <div style={field}>
            <div style={label}>MR Reference No</div>
            <div style={value}>{mr.mr_reference_no || "-"}</div>
          </div>
        </div>
      </div>

      {/* ================= OPTIONAL REMARKS ================= */}
      {mr.remarks && (
        <div style={{ marginTop: 16 }}>
          <div style={label}>Remarks</div>
          <div style={value}>{mr.remarks}</div>
        </div>
      )}
    </div>
  );
}
