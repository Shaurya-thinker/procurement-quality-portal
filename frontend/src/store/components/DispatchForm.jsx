import { useState, useMemo } from 'react';

export default function DispatchForm({ availableInventory = [], onSubmit, loading = false }) {
  const [dispatchSlipNo] = useState(() => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `DS-${timestamp}-${random}`;
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    requested_by: '',
    purpose_reference: '',
  });

  const [dispatchItems, setDispatchItems] = useState([]);
  const [error, setError] = useState('');

  const containerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  };

  const sectionStyle = {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  };

  const sectionTitleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputStyle = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
  };

  const readOnlyInputStyle = {
    ...inputStyle,
    backgroundColor: '#f3f4f6',
    cursor: 'not-allowed',
  };

  const textareaStyle = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    minHeight: '80px',
    resize: 'vertical',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    padding: '10px 12px',
    textAlign: 'left',
    borderBottom: '2px solid #d1d5db',
    fontWeight: '600',
    fontSize: '12px',
    color: '#374151',
    backgroundColor: '#f9fafb',
  };

  const tdStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '13px',
    color: '#1f2937',
  };

  const addButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '16px',
  };

  const removeButtonStyle = {
    padding: '4px 8px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '500',
  };

  const selectStyle = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  };

  const quantityInputStyle = {
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'inherit',
    width: '100%',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const errorAlertStyle = {
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
    padding: '10px 12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '13px',
  };

  const emptyStateStyle = {
    padding: '20px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '13px',
  };

  const totalStyle = {
    paddingTop: '12px',
    borderTop: '2px solid #d1d5db',
    fontWeight: '600',
    color: '#1f2937',
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddItem = () => {
    if (availableInventory.length === 0) {
      setError('No inventory items available to dispatch');
      return;
    }
    setDispatchItems(prev => [
      ...prev,
      {
        item_id: '',
        issue_quantity: '',
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = dispatchItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setDispatchItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    setDispatchItems(prev => prev.filter((_, i) => i !== index));
  };

  const getInventoryItem = (itemId) => {
    return availableInventory.find(inv => inv.id === itemId);
  };

  const validateForm = () => {
    setError('');

    if (!formData.requested_by?.trim()) {
      setError('Requested by is required');
      return false;
    }

    if (dispatchItems.length === 0) {
      setError('At least one item must be added for dispatch');
      return false;
    }

    // Only validate the first item since we're using single-item dispatch
    const item = dispatchItems[0];
    if (!item.item_id) {
      setError('Please select an item to dispatch');
      return false;
    }

    const inventoryItem = getInventoryItem(item.item_id);
    const issueQuantity = parseInt(item.issue_quantity) || 0;

    if (issueQuantity <= 0) {
      setError('Issue quantity must be greater than 0');
      return false;
    }

    if (issueQuantity > (inventoryItem?.quantity_available || 0)) {
      setError(`Issue quantity cannot exceed available quantity (${inventoryItem?.quantity_available})`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      inventory_item_id: parseInt(dispatchItems[0].item_id),
      quantity: parseInt(dispatchItems[0].issue_quantity),
      requested_by: formData.requested_by,
      reference: formData.purpose_reference || null,
    };

    console.log('[DISPATCH FORM] Submitting payload:', payload);
    
    try {
      await onSubmit(payload);
      console.log('[DISPATCH FORM] Submit successful');
    } catch (error) {
      console.error('[DISPATCH FORM] Submit failed:', error);
      setError(error.message || 'Dispatch creation failed');
    }
  };

  const totalIssueQuantity = useMemo(() => {
    return dispatchItems.reduce((sum, item) => {
      return sum + (parseInt(item.issue_quantity) || 0);
    }, 0);
  }, [dispatchItems]);

  return (
    <div style={containerStyle}>
      {error && <div style={errorAlertStyle}>{error}</div>}

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Dispatch Details</div>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Dispatch Slip No</label>
            <input
              type="text"
              value={dispatchSlipNo}
              disabled
              style={readOnlyInputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleFormChange('date', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Requested By</label>
            <input
              type="text"
              value={formData.requested_by}
              onChange={(e) => handleFormChange('requested_by', e.target.value)}
              style={inputStyle}
              placeholder="Name of requestor"
            />
          </div>
        </div>

        <div style={{ ...fieldStyle, marginTop: '16px' }}>
          <label style={labelStyle}>Purpose / Reference</label>
          <textarea
            value={formData.purpose_reference}
            onChange={(e) => handleFormChange('purpose_reference', e.target.value)}
            style={textareaStyle}
            placeholder="Reason for dispatch or reference number"
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Items to Dispatch</div>
        <button onClick={handleAddItem} style={addButtonStyle} disabled={loading}>
          + Add Item
        </button>

        {dispatchItems.length === 0 ? (
          <div style={emptyStateStyle}>
            No items added. Click "Add Item" to start.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Item Code</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Available Qty</th>
                  <th style={thStyle}>Issue Qty</th>
                  <th style={thStyle}>Balance Qty</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dispatchItems.map((item, index) => {
                  const selectedInv = getInventoryItem(item.item_id);
                  const issueQty = parseInt(item.issue_quantity) || 0;
                  const availableQty = selectedInv?.quantity_available || 0;
                  const balanceQty = availableQty - issueQty;

                  return (
                    <tr key={index}>
                      <td style={tdStyle}>
                        <select
                          value={item.item_id}
                          onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                          style={selectStyle}
                          disabled={loading}
                        >
                          <option value="">Select item...</option>
                          {availableInventory.map(inv => (
                            <option key={inv.id} value={inv.id}>
                              {inv.item_code}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={tdStyle}>
                        {selectedInv?.item_name || '-'}
                      </td>
                      <td style={tdStyle}>
                        {selectedInv?.location || '-'}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: '500' }}>
                          {selectedInv?.quantity_available || 0}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={item.issue_quantity}
                          onChange={(e) => handleItemChange(index, 'issue_quantity', e.target.value)}
                          style={quantityInputStyle}
                          min="0"
                          max={selectedInv?.quantity_available || 0}
                          placeholder="0"
                          disabled={loading}
                        />
                      </td>
                      <td style={{ ...tdStyle, fontWeight: '500' }}>
                        {balanceQty >= 0 ? balanceQty : '-'}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          style={removeButtonStyle}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="4" style={tdStyle}></td>
                  <td style={{ ...tdStyle, ...totalStyle }}>
                    {totalIssueQuantity}
                  </td>
                  <td style={tdStyle}></td>
                  <td style={tdStyle}></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={actionButtonsStyle}>
        <button onClick={() => window.history.back()} style={cancelButtonStyle} disabled={loading}>
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Dispatching...' : 'Submit Dispatch'}
        </button>
      </div>
    </div>
  );
}
