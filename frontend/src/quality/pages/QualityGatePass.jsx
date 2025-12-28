import { useLocation, useParams } from "react-router-dom";
import GatePassPreview from "../components/GatePassPreview";
import { useNavigate } from "react-router-dom";
import "../css/GatePass.css";

export default function QualityGatePass() {
  const { inspectionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { mrData, inspectionData, poData } = location.state || {};

  if (!inspectionData || !mrData) {
    return <div style={{ padding: 24 }}>No Gate Pass data available</div>;
  }

  /* ================= ENRICH ACCEPTED ITEMS ================= */

  const acceptedItems = inspectionData.lines
    .map((line) => {
      // find MR line
      const mrLine = mrData.lines.find(
        (l) => l.id === line.mr_line_id
      );
      if (!mrLine) return null;

      // find PO line
      const poLine = poData?.line_items?.find(
        (p) => p.id === mrLine.po_line_id
      );

      return {
        item_code: poLine?.item_code || "-",
        description: poLine?.item_description || "-",
        unit: poLine?.unit || "-",
        accepted_quantity: line.accepted_quantity,
      };
    })
    .filter(Boolean);

  /* ================= RENDER ================= */

  return (
  <div style={{ padding: 24 }}>

    {/* Back button */}
    <button
      onClick={() => navigate(-1)}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        marginBottom: "16px",
      }}
      aria-label="Go back"
    >
      ←
    </button>

    {/* Printable Gate Pass ONLY */}
    <div className="print-gate-pass">
      <GatePassPreview
        gatePassData={{
          gate_pass_number: "AUTO",
          mr_number: mrData.mr_number,
          po_number: mrData.po_id,
          vendor_name:
            poData?.vendor_name ||
            poData?.vendor?.name ||
            poData?.vendor?.company_name ||
            "-",
          items: acceptedItems,
          issued_by: inspectionData.inspected_by,
          issued_date: inspectionData.inspected_at,
        }}
        onDispatch={() =>
          alert("Dispatch to Store (next phase)")
        }
      />
    </div>

  </div>
);
}
