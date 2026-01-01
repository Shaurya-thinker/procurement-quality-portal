import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function ReceivedGatePasses() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`/api/v1/store/stores/${storeId}/received-gate-passes`)
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [storeId]);

  /* 🔍 SEARCH FILTER */
  const filteredData = data.filter((gp) => {
    const term = searchTerm.toLowerCase();
    return (
      gp.gate_pass_number?.toLowerCase().includes(term) ||
      gp.mr_number?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="back-arrow-btn"
          aria-label="Go back"
        >
          ←
        </button>

        <div>
          <h2 style={{ margin: 0 }}>Received Gate Passes</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
            Store ID: {storeId}
          </p>
        </div>
      </div>

      {/* Summary + Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Summary */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            padding: "12px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            background: "#f9fafb",
          }}
        >
          <div>
            <div style={label}>Total Gate Passes</div>
            <div style={value}>{filteredData.length}</div>
          </div>

          <div>
            <div style={label}>Status</div>
            <div style={{ ...value, color: "#065f46" }}>RECEIVED</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={label}>Search</label>
          <input
            type="text"
            placeholder="Gate Pass / MR No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "13px",
            }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading received gate passes...</p>
      ) : filteredData.length === 0 ? (
        <p>No matching gate passes found.</p>
      ) : (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th style={th}>Gate Pass No</th>
                <th style={th}>MR No</th>
                <th style={th}>Vendor</th>
                <th style={th}>Received On</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((gp) => (
                <tr
                  key={gp.id}
                  onClick={() => navigate(`/quality/gate-pass/${gp.id}`)}
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={td}>{gp.gate_pass_number}</td>
                  <td style={td}>{gp.mr_number}</td>
                  <td style={td}>{gp.vendor_name}</td>
                  <td style={td}>
                    {new Date(gp.received_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* 🔹 Shared Styles */
const label = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
};

const value = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
};

const th = {
  textAlign: "left",
  padding: "12px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#374151",
  textTransform: "uppercase",
};

const td = {
  padding: "12px",
  fontSize: "13px",
  color: "#111827",
};
