import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockContractors } from "../mockContractors";
import "../css/contractors.css";

export default function ContractorsList() {
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    setContractors(mockContractors);
  }, []);

  return (
    <div className="contractors-page">
      <div className="contractors-card">
        <div className="contractors-header">
          <h1>Contractors</h1>
          <button
            className="btn-primary"
            onClick={() => navigate("/contractors/create")}
          >
            + Add Contractor
          </button>
        </div>

        <table className="contractors-table">
          <thead>
            <tr>
              <th>Contractor Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {contractors.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/contractors/${c.id}`)}
              >
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.address}</td>
                <td>
                  <span
                    className={`status-pill ${
                      c.status === "ACTIVE"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
