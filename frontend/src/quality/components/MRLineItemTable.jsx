export default function MRLineItemTable({ items, onChange, isReadOnly = false }) {
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

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
    backgroundColor: isReadOnly ? '#f3f4f6' : '#ffffff',
    color: '#1f2937',
    cursor: isReadOnly ? 'not-allowed' : 'text',
  };

  const handleChange = (index, field, value) => {
    if (!isReadOnly && onChange) {
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
    padding: '32px 16px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  };

  const removeButtonStyle = {
    padding: '6px 10px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  };

  if (items.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          No line items added. Add items to the material receipt.
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
                  disabled={isReadOnly}
                  style={inputStyle}
                  min="0"
                />
              </td>
              {!isReadOnly && (
                <td style={tdStyle}>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    style={removeButtonStyle}
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
