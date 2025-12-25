export default function MRLineItemTable({ items, onChange, isReadOnly = false }) {
  const containerStyle = {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    lineHeight: '1.4',
  };

  const tdStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    color: '#1e293b',
    verticalAlign: 'middle',
  };

  const inputStyle = {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
    backgroundColor: isReadOnly ? '#f8fafc' : 'white',
    color: '#1e293b',
    cursor: isReadOnly ? 'not-allowed' : 'text',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  };

  const handleChange = (index, field, value) => {
    if (onChange) {
      const updatedItems = items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      );
      onChange(updatedItems);
    }
  };

  const handleRemoveItem = (index) => {
    if (!isReadOnly && onChange) {
      const updatedItems = items.filter((_, i) => i !== index);
      onChange(updatedItems);
    }
  };

  const emptyStateStyle = {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '16px',
  };

  const emptyIconStyle = {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: '0.5',
  };

  const emptyTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  };

  const emptyTextStyle = {
    fontSize: '14px',
    color: '#64748b',
  };

  const removeButtonStyle = {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
  };

  if (items.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>📦</div>
          <div style={emptyTitleStyle}>No Items Added</div>
          <div style={emptyTextStyle}>Select a Purchase Order to load items</div>
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
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Unit</th>
            <th style={thStyle}>Ordered Qty</th>
            <th style={thStyle}>Received Qty</th>
            {!isReadOnly && <th style={thStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={item.item_code || ''}
                  onChange={(e) => handleChange(index, 'item_code', e.target.value)}
                  disabled={isReadOnly}
                  style={inputStyle}
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  disabled={isReadOnly}
                  style={inputStyle}
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={item.unit || ''}
                  onChange={(e) => handleChange(index, 'unit', e.target.value)}
                  disabled={isReadOnly}
                  style={inputStyle}
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={item.ordered_quantity || ''}
                  onChange={(e) => handleChange(index, 'ordered_quantity', e.target.value)}
                  disabled={isReadOnly}
                  style={inputStyle}
                  min="0"
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={item.received_quantity || ''}
                  onChange={(e) => handleChange(index, 'received_quantity', e.target.value)}
                  disabled={false}   // 👈 ALWAYS editable
                  style={{
                    ...inputStyle,
                    backgroundColor: 'white',
                    cursor: 'text',
                  }}
                  min="0"
                />
              </td>
              {!isReadOnly && (
                <td style={tdStyle}>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="btn-danger btn-small"
                  >
                    Remove
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
