import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuality } from "../hooks/useQuality";
import MRHeader from "../components/MRHeader";
import "../css/Inspection.css";
import { getPODetails } from "../../api/procurement.api";
import { generateGatePass } from "../../api/quality.api";


export default function Inspection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitInspection } = useQuality();

  const [mrData, setMrData] = useState(location.state?.mrData || null);
  const [poData, setPoData] = useState(null);
  const [inspectionItems, setInspectionItems] = useState([]);
  const [inspectorName, setInspectorName] = useState("");
  const [validationError, setValidationError] = useState("");

  /* ================= INITIALIZE INSPECTION ITEMS ================= */

  useEffect(() => {
    const initInspection = async () => {
      if (!location.state?.mrData) return;

      const mr = location.state.mrData;
      setMrData(mr);

      try {
        const poRes = await getPODetails(mr.po_id);
        const po = poRes.data;
        setPoData(po);

        const items = po.line_items.map((poLine) => {
          const mrLine = mr.lines.find(
            (l) => l.po_line_id === poLine.id
          );

          return {
            mr_line_id: mrLine?.id,
            item_code: poLine.item_code,
            description: poLine.item_description,
            received_qty: mrLine?.received_quantity || 0,
            accepted_qty: "",
            rejected_qty: "",
            remarks: "",
          };
        });

        setInspectionItems(items);
      } catch (err) {
        console.error("Failed to load PO for inspection", err);
      }
    };

    initInspection();
  }, [location.state]);

  /* ================= HANDLE ITEM CHANGE ================= */

  const handleItemChange = (index, field, value) => {
    const numericFields = ["accepted_qty", "rejected_qty"];

    setInspectionItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: numericFields.includes(field)
                ? Number(value)
                : value,
            }
          : item
      )
    );
  };

  /* ================= VALIDATION ================= */

  const validateInspection = () => {
    setValidationError("");

    if (!inspectorName.trim()) {
      setValidationError("Inspector name is required");
      return false;
    }

    for (const item of inspectionItems) {
      const received = Number(item.received_qty);
      const accepted = Number(item.accepted_qty || 0);
      const rejected = Number(item.rejected_qty || 0);

      if (accepted + rejected !== received) {
        setValidationError(
          `Item ${item.item_code}: Accepted + Rejected must equal Received (${received})`
        );
        return false;
      }
    }

    return true;
  };

  /* ================= SUBMIT ================= */

  const handleSubmitInspection = async () => {
    if (!validateInspection()) return;

    try {
      const payload = {
        mr_id: mrData.id,
        inspected_by: inspectorName,
        remarks: "Inspection completed",
        lines: inspectionItems
        .filter(item => item.mr_line_id) // 🔑 IMPORTANT
        .map(item => ({
          mr_line_id: item.mr_line_id,
          accepted_quantity: Number(item.accepted_qty || 0),
          rejected_quantity: Number(item.rejected_qty || 0),
        })),
      };

     const inspection = await submitInspection(payload);

      // 🔑 STEP 1: generate gate pass
      await generateGatePass({
        inspection_id: inspection.id,
        issued_by: inspectorName,
        vendor_name: mrData.vendor_name, 
        component_details: mrData.component_details,
      });
      // 🔑 STEP 2: now navigate
      navigate(`/quality/gate-pass/${inspection.id}`);

    } catch (err) {
      console.error(err);
    }
  };

  if (!mrData) {
    return <div style={{ padding: 24 }}>No Material Receipt found</div>;
  }

  const isRowValid = (item) => {
  const received = Number(item.received_qty);
  const accepted = Number(item.accepted_qty || 0);
  const rejected = Number(item.rejected_qty || 0);

  if (accepted === 0 && rejected === 0) return false;

  return accepted + rejected === received;
};

const isInspectionCompleteAndValid = () => {
  if (!inspectorName.trim()) return false;
  if (inspectionItems.length === 0) return false;

  return inspectionItems.every((item) => isRowValid(item));
};

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

    {validationError && (
      <div
        style={{
          background: "#fee2e2",
          color: "#7f1d1d",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "16px",
        }}
      >
        {validationError}
      </div>
    )}

    <MRHeader mrData={mrData} isReadOnly />

    <div style={{ marginTop: "24px", marginBottom: "16px" }}>
      <div className="form-group" style={{ maxWidth: "320px" }}>
        <label className="form-label">Inspector Name</label>
        <input
          type="text"
          className="form-input"
          value={inspectorName}
          onChange={(e) => setInspectorName(e.target.value)}
          placeholder="Enter inspector name"
        />
      </div>
    </div>

    {/* ================= INSPECTION TABLE ================= */}

    <div className="inspection-table-wrapper">
      <table className="inspection-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Description</th>
            <th>Received Qty</th>
            <th>Accepted Qty</th>
            <th>Rejected Qty</th>
            <th>Remarks</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {inspectionItems.map((item, index) => (
            <tr
              key={index}
              className={
                item.accepted_qty || item.rejected_qty
                  ? isRowValid(item)
                    ? "inspection-row-valid"
                    : "inspection-row-invalid"
                  : ""
              }
            >
              <td>{item.item_code}</td>
              <td>{item.description}</td>
              <td>{item.received_qty}</td>

              <td>
                <input
                  type="number"
                  className="table-input"
                  value={item.accepted_qty}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "accepted_qty",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  className="table-input"
                  value={item.rejected_qty}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "rejected_qty",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="text"
                  className="table-input"
                  value={item.remarks}
                  onChange={(e) =>
                    handleItemChange(index, "remarks", e.target.value)
                  }
                  placeholder="Add remarks..."
                />
              </td>

              <td>
                {item.accepted_qty || item.rejected_qty ? (
                  isRowValid(item) ? (
                    <span className="status-valid">Valid</span>
                  ) : (
                    <span className="status-invalid">Invalid</span>
                  )
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ================= INSPECTION FOOTER ================= */}

    <div style={{ marginTop: "32px" }}>
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmitInspection}
          disabled={!isInspectionCompleteAndValid()}
        >
          Submit Inspection
        </button>
      </div>
    </div>
  </div>
);
}
