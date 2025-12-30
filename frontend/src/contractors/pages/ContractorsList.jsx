<button
  className="primary-btn"
  onClick={() => navigate("/contractors/create")}
>
  + Add Contractor
</button>

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchContractors } from "../../api/contractors.api";
import ContractorTable from "../components/ContractorTable";
import "../css/contractors.css";

export default function ContractorsList() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    try {
      setLoading(true);
      const data = await fetchContractors();
      setContractors(data);
    } catch (err) {
      setError("Failed to load contractors");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading contractors...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="contractors-page">
      <div className="contractors-header">
        <h1>Contractors</h1>
        <button
          className="primary-btn"
          onClick={() => navigate("/contractors/create")}
        >
          + Add Contractor
        </button>
      </div>

      <ContractorTable contractors={contractors} />
    </div>
  );
}
