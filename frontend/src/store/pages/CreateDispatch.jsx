import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import MaterialDispatchForm from "./MaterialDispatchForm";
import { getDispatchById } from "../../api/store.api";


export default function CreateDispatch() {
  const { dispatchId } = useParams();
  const navigate = useNavigate();
  const { loading } = useStore();

  useEffect(() => {
  if (!dispatchId) return;

  fetch(`http://localhost:8000/api/v1/store/material-dispatch/${dispatchId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => setInitialData(data));
}, [dispatchId]);

  const [initialData, setInitialData] = useState(null);

  if (dispatchId && !initialData) {
  return <p style={{ padding: 24 }}>Loading dispatch…</p>;
}



  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
       <button
  onClick={() => navigate(-1)}
  style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: '1px solid #116de7ff',
          background: 'white',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
  aria-label="Go back"
>
  ←
</button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>
            {dispatchId ? "Edit Material Dispatch" : "Create Material Dispatch"}
          </h1>
        </div>
      </div>

      <MaterialDispatchForm
        initialData={initialData}
        mode={dispatchId ? "EDIT" : "CREATE"}
        loading={loading}
      />
    </div>
  );
}
