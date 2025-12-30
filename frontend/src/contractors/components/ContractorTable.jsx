import { useNavigate } from "react-router-dom";

export default function ContractorTable({ contractors }) {
  const navigate = useNavigate();

  if (!contractors.length) {
    return <p>No contractors found.</p>;
  }

  return (
    <table className="contractor-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {contractors.map((c) => (
          <tr
            key={c.id}
            onClick={() => navigate(`/contractors/${c.id}`)}
            className="clickable-row"
          >
            <td>{c.name}</td>
            <td>{c.phone}</td>
            <td>{c.email}</td>
            <td>
              <span className={`status ${c.status?.toLowerCase()}`}>
                {c.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
