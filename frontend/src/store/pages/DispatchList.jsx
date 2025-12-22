import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

export default function DispatchList() {
  const navigate = useNavigate();
  const { getDispatches, loading, error } = useStore();
  const [dispatches, setDispatches] = useState([]);

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

  const containerStyle = {
    padding: '24px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
  };

  const createButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    padding: '16px',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    fontWeight: '600',
    fontSize: '12px',
    color: '#374151',
    textTransform: 'uppercase',
  };

  const tdStyle = {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1f2937',
  };

  const emptyStateStyle = {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#6b7280',
  };

  const errorStyle = {
    padding: '16px',
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
    borderRadius: '6px',
    marginBottom: '16px',
  };

  return (
    <div style={containerStyle}>
      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  }}
>
  <button
    onClick={() => navigate(-1)}
    className="back-arrow-btn"
    aria-label="Go back"
  >
    ←
  </button>

  <h1 style={titleStyle}>Material Dispatches</h1>

  <button
    onClick={handleCreateDispatch}
    style={createButtonStyle}
    disabled={loading}
  >
    <span>+</span>
    Create Dispatch
  </button>
</div>


      {error && <div style={errorStyle}>{error}</div>}

      <div style={cardStyle}>
        {loading ? (
          <div style={emptyStateStyle}>Loading dispatches...</div>
        ) : dispatches.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>No dispatches found</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              Click "Create Dispatch" to get started
            </p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Dispatch #</th>
                <th style={thStyle}>Requested By</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Reference</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((dispatch) => (
                <tr key={dispatch.id}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: '600' }}>
                      {dispatch.dispatch_number || `#${dispatch.id}`}
                    </span>
                  </td>
                  <td style={tdStyle}>{dispatch.requested_by}</td>
                  <td style={tdStyle}>{dispatch.quantity}</td>
                  <td style={tdStyle}>
                    {new Date(dispatch.dispatched_at).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>{dispatch.reference || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}