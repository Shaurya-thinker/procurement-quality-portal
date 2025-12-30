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
    <div style={{ padding: 24 }}>
      <button onClick={() => navigate(-1)}>←</button>

      <GatePassPreview
        gatePassData={{
          gate_pass_number: gatePass.gate_pass_number,
          mr_number: gatePass.mr_id,
          po_number: gatePass.po_id,
          vendor_name:
            poData?.vendor?.name ||
            poData?.vendor_name ||
            "-",
          items: gatePass.items.map((gpItem) => {
            const poLine = poData?.line_items?.find(
              (l) => l.item_id === gpItem.item_id
            );

            return {
              item_code: poLine?.item_code || "-",
              description: poLine?.item_description || "-",
              unit: poLine?.unit || "-",
              accepted_quantity: gpItem.accepted_quantity,
            };
          }),
          issued_by: gatePass.issued_by,
          issued_date: gatePass.issued_at,
        }}
        onDispatch={handleDispatch}
        dispatchDisabled={dispatching || gatePass.store_status === "DISPATCHED"}
      />
    </div>
  );
}
