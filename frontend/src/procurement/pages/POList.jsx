import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcurement } from '../hooks/useProcurement';
import POStatusBadge from '../components/POStatusBadge';

const POList = () => {
  const navigate = useNavigate();
  const { fetchProcurementOrders, loading, error } = useProcurement();

  const [procurementOrders, setProcurementOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loadingError, setLoadingError] = useState('');

  useEffect(() => {
    loadProcurementOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [procurementOrders, statusFilter]);

  const loadProcurementOrders = async () => {
    setLoadingError('');
    try {
      const data = await fetchProcurementOrders();
      const posArray = Array.isArray(data) ? data : data.data || [];
      setProcurementOrders(posArray);
    } catch (err) {
      setLoadingError(err.response?.data?.message || 'Failed to load POs');
      setProcurementOrders([]);
    }
  };

  const applyFilters = () => {
    let filtered = procurementOrders;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(po => po.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleViewPO = (poId) => {
    navigate(`/procurement/${poId}`);
  };

  const handleCreatePO = () => {
    navigate('/procurement/create');
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
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
    fontSize: '14px',
    color: '#1f2937',
  };

  const trHoverStyle = {
    backgroundColor: '#f9fafb',
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

  const loadingStyle = {
    padding: '24px',
    textAlign: 'center',
    color: '#6b7280',
  };

  const errorAlertStyle = {
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
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

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div>Purchase Orders</div>
        <button onClick={handleCreatePO} style={buttonStyle}>
          + Create PO
        </button>
      </div>

      {(loadingError || error) && (
        <div style={errorAlertStyle}>{loadingError || error}</div>
      )}

      <div style={filterContainerStyle}>
        <div style={filterGroupStyle}>
          <label style={labelStyle}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="ALL">All</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
          </select>
        </div>
      </div>

      {loading && (
        <div style={loadingStyle}>Loading purchase orders...</div>
      )}

      {!loading && procurementOrders.length === 0 && (
        <div style={tableContainerStyle}>
          <div style={emptyStateStyle}>
            <div style={emptyStateHeadingStyle}>No Purchase Orders Found</div>
            <div>Create your first purchase order to get started</div>
          </div>
        </div>
      )}

      {!loading && procurementOrders.length > 0 && (
        <>
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>PO Number</th>
                  <th style={thStyle}>Vendor ID</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created Date</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((po) => (
                    <tr key={po.id} style={{ ':hover': trHoverStyle }}>
                      <td style={tdStyle}>{po.po_number || '-'}</td>
                      <td style={tdStyle}>{po.vendor_id || '-'}</td>
                      <td style={tdStyle}>
                        <POStatusBadge status={po.status || 'DRAFT'} />
                      </td>
                      <td style={tdStyle}>{formatDate(po.created_at)}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleViewPO(po.id)}
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
                      No POs found with the selected filter
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
    </div>
  );
};

export default POList;
