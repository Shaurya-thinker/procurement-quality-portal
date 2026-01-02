import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchContractors } from "../../api/contractors.api";

const ContractorsList = () => {
  const navigate = useNavigate();

  const [contractors, setContractors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);


  const itemsPerPage = 10;

  useEffect(() => {
    loadContractors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contractors, search, statusFilter]);

  const loadContractors = async () => {
    try {
      setLoading(true);
      const data = await fetchContractors();
      setContractors(data || []);
    } catch (err) {
      setError("Failed to load contractors");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...contractors];

    if (statusFilter !== "ALL") {
      data = data.filter(c => c.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }

    setFiltered(data);
    setCurrentPage(1);
  };

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  /* ---------- Styles (Same design system as POList) ---------- */

  const containerStyle = {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '32px',
    color: '#1e293b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
  };

  const filterCardStyle = {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "20px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
  };

  const inputStyle = {
    padding: "10px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    minWidth: "260px",
  };

  const selectStyle = {
    ...inputStyle,
    minWidth: "180px",
  };

  const tableCardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

   const thStyle = {
    padding: '18px 20px',
    textAlign: 'left',
    borderBottom: '2px solid #cbd5e1',
    fontWeight: '700',
    fontSize: '14px',
    color: '#1e293b',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    textTransform: 'none',
    letterSpacing: '-0.1px',
  };

  const tdStyle = {
    padding: "18px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    fontWeight: "500",
  };

  const statusPill = (status) => ({
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    color: status === "ACTIVE" ? "#065f46" : "#991b1b",
    background: status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
  });

  const getRowStyle = (isHovered) => ({
    transition: "all 0.25s ease",
    backgroundColor: isHovered ? "#f8fafc" : "transparent",
    transform: isHovered ? "translateX(4px)" : "translateX(0)",
    cursor: "pointer",
  });

  


  const actionBtn = {
    padding: "8px 16px",
    background: "linear-gradient(135deg,#1e293b,#334155)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  };

  /* ---------- Render ---------- */

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div>Contractors</div>
        <button
          className="btn-primary"
          onClick={() => navigate("/contractors/create")}
        >
          + Add Contractor
        </button>
      </div>

      {/* Filters */}
      <div style={filterCardStyle}>
        <input
          type="text"
          placeholder="Search by name, phone, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLACKLISTED">Blacklisted</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 24, color: "#64748b" }}>
          Loading contractors…
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "#fee2e2", padding: 12, borderRadius: 6 }}>
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div style={tableCardStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Contractor Name</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((c) => (
                  <tr
                    key={c.id}
                    onMouseEnter={() => setHoveredRow(c.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={getRowStyle(hoveredRow === c.id)}
                  >
                    <td style={tdStyle}>{c.name}</td>
                    <td style={tdStyle}>{c.phone}</td>
                    <td style={tdStyle}>{c.email}</td>
                    <td style={tdStyle}>{c.address}</td>
                    <td style={tdStyle}>
                      <span style={statusPill(c.status)}>
                        {c.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => navigate(`/contractors/${c.id}`)}
                        className="btn-secondary btn-small"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: 40, textAlign: "center" }}>
                    <div style={{ fontSize: 48 }}>👷‍♂️</div>
                    <div style={{ fontWeight: 600, marginTop: 8 }}>
                      No Contractors Found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                background: currentPage === i + 1 ? "#1e293b" : "white",
                color: currentPage === i + 1 ? "white" : "#475569",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractorsList;
