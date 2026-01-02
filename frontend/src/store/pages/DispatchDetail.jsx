import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DispatchPreview from "../components/DispatchPreview";
import { getDispatchById, cancelDispatch } from "../../api/store.api";

export default function DispatchDetail() {
  const { dispatchId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getDispatchById(dispatchId)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch(() => {
        alert("Failed to load dispatch");
        navigate("/store/dispatch");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatchId, navigate]);

  const handleCancel = async () => {
    const reason = prompt("Enter reason for cancellation (min 5 characters):");

    if (!reason || reason.trim().length < 5) {
      alert("Cancellation reason must be at least 5 characters.");
      return;
    }

    try {
      await cancelDispatch(dispatchId, { cancel_reason: reason });
      alert("Dispatch cancelled successfully");
      navigate("/store/dispatch");
    } catch {
      alert("Failed to cancel dispatch");
    }
  };

  if (loading) {
    return <p style={{ padding: 24 }}>Loading dispatch…</p>;
  }

  if (!data) {
    return <p style={{ padding: 24 }}>Dispatch not found</p>;
  }

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate(-1)} className="back-arrow-btn">
          ←
        </button>
        <h2 style={{ margin: 0 }}>Material Dispatch</h2>

        {/* ✅ EDIT BUTTON (ONLY FOR DRAFT) */}
        {data.dispatch_status === "DRAFT" && (
          <button
            onClick={() => navigate(`/store/dispatch/edit/${dispatchId}`)}
            style={{
              marginLeft: "auto",
              padding: "8px 14px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ✏️ Edit
          </button>
        )}
      </div>

      {/* ⚠️ Finalized Banner */}
      {data.dispatch_status !== "DRAFT" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "14px 16px",
            borderRadius: 10,
            marginBottom: 20,
            borderLeft: "5px solid #f59e0b",
            color: "#92400e",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          }}
        >
          ⚠️
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            This dispatch has been finalized and can no longer be edited.
          </div>
        </div>
      )}

      {/* Preview */}
      <DispatchPreview dispatch={data} />

      {/* ❌ Cancel (only if DISPATCHED) */}
      {data.dispatch_status === "DISPATCHED" && (
        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleCancel}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel Dispatch
          </button>
        </div>
      )}
    </div>
  );
}
