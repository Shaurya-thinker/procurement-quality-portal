import { useLocation, useParams } from "react-router-dom";
import GatePassPreview from "../components/GatePassPreview";

export default function QualityGatePass() {
  const { inspectionId } = useParams();
  const location = useLocation();

  const { mrData, inspectionData, poData } = location.state || {};

  if (!inspectionData || !mrData) {
    return <div style={{ padding: 24 }}>No Gate Pass data available</div>;
  }

  // 🔑 ENRICH ACCEPTED ITEMS
  const acceptedItems = inspectionData.lines.map(line => {
    // find MR line
    const mrLine = mrData.lines.find(l => l.id === line.mr_line_id);
    if (!mrLine) return null;

    // find PO line (passed from Inspection page OR fallback)
    const poLine = poData?.line_items?.find(
      p => p.id === mrLine.po_line_id
    );

    return {
      item_code: poLine?.item_code || "-",
      description: poLine?.item_description || "-",
      unit: poLine?.unit || "-",
      accepted_quantity: line.accepted_quantity,
    };
  }).filter(Boolean);

  return (
    <div style={{ padding: 24 }}>
      <GatePassPreview
        gatePassData={{
          gate_pass_number: "AUTO",
          mr_number: mrData.mr_number,
          po_number: mrData.po_id,
          vendor_name: mrData.vendor_name,
          items: acceptedItems,
          issued_by: inspectionData.inspected_by,
          issued_date: inspectionData.inspected_at,
        }}
        onDispatch={() => alert("Dispatch to Store (next phase)")}
      />
    </div>
  );
}
