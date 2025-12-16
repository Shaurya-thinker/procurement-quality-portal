const POLineItemRow = ({
  index,
  item,
  onChange,
  onRemove,
  isReadOnly = false,
}) => {
  const handleChange = (field, value) => {
    onChange(index, {
      ...item,
      [field]: value,
    });
  };

  const lineTotal = item.quantity && item.rate 
    ? (parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2)
    : '0.00';

  const inputStyle = {
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const readOnlyInputStyle = {
    ...inputStyle,
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    cursor: 'not-allowed',
  };

  const cellStyle = {
    padding: '8px 4px',
  };

  const totalCellStyle = {
    ...cellStyle,
    textAlign: 'right',
    fontWeight: '500',
  };

  const removeButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  };

  return (
    <tr>
      <td style={cellStyle}>
        <input
          type="text"
          value={item.item_id || ''}
          onChange={(e) => handleChange('item_id', e.target.value)}
          disabled={isReadOnly}
          style={isReadOnly ? readOnlyInputStyle : inputStyle}
          placeholder="Item Code"
        />
      </td>
      <td style={cellStyle}>
        <input
          type="text"
          value={item.item_description || ''}
          onChange={(e) => handleChange('item_description', e.target.value)}
          disabled={isReadOnly}
          style={isReadOnly ? readOnlyInputStyle : inputStyle}
          placeholder="Description"
        />
      </td>
      <td style={cellStyle}>
        <input
          type="text"
          value={item.unit || ''}
          onChange={(e) => handleChange('unit', e.target.value)}
          disabled={isReadOnly}
          style={isReadOnly ? readOnlyInputStyle : inputStyle}
          placeholder="Unit"
        />
      </td>
      <td style={cellStyle}>
        <input
          type="number"
          value={item.quantity || ''}
          onChange={(e) => handleChange('quantity', e.target.value)}
          disabled={isReadOnly}
          style={isReadOnly ? readOnlyInputStyle : inputStyle}
          placeholder="Qty"
          min="0"
          step="0.01"
        />
      </td>
      <td style={cellStyle}>
        <input
          type="number"
          value={item.rate || ''}
          onChange={(e) => handleChange('rate', e.target.value)}
          disabled={isReadOnly}
          style={isReadOnly ? readOnlyInputStyle : inputStyle}
          placeholder="Rate"
          min="0"
          step="0.01"
        />
      </td>
      <td style={totalCellStyle}>{lineTotal}</td>
      {!isReadOnly && onRemove && (
        <td style={cellStyle}>
          <button
            onClick={() => onRemove(index)}
            style={removeButtonStyle}
          >
            Remove
          </button>
        </td>
      )}
    </tr>
  );
};

export default POLineItemRow;
