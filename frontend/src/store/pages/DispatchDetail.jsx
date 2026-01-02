import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DispatchPreview from "../components/DispatchPreview";

export default function DispatchDetail() {
  const { dispatchId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/store/material-dispatch/${dispatchId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setData);
  }, [dispatchId]);

  useEffect(() => {
  if (data?.dispatch_status === "DRAFT") {
    navigate(`/store/dispatch/edit/${dispatchId}`);
  }
}, [data, dispatchId, navigate]);


  const handleCancel = async () => {
    const reason = prompt("Enter reason for cancellation (required):");

    if (!reason || reason.trim().length < 5) {
      alert("Cancellation reason must be at least 5 characters.");
      return;
    }

    try {
      await fetch(
        `http://localhost:8000/api/v1/store/material-dispatch/${dispatchId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ cancel_reason: reason }),
        }
      );

      navigate("/store/dispatch");
    } catch {
      alert("Failed to cancel dispatch");
    }
  };

  if (!data) {
    return <p style={{ padding: 24 }}>Loading dispatch…</p>;
  }

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate(-1)} className="back-arrow-btn">
          ←
        </button>
        <h2 style={{ margin: 0 }}>Material Dispatch</h2>
      </div>

      {data.dispatch_status !== "DRAFT" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "14px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            borderLeft: "5px solid #f59e0b",
            color: "#92400e",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              lineHeight: "1",
            }}
          >
            ⚠️
          </span>

          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            This dispatch has been finalized and can no longer be edited.
          </div>
        </div>
      )}

      <DispatchPreview dispatch={data} />

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
