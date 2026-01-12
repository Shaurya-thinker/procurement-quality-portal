import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuality } from "../hooks/useQuality";
import MRHeader from "../components/MRHeader";
import MRLineItemTable from "../components/MRLineItemTable";
import POStatusBadge from "../../procurement/components/POStatusBadge";
import { getPODetails } from "../../api/procurement.api";
import MRPrintHeader from "../components/MRPrintHeader";

export default function MaterialReceiptDetails() {
  const { mrId } = useParams();
  const navigate = useNavigate();
  const { getMaterialReceiptDetails } = useQuality();

  const [mr, setMr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    if (!mrId) return;

    setLoading(true);
    getMaterialReceiptDetails(mrId)
      .then(setMr)
      .finally(() => setLoading(false));
  }, [mrId]);

  useEffect(() => {
  if (!mr || !mr.po_id) return;

  const loadLineItems = async () => {
    try {
      const poRes = await getPODetails(mr.po_id);
      const po = poRes.data;

      const mergedItems = po.line_items.map(poLine => {
        const mrLine = mr.lines.find(
            l => l.po_line_id === poLine.id
        );
        const receivedQty = mrLine ? Number(mrLine.received_quantity) : 0;

        return {
            po_line_id: poLine.id,
            item_code: poLine.item_code,
            description: poLine.item_description,
            unit: poLine.unit,
            ordered_quantity: poLine.quantity,
            received_quantity: receivedQty,
            remaining_quantity: Math.max(
                poLine.quantity - receivedQty,
                0
            ),
        };
        });

      setLineItems(mergedItems);
    } catch (err) {
      console.error("Failed to load MR line items", err);
    }
  };

  loadLineItems();
}, [mr]);

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
    const handlePrintMR = () => {
      const printContents = document.getElementById("mr-print-area");
      if (!printContents) return;

      const printWindow = window.open("", "", "height=800,width=1000");

      printWindow.document.write(`
        <html>
          <head>
            <title>Material Receipt</title>
            <style>
              @page {
                size: A4;
                margin: 12mm;
              }

              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #000;
              }

              table {
                width: 100%;
                border-collapse: collapse;
              }

              th, td {
                border-bottom: 1px solid #ddd;
                padding: 8px;
                font-size: 12px;
              }

              .po-section {
                page-break-inside: avoid;
              }

              * {
                box-shadow: none !important;
              }
            </style>
          </head>
          <body>
            ${printContents.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    };

  return (
    <div style={containerStyle}>
      {/* ================= HEADER ================= */}
      <div style={headerStyle}>
  {/* LEFT: BACK ARROW + TITLE */}
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <button
      onClick={() => navigate(-1)}
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        background: "white",
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        flexShrink: 0,
      }}
      aria-label="Go back"
    >
      ←
    </button>

    <div>
      <h1 style={titleStyle}>Material Receipt</h1>
      <div style={subTitleStyle}>{mr.mr_number}</div>
    </div>
  </div>

  {/* RIGHT: STATUS + ACTION */}
  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
    <POStatusBadge status={mr.status} />
    {/* <button
      onClick={() => navigate("/quality")}
      style={secondaryBtn}
    >
      Back to List
    </button> */}

  </div>
</div>

      {/* ================= RECEIPT DETAILS ================= */}
      <div id="mr-print-area">
        <div style={cardStyle} className="po-section">
          <MRPrintHeader mr={mr} />
        </div>

      {/* ================= LINE ITEMS ================= */}
        <div style={{ ...cardStyle, marginTop: 24 }} className="po-section">
          <div style={sectionTitleStyle}>Line Items</div>
          <MRLineItemTable items={lineItems} mode="print" />
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div style={actionBarStyle}>
        <button
          style={secondaryBtn}
          onClick={handlePrintMR}
        >
          Print MR
        </button>

        {mr.status === "CREATED" && (
          <button
            style={primaryBtn}
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

const primaryBtn = {
  padding: "12px 24px",
  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const secondaryBtn = {
  padding: "12px 24px",
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const dangerBtn = {
  ...primaryBtn,
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
};