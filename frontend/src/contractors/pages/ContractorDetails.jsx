import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchContractorById } from "../../api/contractors.api";

export default function ContractorDetails() {
  const { contractorId } = useParams();   // ✅ FIXED
  const navigate = useNavigate();

  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contractorId) {
      setError("Invalid contractor id");
      setLoading(false);
      return;
    }

    const loadContractor = async () => {
      try {
        const data = await fetchContractorById(contractorId); // ✅ FIXED
        setContractor(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load contractor details");
      } finally {
        setLoading(false);
      }
    };

    loadContractor();
  }, [contractorId]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading contractor...</div>;
  }

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>{error}</div>;
  }

  if (!contractor) {
    return <div style={{ padding: 24 }}>Contractor not found</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/contractors")}
        className="btn-secondary"
        style={{ marginBottom: 16 }}
      >
        ← Back to Contractors
      </button>

      <h1 style={{ fontSize: 24, fontWeight: 600 }}>
        {contractor.name}
      </h1>

      <div className="details-card">
        <DetailRow label="Phone" value={contractor.phone} />
        <DetailRow label="Email" value={contractor.email} />
        <DetailRow label="Address" value={contractor.address} />
        <DetailRow
          label="Status"
          value={contractor.status}
        />
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", marginBottom: 12 }}>
      <div style={{ width: 140, fontWeight: 600 }}>
        {label}
      </div>
      <div>{value || "-"}</div>
    </div>
  );
}
