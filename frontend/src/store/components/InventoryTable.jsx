export default function InventoryTable({ items = [], searchTerm = '', locationFilter = '' }) {
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

  const locationBadgeStyle = {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '3px',
    fontSize: '12px',
  };

  const emptyStateStyle = {
    padding: '32px 16px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  };

  // Filter items based on search term and location filter
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || item.location === locationFilter;
    
    return matchesSearch && matchesLocation;
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
          No inventory items found. Start by receiving items from quality.
        </div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          No items match your search or filter criteria.
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Item Code</th>
            <th style={thStyle}>Item Name</th>
            <th style={thStyle}>Quantity Available</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td style={tdStyle}>
                <span style={{ fontWeight: '500' }}>{item.item_code || '-'}</span>
              </td>
              <td style={tdStyle}>{item.item_name || '-'}</td>
              <td style={tdStyle}>
                <span style={quantityBadgeStyle}>
                  {item.quantity_available || 0}
                </span>
              </td>
              <td style={tdStyle}>
                <span style={locationBadgeStyle}>
                  {item.location || '-'}
                </span>
              </td>
              <td style={tdStyle}>{formatDate(item.last_updated)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
