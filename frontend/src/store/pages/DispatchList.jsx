import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

export default function DispatchList() {
  const navigate = useNavigate();
  const { getDispatches, loading, error } = useStore();
  const [dispatches, setDispatches] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    loadDispatches();
  }, []);

  const loadDispatches = async () => {
    try {
      const data = await getDispatches();
      setDispatches(data);
    } catch (err) {
      console.error('Failed to load dispatches:', err);
    }
  };

  const handleCreateDispatch = () => {
    navigate('/store/dispatch/create');
  };

  /* ================= STYLES ================= */

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '32px',
    color: '#1e293b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    letterSpacing: '-0.5px',
  };

  const createButtonStyle = {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
  };

  const tableContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse' };

  const thStyle = {
    padding: '18px 20px',
    textAlign: 'left',
    borderBottom: '2px solid #cbd5e1',
    fontWeight: '700',
    fontSize: '14px',
    color: '#1e293b',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  };

  const tdStyle = {
    padding: '18px 20px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '500',
  };

  const getRowStyle = (isHovered, isCancelled) => ({
    transition: 'all 0.25s ease',
    backgroundColor: isHovered ? '#f8fafc' : 'transparent',
    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
    opacity: isCancelled ? 0.6 : 1,
  });

  const statusBadgeStyle = (status) => {
    if (status === 'DRAFT') return { bg: '#fef3c7', color: '#92400e' };
    if (status === 'DISPATCHED') return { bg: '#dcfce7', color: '#166534' };
    return { bg: '#fee2e2', color: '#7f1d1d' };
  };

  const actionButtonStyle = {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  };

  /* ================= RENDER ================= */

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div>Material Dispatches</div>
        <button onClick={handleCreateDispatch} style={createButtonStyle}>
          <span style={{ fontSize: '18px' }}>+</span>
          Create Dispatch
        </button>
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: 16 }}>{error}</div>}

      <div style={tableContainerStyle}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading dispatches…</div>
        ) : dispatches.length === 0 ? (
          <div style={{ padding: 80, textAlign: 'center', color: '#64748b' }}>
            No dispatches found
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Dispatch #</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Requested By</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Reference</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((dispatch) => {
                const badge = statusBadgeStyle(dispatch.dispatch_status);
                const isCancelled = dispatch.dispatch_status === 'CANCELLED';

                return (
                  <tr
                    key={dispatch.id}
                    style={getRowStyle(hoveredRow === dispatch.id, isCancelled)}
                    onMouseEnter={() => setHoveredRow(dispatch.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={tdStyle}>{dispatch.dispatch_number}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: '6px 12px',
                          borderRadius: 999,
                          background: badge.bg,
                          color: badge.color,
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {dispatch.dispatch_status}
                      </span>
                    </td>

                    <td style={tdStyle}>{dispatch.created_by}</td>

                    <td style={tdStyle}>
                      {dispatch.line_items.reduce(
                        (sum, li) => sum + Number(li.quantity_dispatched),
                        0
                      )}
                    </td>

                    <td style={tdStyle}>
                      {new Date(dispatch.dispatch_date).toLocaleDateString('en-IN')}
                    </td>

                    <td style={tdStyle}>
                      {dispatch.reference_type} – {dispatch.reference_id}
                    </td>

                    <td style={tdStyle}>
                      <button
                        className="btn-secondary btn-small"
                        onClick={() => navigate(`/store/dispatch/${dispatch.id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
