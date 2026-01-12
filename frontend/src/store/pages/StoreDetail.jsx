import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddStoreForm from "../components/AddStoreForm";
import { useStore } from "../hooks/useStore";

export default function StoreDetail() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const {
    getStoreDetails,
    addBin,
    deleteStore,
    updateStore,
    loading,
    error,
    clearError,
  } = useStore();

  const [store, setStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddBinForm, setShowAddBinForm] = useState(false);
  const [binForm, setBinForm] = useState({
    bin_no: "",
    component_details: "",
  });
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadStoreDetails();
  }, [storeId]);

  const loadStoreDetails = async () => {
    try {
      const data = await getStoreDetails(Number(storeId));
      setStore(data);
    } catch (err) {
      console.error("Failed to load store details", err);
    }
  };

  const handleAddBin = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    if (!binForm.bin_no.trim()) {
      setLocalError("Bin number is required");
      return;
    }

    try {
      await addBin(Number(storeId), binForm);
      setSuccessMessage("Bin added successfully");
      setBinForm({ bin_no: "", component_details: "" });
      setShowAddBinForm(false);

      setTimeout(() => {
        loadStoreDetails();
        setSuccessMessage("");
      }, 1200);
    } catch (err) {
      setLocalError(err.response?.data?.detail || "Failed to add bin");
    }
  };

  const handleDeleteStore = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this store?\nAll bins will be deleted."
    );
    if (!confirm) return;

    try {
      await deleteStore(storeId);
      navigate("/store");
    } catch {
      setLocalError("Failed to delete store");
    }
  };

  /* ======================= STYLES ======================= */

  const containerStyle = {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
  };


  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "16px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  };

  const infoItemStyle = {
    background: "#f8fafc",
    borderRadius: "10px",
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
  };

  const labelStyle = {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    marginBottom: "4px",
  };

  const valueStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    padding: "16px",
    background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    fontWeight: "700",
    fontSize: "13px",
    textAlign: "left",
    borderBottom: "2px solid #cbd5e1",
  };

  const tdStyle = {
    padding: "16px",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
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

  const dangerBtn = {
    ...primaryBtn,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
  };

  const secondaryBtn = {
    padding: "12px 24px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  };

  const alertStyle = (bg, color) => ({
    background: bg,
    color,
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
  });

  /* ======================= STATES ======================= */

  if (loading && !store) {
    return <div style={containerStyle}>Loading store…</div>;
  }

  if (!store) {
    return (
      <div style={containerStyle}>
        <button onClick={() => navigate("/store")} style={secondaryBtn}>
          ← Back to Stores
        </button>
      </div>
    );
  }

  /* ======================= RENDER ======================= */

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "1px solid #116de7ff",
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

        <h1 style={titleStyle}>{store.name}</h1>
      </div>


      {(error || localError) && (
        <div style={alertStyle("#FEE2E2", "#B91C1C")}>
          <span>{error || localError}</span>
          <span style={{ cursor: "pointer" }} onClick={() => {
            clearError();
            setLocalError("");
          }}>
            ✕
          </span>
        </div>
      )}

      {successMessage && (
        <div style={alertStyle("#DCFCE7", "#166534")}>
          <span>{successMessage}</span>
          <span style={{ cursor: "pointer" }} onClick={() => setSuccessMessage("")}>
            ✕
          </span>
        </div>
      )}

      {/* STORE INFO */}
      <div style={cardStyle}>
        {isEditing ? (
          <AddStoreForm
            initialData={store}
            isEdit
            onCancel={() => setIsEditing(false)}
            onSubmit={async (data) => {
              const updated = await updateStore(store.id, data);
              setStore(updated);
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            <div style={sectionTitleStyle}>Store Information</div>
            <div style={gridStyle}>
              <div style={infoItemStyle}><div style={labelStyle}>Store ID</div><div style={valueStyle}>{store.store_id}</div></div>
              <div style={infoItemStyle}><div style={labelStyle}>Plant</div><div style={valueStyle}>{store.plant_name}</div></div>
              <div style={infoItemStyle}><div style={labelStyle}>In-Charge</div><div style={valueStyle}>{store.in_charge_name}</div></div>
              <div style={infoItemStyle}><div style={labelStyle}>Mobile</div><div style={valueStyle}>{store.in_charge_mobile}</div></div>
              <div style={infoItemStyle}><div style={labelStyle}>Email</div><div style={valueStyle}>{store.in_charge_email}</div></div>
              <div style={infoItemStyle}><div style={labelStyle}>Total Bins</div><div style={valueStyle}>{store.bins?.length || 0}</div></div>
            </div>
          </>
        )}
      </div>

      {/* BINS */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={sectionTitleStyle}>Bins</div>
          <button style={secondaryBtn} onClick={() => setShowAddBinForm(!showAddBinForm)}>
            {showAddBinForm ? "Cancel" : "+ Add Bin"}
          </button>
        </div>

        {showAddBinForm && (
          <form onSubmit={handleAddBin} style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
            <input
              placeholder="Bin No"
              value={binForm.bin_no}
              onChange={(e) => setBinForm({ ...binForm, bin_no: e.target.value })}
              style={{ flex: 1, padding: "10px" }}
            />
            <input
              placeholder="Component Details"
              value={binForm.component_details}
              onChange={(e) =>
                setBinForm({ ...binForm, component_details: e.target.value })
              }
              style={{ flex: 2, padding: "10px" }}
            />
            <button type="submit" style={primaryBtn}>Add</button>
          </form>
        )}

        {store.bins?.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Bin No</th>
                <th style={thStyle}>Component Details</th>
                <th style={thStyle}>Created</th>
              </tr>
            </thead>
            <tbody>
              {store.bins.map((bin) => (
                <tr key={bin.id}>
                  <td style={tdStyle}>{bin.bin_no}</td>
                  <td style={tdStyle}>{bin.component_details || "-"}</td>
                  <td style={tdStyle}>
                    {new Date(bin.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#64748b" }}>No bins added yet</div>
        )}
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button style={primaryBtn} onClick={() => navigate(`/store/${store.id}/inventory`)}>
          View Inventory
        </button>
        <button style={primaryBtn} onClick={() => navigate(`/store/${store.id}/gate-passes`)}>
          Receive Gate Pass
        </button>
        <button style={primaryBtn} onClick={() => navigate(`/store/${store.id}/received-gate-passes`)}>
          Received Gate Passes
        </button>
        <button style={secondaryBtn} onClick={() => setIsEditing(true)}>
          Edit Store
        </button>
        <button style={dangerBtn} onClick={handleDeleteStore}>
          Delete Store
        </button>
      </div>
    </div>
  );
}
