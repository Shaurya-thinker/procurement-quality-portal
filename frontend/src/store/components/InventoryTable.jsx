export default function InventoryTable({
  items = [],
  searchTerm = '',
  hideStore = false,
  onDispatch,
}) {
  const containerStyle = {
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

  const quantityBadgeStyle = {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '3px',
    fontSize: '13px',
    fontWeight: '500',
  };

  const emptyStateStyle = {
    padding: '32px 16px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  };

  const highlightRowStyle = {
    backgroundColor: '#f1c3f5ff', // soft yellow
  };

  const isSearchActive = searchTerm && searchTerm.trim() !== '';


  /* 🔎 Search filtering (valid fields only) */
  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (
      item.item_id?.toString().includes(term) ||
      item.store_id?.toString().includes(term) ||
      item.bin_id?.toString().includes(term)
    );
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

  if (items.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          No inventory items found. Receive items via Gate Pass.
        </div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          No items match your search.
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Inventory ID</th>
            <th style={thStyle}>Item ID</th>
            <th style={thStyle}>Quantity</th>
            {!hideStore && <th style={thStyle}>Store ID</th>}
            <th style={thStyle}>Bin ID</th>
            <th style={thStyle}>Received On</th>
            {!hideStore && onDispatch && <th style={thStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr
              key={item.id}
              style={isSearchActive ? highlightRowStyle : {}}
            >
              <td style={tdStyle}>{item.id}</td>
              <td style={tdStyle}>{item.item_id}</td>
              <td style={tdStyle}>
                <span style={quantityBadgeStyle}>
                  {item.quantity}
                </span>
              </td>
              {!hideStore && (
                <td style={tdStyle}>{item.store_id}</td>
              )}
              <td style={tdStyle}>{item.bin_id}</td>
              <td style={tdStyle}>
                {formatDate(item.created_at)}
              </td>
              {!hideStore && onDispatch && (
                <td style={tdStyle}>
                  <button
                    onClick={() => onDispatch(item)}
                    disabled={item.quantity <= 0}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    Dispatch
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
