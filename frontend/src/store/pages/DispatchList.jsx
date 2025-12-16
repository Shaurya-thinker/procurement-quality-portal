import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

export default function DispatchList() {
  const navigate = useNavigate();
  const { getDispatches, loading, error, clearError } = useStore();

  const [dispatches, setDispatches] = useState([]);
  const [filteredDispatches, setFilteredDispatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadDispatches();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dispatches, searchTerm]);

  const loadDispatches = async () => {
    try {
      const data = await getDispatches();
      const dispatchesArray = Array.isArray(data) ? data : data.data || [];
      setDispatches(dispatchesArray);
    } catch (err) {
      console.error('Error loading dispatches:', err);
    }
  };

  const applyFilters = () => {
    let filtered = dispatches;

    if (searchTerm) {
      filtered = filtered.filter(dispatch =>
        dispatch.dispatch_slip_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispatch.requested_by?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDispatches(filtered);
    setCurrentPage(1);
  };

  const handleViewDispatch = (dispatchId) => {
    const dispatch = dispatches.find(d => d.id === dispatchId);
    if (dispatch) {
      navigate(`/store/dispatches/${dispatchId}`, {
        state: { dispatchData: dispatch },
      });
    }
  };

  const paginatedDispatches = filteredDispatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDispatches.length / itemsPerPage);

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1f2937',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const filterContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const filterGroupStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'inherit',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  };

  const tableContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '2px solid #d1d5db',
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#f9fafb',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '13px',
    color: '#1f2937',
  };

  const actionButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  };

  const errorAlertStyle = {
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const closeErrorStyle = {
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const emptyStateStyle = {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#6b7280',
  };

  const emptyStateHeadingStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  };

  const paginationStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '24px',
    alignItems: 'center',
  };

  const pageButtonStyle = (isActive) => ({
    padding: '6px 10px',
    border: isActive ? 'none' : '1px solid #d1d5db',
    backgroundColor: isActive ? '#3b82f6' : '#ffffff',
    color: isActive ? 'white' : '#374151',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTotalItemsIssued = (items) => {
    if (!items) return 0;
    return Array.isArray(items) 
      ? items.reduce((sum, item) => sum + (item.issue_quantity || 0), 0)
      : 0;
  };

  const loadingStyle = {
    padding: '24px',
    textAlign: 'center',
    color: '#6b7280',
  };

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div>Dispatch List</div>
        <button onClick={() => navigate('/store/dispatch')} style={buttonStyle}>
          + Create Dispatch
        </button>
      </div>

      {error && (
        <div style={errorAlertStyle}>
          <span>{error}</span>
          <span style={closeErrorStyle} onClick={clearError}>✕</span>
        </div>
      )}

      {loading && (
        <div style={loadingStyle}>Loading dispatches...</div>
      )}

      {!loading && dispatches.length > 0 && (
        <>
          <div style={filterContainerStyle}>
            <div style={filterGroupStyle}>
              <label style={labelStyle}>Search</label>
              <input
                type="text"
                placeholder="Dispatch slip no or requested by..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Dispatch Slip No</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Requested By</th>
                  <th style={thStyle}>Total Items Issued</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDispatches.length > 0 ? (
                  paginatedDispatches.map((dispatch) => (
                    <tr key={dispatch.id}>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: '500' }}>
                          {dispatch.dispatch_slip_no || '-'}
                        </span>
                      </td>
                      <td style={tdStyle}>{formatDate(dispatch.date)}</td>
                      <td style={tdStyle}>{dispatch.requested_by || '-'}</td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {getTotalItemsIssued(dispatch.items)} units
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleViewDispatch(dispatch.id)}
                          style={actionButtonStyle}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ ...tdStyle, textAlign: 'center' }}>
                      No dispatches match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={paginationStyle}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #d1d5db',
                  backgroundColor: currentPage === 1 ? '#f3f4f6' : '#ffffff',
                  color: '#374151',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={pageButtonStyle(currentPage === page)}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #d1d5db',
                  backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
                  color: '#374151',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {!loading && dispatches.length === 0 && (
        <div style={tableContainerStyle}>
          <div style={emptyStateStyle}>
            <div style={emptyStateHeadingStyle}>No Dispatches Found</div>
            <div>Create your first dispatch to get started</div>
          </div>
        </div>
      )}
    </div>
  );
}
