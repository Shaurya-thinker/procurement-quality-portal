import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MaterialDispatchForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Dispatch Header
    dispatch_date: new Date().toISOString().split('T')[0],
    reference_type: 'PO',
    reference_id: '',
    warehouse_id: '',
    created_by: '',
    remarks: '',
    
    // Receiver & Transport
    receiver_name: '',
    receiver_contact: '',
    delivery_address: '',
    vehicle_number: '',
    driver_name: '',
    driver_contact: '',
    eway_bill_number: '',
    
    // Line Items
    line_items: [{
      item_id: '',
      item_code: '',
      item_name: '',
      quantity_dispatched: '',
      uom: '',
      batch_number: '',
      remarks: ''
    }]
  });

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.reference_id) newErrors.reference_id = 'Reference ID is required';
    if (!formData.warehouse_id) newErrors.warehouse_id = 'Warehouse ID is required';
    if (!formData.created_by) newErrors.created_by = 'Created By is required';
    if (!formData.receiver_name) newErrors.receiver_name = 'Receiver Name is required';
    if (!formData.receiver_contact) newErrors.receiver_contact = 'Receiver Contact is required';
    if (!formData.delivery_address) newErrors.delivery_address = 'Delivery Address is required';
    if (!formData.vehicle_number) newErrors.vehicle_number = 'Vehicle Number is required';
    if (!formData.driver_name) newErrors.driver_name = 'Driver Name is required';
    if (!formData.driver_contact) newErrors.driver_contact = 'Driver Contact is required';
    
    // Line items validation (coerce numeric strings to numbers)
    formData.line_items.forEach((item, index) => {
      const itemId = item.item_id === '' ? null : Number(item.item_id);
      const qty = item.quantity_dispatched === '' ? NaN : Number(item.quantity_dispatched);

      if (!itemId || itemId <= 0) newErrors[`line_items.${index}.item_id`] = 'Item ID is required';
      if (!item.item_code) newErrors[`line_items.${index}.item_code`] = 'Item Code is required';
      if (!item.item_name) newErrors[`line_items.${index}.item_name`] = 'Item Name is required';
      if (isNaN(qty) || qty <= 0) {
        newErrors[`line_items.${index}.quantity_dispatched`] = 'Valid quantity is required';
      }
      if (!item.uom) newErrors[`line_items.${index}.uom`] = 'UOM is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Build a payload with proper types for validation and sending
    const payload = {
      ...formData,
      dispatch_date: new Date(formData.dispatch_date).toISOString(),
      warehouse_id: formData.warehouse_id === '' ? null : Number(formData.warehouse_id),
      line_items: formData.line_items.map(item => ({
        ...item,
        item_id: item.item_id === '' ? null : Number(item.item_id),
        quantity_dispatched: item.quantity_dispatched === '' ? null : Number(item.quantity_dispatched)
      }))
    };

    // Use payload values for validation so numeric strings are handled
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('[DEBUG] Sending payload to backend:', payload);
      const response = await fetch('http://localhost:8000/api/v1/store/material-dispatch/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Material Dispatch created successfully! Dispatch Number: ${result.dispatch_number}`);
        navigate('/store/dispatches');
      } else {
        const error = await response.json().catch(() => ({}));
        // If backend returned pydantic validation errors (422), map them to inline errors
        if (error.detail && Array.isArray(error.detail)) {
          const mapped = {};
          error.detail.forEach(err => {
            // err.loc example: ["body", "line_items", 0, "item_id"] or ["body", "reference_id"]
            const loc = err.loc || [];
            if (loc.length >= 2 && loc[0] === 'body') {
              // Build a key similar to frontend errors
              const keyParts = loc.slice(1).map(p => (typeof p === 'number' ? p : p));
              // Example mapping: ['line_items', 0, 'item_id'] => line_items.0.item_id
              const key = keyParts.join('.')
                .replace(/\.(\d+)\./g, (m, p1) => `.${p1}.`);
              // Normalize to our key format: line_items.0.item_id
              mapped[key] = err.msg || err.type || 'Field required';
            }
          });
          setErrors(mapped);
        }
        alert(`Error: ${error.detail || error.message || 'Failed to create dispatch'}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      line_items: [...formData.line_items, {
        item_id: '',
        item_code: '',
        item_name: '',
        quantity_dispatched: '',
        uom: '',
        batch_number: '',
        remarks: ''
      }]
    });
  };

  const removeLineItem = (index) => {
    if (formData.line_items.length > 1) {
      const newLineItems = formData.line_items.filter((_, i) => i !== index);
      setFormData({ ...formData, line_items: newLineItems });
    }
  };

  const updateLineItem = (index, field, value) => {
    const newLineItems = [...formData.line_items];
    newLineItems[index][field] = value;
    setFormData({ ...formData, line_items: newLineItems });
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const errorStyle = {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px'
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
  <button
    onClick={() => navigate(-1)}
    className="back-arrow-btn"
    aria-label="Go back"
  >
    ←
  </button>

  <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
    Create Material Dispatch
  </h1>
</div>

      
      <form onSubmit={handleSubmit}>
        {/* Dispatch Header */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Dispatch Header</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Dispatch Date *</label>
              <input
                type="date"
                value={formData.dispatch_date}
                onChange={(e) => setFormData({ ...formData, dispatch_date: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Reference Type *</label>
              <select
                value={formData.reference_type}
                onChange={(e) => setFormData({ ...formData, reference_type: e.target.value })}
                style={inputStyle}
                required
              >
                <option value="PO">Purchase Order</option>
                <option value="SO">Sales Order</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Reference ID *</label>
              <input
                type="text"
                value={formData.reference_id}
                onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
                style={inputStyle}
                required
              />
              {errors.reference_id && <div style={errorStyle}>{errors.reference_id}</div>}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Warehouse ID *</label>
              <input
                type="number"
                value={formData.warehouse_id}
                onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                style={inputStyle}
                required
              />
              {errors.warehouse_id && <div style={errorStyle}>{errors.warehouse_id}</div>}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Created By *</label>
              <input
                type="text"
                value={formData.created_by}
                onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
                style={inputStyle}
                required
              />
              {errors.created_by && <div style={errorStyle}>{errors.created_by}</div>}
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Receiver & Transport */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Receiver & Transport</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Receiver Name *</label>
              <input
                type="text"
                value={formData.receiver_name}
                onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                style={inputStyle}
                required
              />
              {errors.receiver_name && <div style={errorStyle}>{errors.receiver_name}</div>}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Receiver Contact *</label>
              <input
                type="text"
                value={formData.receiver_contact}
                onChange={(e) => setFormData({ ...formData, receiver_contact: e.target.value })}
                style={inputStyle}
                required
              />
              {errors.receiver_contact && <div style={errorStyle}>{errors.receiver_contact}</div>}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Vehicle Number *</label>
              <input
                type="text"
                value={formData.vehicle_number}
                onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                style={inputStyle}
                required
              />
              {errors.vehicle_number && <div style={errorStyle}>{errors.vehicle_number}</div>}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Driver Name *</label>
              <input
                type="text"
                value={formData.driver_name}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                style={inputStyle}
                required
              />
              {errors.driver_name && <div style={errorStyle}>{errors.driver_name}</div>}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Driver Contact *</label>
              <input
                type="text"
                value={formData.driver_contact}
                onChange={(e) => setFormData({ ...formData, driver_contact: e.target.value })}
                style={inputStyle}
                required
              />
              {errors.driver_contact && <div style={errorStyle}>{errors.driver_contact}</div>}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>E-way Bill Number</label>
              <input
                type="text"
                value={formData.eway_bill_number}
                onChange={(e) => setFormData({ ...formData, eway_bill_number: e.target.value })}
                style={inputStyle}
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Delivery Address *</label>
              <textarea
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                rows={3}
                required
              />
              {errors.delivery_address && <div style={errorStyle}>{errors.delivery_address}</div>}
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: 0 }}>Line Items</h2>
            <button
              type="button"
              onClick={addLineItem}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              + Add Item
            </button>
          </div>
          
          {formData.line_items.map((item, index) => (
            <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>Item {index + 1}</h3>
                {formData.line_items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    style={{
                      padding: '4px 8px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Item ID *</label>
                  <input
                    type="number"
                    value={item.item_id}
                    onChange={(e) => updateLineItem(index, 'item_id', e.target.value)}
                    style={inputStyle}
                    required
                  />
                  {errors[`line_items.${index}.item_id`] && <div style={errorStyle}>{errors[`line_items.${index}.item_id`]}</div>}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Item Code *</label>
                  <input
                    type="text"
                    value={item.item_code}
                    onChange={(e) => updateLineItem(index, 'item_code', e.target.value)}
                    style={inputStyle}
                    required
                  />
                  {errors[`line_items.${index}.item_code`] && <div style={errorStyle}>{errors[`line_items.${index}.item_code`]}</div>}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Item Name *</label>
                  <input
                    type="text"
                    value={item.item_name}
                    onChange={(e) => updateLineItem(index, 'item_name', e.target.value)}
                    style={inputStyle}
                    required
                  />
                  {errors[`line_items.${index}.item_name`] && <div style={errorStyle}>{errors[`line_items.${index}.item_name`]}</div>}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Quantity *</label>
                  <input
                    type="number"
                    step="0.001"
                    value={item.quantity_dispatched}
                    onChange={(e) => updateLineItem(index, 'quantity_dispatched', e.target.value)}
                    style={inputStyle}
                    required
                  />
                  {errors[`line_items.${index}.quantity_dispatched`] && <div style={errorStyle}>{errors[`line_items.${index}.quantity_dispatched`]}</div>}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>UOM *</label>
                  <input
                    type="text"
                    value={item.uom}
                    onChange={(e) => updateLineItem(index, 'uom', e.target.value)}
                    style={inputStyle}
                    required
                  />
                  {errors[`line_items.${index}.uom`] && <div style={errorStyle}>{errors[`line_items.${index}.uom`]}</div>}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Batch Number</label>
                  <input
                    type="text"
                    value={item.batch_number}
                    onChange={(e) => updateLineItem(index, 'batch_number', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Remarks</label>
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => updateLineItem(index, 'remarks', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/store')}
            style={{
              padding: '12px 24px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Creating...' : 'Create Dispatch'}
          </button>
        </div>
      </form>
    </div>
  );
}