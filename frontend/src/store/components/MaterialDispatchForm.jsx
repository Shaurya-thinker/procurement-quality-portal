import { useState, useEffect } from 'react';

export default function MaterialDispatchForm({ onSubmit, loading = false }) {
  const [dispatchNumber] = useState(() => {
    const timestamp = Date.now().toString().slice(-8);
    return `MD-${timestamp}`;
  });

  const [formData, setFormData] = useState({
    dispatch_date: new Date().toISOString().split('T')[0],
    dispatch_type: 'INTERNAL',
    store: '',
    department: '',
    vendor: '',
    project_site: '',
    issued_by: 'Current User', // TODO: Get from auth
    received_by: '',
    vehicle_number: '',
    gate_pass_number: '',
    remarks: '',
  });

  const [items, setItems] = useState([]);
  const [availableItems] = useState([
    { id: 1, code: 'ITM001', name: 'Steel Rod 12mm', unit: 'PCS', available: 100, rate: 50 },
    { id: 2, code: 'ITM002', name: 'Cement Bag', unit: 'BAG', available: 50, rate: 400 },
    { id: 3, code: 'ITM003', name: 'Paint Bucket', unit: 'LTR', available: 25, rate: 200 },
  ]);
  const [error, setError] = useState('');

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      id: Date.now(),
      item_code: '',
      item_name: '',
      unit: '',
      available_qty: 0,
      dispatch_qty: '',
      batch_lot: '',
      rate: '',
      line_value: 0,
    }]);
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        if (field === 'item_code') {
          const selectedItem = availableItems.find(ai => ai.code === value);
          if (selectedItem) {
            updated.item_name = selectedItem.name;
            updated.unit = selectedItem.unit;
            updated.available_qty = selectedItem.available;
            updated.rate = selectedItem.rate;
          }
        }
        
        if (field === 'dispatch_qty' || field === 'rate') {
          const qty = parseFloat(updated.dispatch_qty) || 0;
          const rate = parseFloat(updated.rate) || 0;
          updated.line_value = qty * rate;
        }
        
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const validateForm = () => {
    console.log('[VALIDATION] Form data:', formData);
    console.log('[VALIDATION] Items:', items);
    
    if (!formData.received_by.trim()) {
      setError('Received By is required');
      return false;
    }

    if (formData.dispatch_type === 'INTERNAL' && !formData.department.trim()) {
      setError('Department is required for Internal dispatch');
      return false;
    }

    if (formData.dispatch_type === 'EXTERNAL' && !formData.vendor.trim()) {
      setError('Vendor is required for External dispatch');
      return false;
    }

    if (items.length === 0) {
      setError('At least one item must be added');
      return false;
    }

    for (const item of items) {
      console.log('[VALIDATION] Checking item:', item);
      
      if (!item.item_code) {
        setError('All items must have an item code selected');
        return false;
      }
      
      const dispatchQty = parseFloat(item.dispatch_qty) || 0;
      if (dispatchQty <= 0) {
        setError(`Item ${item.item_code}: Dispatch quantity must be greater than 0`);
        return false;
      }
      
      if (dispatchQty > item.available_qty) {
        setError(`Item ${item.item_code}: Dispatch quantity cannot exceed available quantity`);
        return false;
      }
    }

    console.log('[VALIDATION] All checks passed');
    return true;
  };

  const handleSubmit = async (action) => {
    console.log('[SUBMIT] Action:', action);
    console.log('[SUBMIT] Form data:', formData);
    console.log('[SUBMIT] Items:', items);
    
    if (!validateForm()) {
      console.log('[SUBMIT] Validation failed');
      return;
    }

    const payload = {
      dispatch_number: dispatchNumber,
      dispatch_date: formData.dispatch_date,
      dispatch_type: formData.dispatch_type,
      store: formData.store || "",
      department: formData.department || "",
      vendor: formData.vendor || "",
      project_site: formData.project_site || "",
      issued_by: formData.issued_by,
      received_by: formData.received_by,
      vehicle_number: formData.vehicle_number || "",
      gate_pass_number: formData.gate_pass_number || "",
      remarks: formData.remarks || "",
      items: items.map(item => ({
        item_code: item.item_code,
        item_name: item.item_name,
        unit: item.unit,
        dispatch_qty: parseFloat(item.dispatch_qty),
        batch_lot: item.batch_lot || "",
        rate: parseFloat(item.rate) || 0,
        line_value: item.line_value || 0,
      })),
      action,
    };

    console.log('[SUBMIT] Final payload:', JSON.stringify(payload, null, 2));
    
    try {
      await onSubmit(payload);
      console.log('[SUBMIT] Success');
    } catch (error) {
      console.error('[SUBMIT] Error:', error);
      setError(error.message || 'Submit failed');
    }
  };

  const totalValue = items.reduce((sum, item) => sum + (item.line_value || 0), 0);

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      padding: '24px',
    },
    section: {
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e5e7eb',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '16px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      textTransform: 'uppercase',
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
    },
    readOnly: {
      backgroundColor: '#f3f4f6',
      cursor: 'not-allowed',
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
    },
    textarea: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '16px',
    },
    th: {
      padding: '12px 8px',
      textAlign: 'left',
      borderBottom: '2px solid #d1d5db',
      fontWeight: '600',
      fontSize: '12px',
      color: '#374151',
      backgroundColor: '#f9fafb',
    },
    td: {
      padding: '12px 8px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '13px',
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    removeButton: {
      padding: '4px 8px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '11px',
    },
    actions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px',
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    draftButton: {
      backgroundColor: '#6b7280',
      color: 'white',
    },
    issueButton: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#7f1d1d',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '16px',
      fontSize: '14px',
    },
    total: {
      fontWeight: '600',
      fontSize: '14px',
      textAlign: 'right',
      padding: '12px 8px',
      borderTop: '2px solid #d1d5db',
    },
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.error}>{error}</div>}

      {/* Header Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Dispatch Header</div>
        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Dispatch Number</label>
            <input
              type="text"
              value={dispatchNumber}
              readOnly
              style={{ ...styles.input, ...styles.readOnly }}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Dispatch Date</label>
            <input
              type="date"
              value={formData.dispatch_date}
              onChange={(e) => handleFormChange('dispatch_date', e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Dispatch Type</label>
            <select
              value={formData.dispatch_type}
              onChange={(e) => handleFormChange('dispatch_type', e.target.value)}
              style={styles.select}
            >
              <option value="INTERNAL">Internal</option>
              <option value="EXTERNAL">External</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Store</label>
            <input
              type="text"
              value={formData.store}
              onChange={(e) => handleFormChange('store', e.target.value)}
              style={styles.input}
              placeholder="Store name"
            />
          </div>

          {formData.dispatch_type === 'INTERNAL' && (
            <div style={styles.field}>
              <label style={styles.label}>Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleFormChange('department', e.target.value)}
                style={styles.input}
                placeholder="Department name"
              />
            </div>
          )}

          {formData.dispatch_type === 'EXTERNAL' && (
            <div style={styles.field}>
              <label style={styles.label}>Vendor *</label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => handleFormChange('vendor', e.target.value)}
                style={styles.input}
                placeholder="Vendor name"
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Project / Site</label>
            <input
              type="text"
              value={formData.project_site}
              onChange={(e) => handleFormChange('project_site', e.target.value)}
              style={styles.input}
              placeholder="Project or site name"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Issued By</label>
            <input
              type="text"
              value={formData.issued_by}
              readOnly
              style={{ ...styles.input, ...styles.readOnly }}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Received By *</label>
            <input
              type="text"
              value={formData.received_by}
              onChange={(e) => handleFormChange('received_by', e.target.value)}
              style={styles.input}
              placeholder="Receiver name"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Vehicle Number</label>
            <input
              type="text"
              value={formData.vehicle_number}
              onChange={(e) => handleFormChange('vehicle_number', e.target.value)}
              style={styles.input}
              placeholder="Vehicle registration"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Gate Pass Number</label>
            <input
              type="text"
              value={formData.gate_pass_number}
              onChange={(e) => handleFormChange('gate_pass_number', e.target.value)}
              style={styles.input}
              placeholder="Gate pass reference"
            />
          </div>
        </div>

        <div style={{ ...styles.field, marginTop: '16px' }}>
          <label style={styles.label}>Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleFormChange('remarks', e.target.value)}
            style={styles.textarea}
            placeholder="Additional notes or remarks"
          />
        </div>
      </div>

      {/* Items Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Dispatch Items</div>
        <button onClick={addItem} style={styles.addButton} disabled={loading}>
          + Add Item
        </button>

        {items.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item Code</th>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Available</th>
                <th style={styles.th}>Dispatch Qty</th>
                <th style={styles.th}>Batch/Lot</th>
                <th style={styles.th}>Rate</th>
                <th style={styles.th}>Line Value</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>
                    <select
                      value={item.item_code}
                      onChange={(e) => updateItem(item.id, 'item_code', e.target.value)}
                      style={{ ...styles.select, width: '120px' }}
                      disabled={loading}
                    >
                      <option value="">Select...</option>
                      {availableItems.map(ai => (
                        <option key={ai.id} value={ai.code}>{ai.code}</option>
                      ))}
                    </select>
                  </td>
                  <td style={styles.td}>{item.item_name || '-'}</td>
                  <td style={styles.td}>{item.unit || '-'}</td>
                  <td style={styles.td}>{item.available_qty || 0}</td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={item.dispatch_qty}
                      onChange={(e) => updateItem(item.id, 'dispatch_qty', e.target.value)}
                      style={{ ...styles.input, width: '80px' }}
                      min="0"
                      max={item.available_qty}
                      disabled={loading}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      type="text"
                      value={item.batch_lot}
                      onChange={(e) => updateItem(item.id, 'batch_lot', e.target.value)}
                      style={{ ...styles.input, width: '100px' }}
                      disabled={loading}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                      style={{ ...styles.input, width: '80px' }}
                      min="0"
                      step="0.01"
                      disabled={loading}
                    />
                  </td>
                  <td style={styles.td}>{item.line_value?.toFixed(2) || '0.00'}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={styles.removeButton}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="7" style={styles.total}>Total Value:</td>
                <td style={styles.total}>{totalValue.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          onClick={() => window.history.back()}
          style={{ ...styles.button, ...styles.cancelButton }}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubmit('DRAFT')}
          style={{ ...styles.button, ...styles.draftButton }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          onClick={() => handleSubmit('ISSUE')}
          style={{ ...styles.button, ...styles.issueButton }}
          disabled={loading}
        >
          {loading ? 'Issuing...' : 'Issue Dispatch'}
        </button>
      </div>
    </div>
  );
}