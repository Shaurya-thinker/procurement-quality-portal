import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import InventoryTable from "../components/InventoryTable";

export default function InventoryByStore() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { getInventoryByStore } = useStore();

  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    load();
  }, [storeId]);

  const load = async () => {
    const data = await getInventoryByStore(storeId);
    setInventory(Array.isArray(data) ? data : []);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
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

      {/* Search */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#374151",
            textTransform: "uppercase",
          }}
        >
          Search
        </label>

        <input
          type="text"
          placeholder="Search by item ID or bin ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            fontSize: "13px",
          }}
        />
      </div>

      {/* Inventory Table */}
      <InventoryTable
        items={inventory}
        searchTerm={searchTerm}
        hideStore
      />
    </div>
  );
}
