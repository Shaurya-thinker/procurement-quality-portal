import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchContractorById,
  deleteContractor,
} from "../../api/contractors.api";

export default function ContractorDetails() {
  const { contractorId } = useParams();
  const navigate = useNavigate();

  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!contractorId) {
      setError("Invalid contractor id");
      setLoading(false);
      return;
    }

    const loadContractor = async () => {
      try {
        const data = await fetchContractorById(contractorId);
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contractor?\nThis action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await deleteContractor(contractorId);
      navigate("/contractors");
    } catch (err) {
      console.error(err);
      alert("Failed to delete contractor");
      setDeleting(false);
    }
  };

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
      {/* Back Button */}
      <button
        onClick={() => navigate("/contractors")}
        className="btn-secondary"
        style={{ marginBottom: 16 }}
      >
        ← Back to Contractors
      </button>

      {/* Title */}
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        {contractor.name}
      </h1>

      {/* Details Card */}
      <div className="details-card">
        <DetailRow label="Phone" value={contractor.phone} />
        <DetailRow label="Email" value={contractor.email} />
        <DetailRow label="Address" value={contractor.address} />
        <DetailRow label="Status" value={contractor.status} />
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 24,
        }}
      >
        <button
          className="btn-primary"
          onClick={() => navigate(`/contractors/${contractorId}/edit`)}
        >
          Edit Contractor
        </button>

        <button
          className="btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Contractor"}
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", marginBottom: 12 }}>
      <div style={{ width: 140, fontWeight: 600 }}>{label}</div>
      <div>{value || "-"}</div>
    </div>
  );
}
