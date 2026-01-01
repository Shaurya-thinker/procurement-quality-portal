import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchContractors } from "../../api/contractors.api";
import "../css/contractors.css";

export default function ContractorsList() {
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    const loadContractors = async () => {
      try {
        const data = await fetchContractors();
        console.log("Fetched contractors:", data);
        setContractors(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadContractors();
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
    onClick={() => {
      console.log("CLICKED CONTRACTOR OBJECT:", c);
      console.log("CLICKED CONTRACTOR ID:", c.id);
      navigate(`/contractors/${c.id}`);
    }}
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
