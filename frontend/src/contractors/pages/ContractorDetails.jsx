import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchContractorById, deleteContractor } from "../../api/contractors.api";

export default function ContractorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchContractorById(id);
        setContractor(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  if (!contractor) return <p>Loading...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>{contractor.name}</h1>

      <p><b>Phone:</b> {contractor.phone}</p>
      <p><b>Email:</b> {contractor.email || "-"}</p>
      <p><b>Address:</b> {contractor.address || "-"}</p>
      <p><b>Status:</b> {contractor.status}</p>

      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        <button className="btn-secondary" onClick={() => navigate(`/contractors/${id}/edit`)}>
          Edit
        </button>

        <button
          className="btn-danger"
          onClick={async () => {
            if (window.confirm("Delete contractor?")) {
              await deleteContractor(id);
              navigate("/contractors");
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
