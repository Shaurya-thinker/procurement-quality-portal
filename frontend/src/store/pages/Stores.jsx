// frontend/src/store/pages/Stores.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import AddStoreForm from "../components/AddStoreForm";

const Stores = () => {
  const navigate = useNavigate();
  const { getAllStores, loading, error, clearError } = useStore();

  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStoreForm, setShowAddStoreForm] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const data = await getAllStores();
      setStores(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error loading stores:", err);
    }
  };

  const filteredStores = stores.filter((store) =>
    `${store.store_id} ${store.name} ${store.plant_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ======================= STYLES ======================= */

  const containerStyle = {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headingStyle = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "32px",
    color: "#1e293b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    letterSpacing: "-0.5px",
  };

  const buttonStyle = {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
  };

  const outlineButtonStyle = {
    padding: "14px 28px",
    background: "white",
    color: "#1e293b",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  };

  const tableContainerStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    padding: "18px 20px",
    textAlign: "left",
    borderBottom: "2px solid #cbd5e1",
    fontWeight: "700",
    fontSize: "14px",
    color: "#1e293b",
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
  };

  const tdStyle = {
    padding: "18px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: "500",
    verticalAlign: "middle",
  };

  const getRowStyle = (isHovered) => ({
    transition: "all 0.25s ease",
    backgroundColor: isHovered ? "#f8fafc" : "transparent",
    transform: isHovered ? "translateX(4px)" : "translateX(0)",
    cursor: "pointer",
  });

  const searchInputStyle = {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    width: "280px",
    fontSize: "14px",
  };

  const errorAlertStyle = {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const emptyStateStyle = {
    padding: "80px 24px",
    textAlign: "center",
    color: "#64748b",
  };

  const emptyIconStyle = {
    fontSize: "80px",
    marginBottom: "24px",
    opacity: "0.6",
  };

  /* ======================= RENDER ======================= */

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headingStyle}>
        <div>Store Management</div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={outlineButtonStyle}
            onClick={() => navigate("/store/inventory")}
          >
            Global Inventory
          </button>

          <button
            style={secondaryButtonStyle}
            onClick={() => navigate("/store/dispatches")}
          >
            Material Dispatches
          </button>

          <button
            style={buttonStyle}
            onClick={() => setShowAddStoreForm(true)}
          >
            + Add Store
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search by Store ID, Name, or Plant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div style={errorAlertStyle}>
          <span>{error}</span>
          <span style={{ cursor: "pointer" }} onClick={clearError}>
            ✕
          </span>
        </div>
      )}

      {/* ADD STORE FORM */}
      {showAddStoreForm && (
        <div style={{ marginBottom: "32px" }}>
          <AddStoreForm
            onCreated={() => {
              setShowAddStoreForm(false);
              loadStores();
            }}
            onCancel={() => setShowAddStoreForm(false)}
          />
        </div>
      )}

      {/* LOADING */}
      {loading && <div>Loading stores…</div>}

      {/* EMPTY */}
      {!loading && filteredStores.length === 0 && (
        <div style={tableContainerStyle}>
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>🏬</div>
            <h2>No Stores Found</h2>
            <p>
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Start by adding your first store"}
            </p>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!loading && filteredStores.length > 0 && (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Store Name</th>
                <th style={thStyle}>Store ID</th>
                <th style={thStyle}>Plant</th>
                <th style={thStyle}>In-Charge</th>
                <th style={thStyle}>Mobile</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Bins</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStores.map((store) => (
                <tr
                  key={store.id}
                  style={getRowStyle(hoveredRow === store.id)}
                  onMouseEnter={() => setHoveredRow(store.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => navigate(`/store/${store.id}`)}
                >
                  <td style={tdStyle}>{store.name}</td>
                  <td style={tdStyle}>{store.store_id}</td>
                  <td style={tdStyle}>{store.plant_name}</td>
                  <td style={tdStyle}>{store.in_charge_name}</td>
                  <td style={tdStyle}>{store.in_charge_mobile}</td>
                  <td style={tdStyle}>{store.in_charge_email}</td>
                  <td style={tdStyle}>{store.bins?.length || 0}</td>
                  <td style={tdStyle}>
                    <button
                      className="btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/store/${store.id}`);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stores;
