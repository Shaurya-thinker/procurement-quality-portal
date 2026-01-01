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

  const handleCancel = async (dispatchId) => {
    const reason = prompt(
      'Enter reason for cancellation (required):'
    );

    if (!reason || reason.trim().length < 5) {
      alert('Cancellation reason must be at least 5 characters.');
      return;
    }

    try {
      await fetch(
        `http://localhost:8000/api/v1/store/material-dispatch/${dispatchId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ cancel_reason: reason })
        }
      );

      loadDispatches();
    } catch {
      alert('Failed to cancel dispatch');
    }
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
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Requested By</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Reference</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((dispatch) => {
                const isCancelled = dispatch.dispatch_status === 'CANCELLED';

                return (
                  <tr
                    key={dispatch.id}
                    style={{
                      opacity: isCancelled ? 0.6 : 1,
                      cursor: dispatch.dispatch_status === 'DRAFT' ? 'pointer' : 'default'
                    }}
                   onClick={() => {
                      if (dispatch.dispatch_status === "DRAFT") {
                        navigate(`/store/dispatch/edit/${dispatch.id}`);
                      } else {
                        navigate(`/store/dispatch/${dispatch.id}`);
                      }
                    }}
                  >
                    <td style={tdStyle}>{dispatch.dispatch_number}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor:
                            dispatch.dispatch_status === 'DRAFT'
                              ? '#fef3c7'
                              : dispatch.dispatch_status === 'DISPATCHED'
                              ? '#dcfce7'
                              : '#fee2e2',
                          color:
                            dispatch.dispatch_status === 'DRAFT'
                              ? '#92400e'
                              : dispatch.dispatch_status === 'DISPATCHED'
                              ? '#166534'
                              : '#7f1d1d'
                        }}
                      >
                        {dispatch.dispatch_status}
                      </span>
                    </td>

                    <td style={tdStyle}>{dispatch.created_by}</td>

                    <td style={tdStyle}>
                      {dispatch.line_items.reduce(
                        (sum, li) => sum + Number(li.quantity_dispatched), 0
                      )}
                    </td>

                    <td style={tdStyle}>
                      {new Date(dispatch.dispatch_date).toLocaleDateString()}
                    </td>

                    <td style={tdStyle}>
                      {dispatch.reference_type} – {dispatch.reference_id}
                    </td>

                    <td style={tdStyle}>
                      {dispatch.dispatch_status === 'DISPATCHED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(dispatch.id);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Cancel
                        </button>
                      )}
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