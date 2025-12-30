import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MaterialDispatchForm from "./MaterialDispatchForm";

export default function DispatchDetail() {
  const { dispatchId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/store/material-dispatch/${dispatchId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setData);
  }, [dispatchId]);

  if (!data) {
    return <p style={{ padding: 24 }}>Loading dispatch…</p>;
  }

  return (
  <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
    <MaterialDispatchForm
      initialData={data}
      mode="VIEW"
    />
  </div>
);

}
