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
  const [hoveredRow, setHoveredRow] = useState(null);

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

  const filterContainerStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
  };

  const filterGroupStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  };

  const selectStyle = {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.3s ease',
    backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px',
    appearance: 'none',
  };

  const buttonStyle = {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const tableContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
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
    padding: '18px 20px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '500',
    verticalAlign: 'middle',
  };

  const getRowStyle = (isHovered) => ({
    transition: 'all 0.3s ease',
    backgroundColor: isHovered ? '#f8fafc' : 'transparent',
    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
    cursor: 'pointer',
  });

  const actionButtonStyle = {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  };

  const loadingStyle = {
    padding: '24px',
    textAlign: 'center',
    color: '#64748B',
    fontSize: '13px',
  };

  const errorAlertStyle = {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '13px',
    fontWeight: '500',
  };

  const emptyStateStyle = {
    padding: '80px 24px',
    textAlign: 'center',
    color: '#64748b',
  };

  const emptyStateIconStyle = {
    fontSize: '80px',
    marginBottom: '24px',
    opacity: '0.6',
  };

  const emptyStateHeadingStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
    lineHeight: '1.3',
  };

  const emptyStateTextStyle = {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
    lineHeight: '1.5',
  };

  const emptyStateButtonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
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
    border: isActive ? 'none' : '1px solid #E2E8F0',
    backgroundColor: isActive ? '#1F3A5F' : '#FFFFFF',
    color: isActive ? 'white' : '#475569',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.15s',
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
        <button 
          onClick={handleCreatePO} 
          className="btn-primary"
        >
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
          Create PO
        </button>
      </div>

      {(loadingError || error) && (
        <div style={errorAlertStyle}>
          <strong>Error: </strong>
          {(loadingError || error).includes('Network') || (loadingError || error).includes('ECONNREFUSED')
            ? 'Backend server is not running. Please ensure the backend is started on http://localhost:8000'
            : loadingError || error}
        </div>
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
            <div style={emptyStateIconStyle}>📋</div>
            <div style={emptyStateHeadingStyle}>No Purchase Orders Yet</div>
            <div style={emptyStateTextStyle}>
              Start by creating your first purchase order to manage your procurement process efficiently.
            </div>
            <button 
              onClick={handleCreatePO} 
              className="btn-primary"
            >
              Create Your First PO
            </button>
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
                    <tr 
                      key={po.id} 
                      style={getRowStyle(hoveredRow === po.id)}
                      onMouseEnter={() => setHoveredRow(po.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => handleViewPO(po.id)}
                    >
                      <td style={tdStyle}>
                        <span style={{ fontWeight: '600', color: '#374151' }}>
                          {po.po_number || '-'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                          {po.vendor_id || '-'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <POStatusBadge status={po.status || 'DRAFT'} />
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: '#64748b' }}>
                          {formatDate(po.created_at)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPO(po.id);
                          }}
                          className="btn-secondary btn-small"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ color: '#64748b', fontSize: '16px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>🔍</div>
                        <div style={{ fontWeight: '600', marginBottom: '8px' }}>No results found</div>
                        <div>Try adjusting your filter to see more purchase orders</div>
                      </div>
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
                  border: '1px solid #E2E8F0',
                  backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                  color: '#475569',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.15s',
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
                  border: '1px solid #E2E8F0',
                  backgroundColor: currentPage === totalPages ? '#F1F5F9' : '#FFFFFF',
                  color: '#475569',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.15s',
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
