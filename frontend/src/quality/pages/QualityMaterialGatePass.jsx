import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GatePassPreview from "../components/MaterialGatePassPreview";
import {
  getGatePassByInspection,
  dispatchGatePassToStore,
} from "../../api/quality.api";

import "../css/GatePass.css";
import { getPODetails } from "../../api/procurement.api";


export default function QualityMaterialGatePass() {
  const { inspectionId } = useParams();
  const navigate = useNavigate();
  const [poData, setPoData] = useState(null);


  const [gatePass, setGatePass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    async function fetchGatePass() {
      try {
        const res = await getGatePassByInspection(inspectionId);
        setGatePass(res.data);
      } catch (err) {
        alert(
          err?.response?.data?.detail ||
          "Failed to load Gate Pass"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGatePass();
  }, [inspectionId]);

  useEffect(() => {
  if (gatePass) {
    console.log("GatePass API response:", gatePass);
  }
}, [gatePass]);


  useEffect(() => {
  if (!gatePass) return;

  async function fetchPO() {
    const res = await getPODetails(gatePass.po_id);
    setPoData(res.data);
  }

  fetchPO();
}, [gatePass]);


  const handleDispatch = async () => {
    if (!window.confirm("Dispatch Gate Pass to Store?")) return;

    try {
      setDispatching(true);
      await dispatchGatePassToStore(gatePass.id);

      alert("Gate Pass dispatched to Store");
      navigate("/quality");
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
        "Dispatch failed"
      );
    } finally {
      setDispatching(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!gatePass) return <div style={{ padding: 24 }}>No Gate Pass found</div>;

  return (
    <div style={{ padding: "24px" }}>
      {/* Back Arrow + Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      ></div>
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

      <GatePassPreview
        gatePassData={{
          gate_pass_number: gatePass.gate_pass_number,
          mr_number: gatePass.mr_id,
          po_number: gatePass.po_id,
          vendor_name: gatePass.vendor_name || "-",
          component_details: gatePass.component_details || "-",
          store_status: gatePass.store_status, // ✅ IMPORTANT
          items: gatePass.items.map((gpItem) => {
            if (!poData) {
              return {
                item_code: "—",
                description: "—",
                unit: "—",
                accepted_quantity: gpItem.accepted_quantity,
              };
            }

            const poLine = poData.line_items.find(
              (l) => l.item_id === gpItem.item_id
            );

            return {
              item_code: poLine?.item_code ?? "—",
              description: poLine?.item_description ?? "—",
              unit: poLine?.unit ?? "—",
              accepted_quantity: gpItem.accepted_quantity,
            };
          }),
          issued_by: gatePass.issued_by,
          issued_date: gatePass.issued_at,
        }}
        onDispatch={handleDispatch}
        dispatching={dispatching}
      />
    </div>
  );
}
