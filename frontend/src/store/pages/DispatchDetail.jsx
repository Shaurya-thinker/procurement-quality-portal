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

  if (!data) {
    return <p style={{ padding: 24 }}>Loading dispatch…</p>;
  }

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      
      {/* 🔙 Back Arrow + Title */}
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

        <h2 style={{ margin: 0 }}>Material Dispatch</h2>
      </div>

      {/* 🔒 Finalized banner */}
      {data.dispatch_status !== "DRAFT" && (
        <div
          style={{
            background: "#fef3c7",
            padding: "10px",
            borderRadius: 6,
            marginBottom: 16,
            color: "#92400e",
            fontSize: 14,
          }}
        >
          This dispatch is finalized and cannot be edited.
        </div>
      )}

      <DispatchPreview dispatch={data} />
    </div>
  );
}
