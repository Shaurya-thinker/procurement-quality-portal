export default function InspectionSummary({ items, onChange }) {
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
    backgroundColor: '#ffffff',
    color: '#1f2937',
  };

  const textareaStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    minHeight: '60px',
    resize: 'vertical',
  };

  const warningStyle = {
    padding: '6px 8px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: '12px',
    borderRadius: '3px',
  };

  const successStyle = {
    padding: '6px 8px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    fontSize: '12px',
    borderRadius: '3px',
  };

  const handleChange = (index, field, value) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updatedItems);
  };

  const getValidationStatus = (item) => {
    const received = parseInt(item.received_quantity) || 0;
    const accepted = parseInt(item.accepted_quantity) || 0;
    const rejected = parseInt(item.rejected_quantity) || 0;
    const total = accepted + rejected;

    if (total === 0) return null;
    if (total === received) return 'valid';
    return 'invalid';
  };

  const emptyStateStyle = {
    padding: '32px 16px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  };

  if (items.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          No items to inspect. Please create a material receipt first.
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
            <th style={thStyle}>Received Qty</th>
            <th style={thStyle}>Accepted Qty</th>
            <th style={thStyle}>Rejected Qty</th>
            <th style={thStyle}>Remarks</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const validationStatus = getValidationStatus(item);
            return (
              <tr key={index}>
                <td style={tdStyle}>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>
                    {item.item_code || '-'}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '13px' }}>
                    {item.description || '-'}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>
                    {item.received_quantity || 0}
                  </div>
                </td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    value={item.accepted_quantity || ''}
                    onChange={(e) => handleChange(index, 'accepted_quantity', e.target.value)}
                    style={inputStyle}
                    min="0"
                    max={item.received_quantity || 0}
                  />
                </td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    value={item.rejected_quantity || ''}
                    onChange={(e) => handleChange(index, 'rejected_quantity', e.target.value)}
                    style={inputStyle}
                    min="0"
                    max={item.received_quantity || 0}
                  />
                </td>
                <td style={tdStyle}>
                  <textarea
                    value={item.remarks || ''}
                    onChange={(e) => handleChange(index, 'remarks', e.target.value)}
                    style={textareaStyle}
                    placeholder="Add remarks..."
                  />
                </td>
                <td style={tdStyle}>
                  {validationStatus === 'valid' ? (
                    <div style={successStyle}>✓ Valid</div>
                  ) : validationStatus === 'invalid' ? (
                    <div style={warningStyle}>⚠ Mismatch</div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>-</div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
