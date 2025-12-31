import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import InventoryTable from "../components/InventoryTable";

export default function InventoryByStore() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { getInventoryByStore } = useStore();
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    load();
  }, [storeId]);

  const load = async () => {
    const data = await getInventoryByStore(storeId);
    setInventory(data);
  };

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
      >
        <button
          onClick={() => navigate(-1)}
          className="back-arrow-btn"
          aria-label="Go back"
        >
          ←
        </button>

        <h2 style={{ margin: 0 }}>Store Inventory</h2>
      </div>

      {/* Inventory Table */}
      <InventoryTable items={inventory} hideStore />
    </div>
  );
}
