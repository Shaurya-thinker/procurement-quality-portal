import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProcurement } from '../hooks/useProcurement';
import POLineItemRow from '../components/POLineItemRow';
import VendorInfoCard from '../components/VendorInfoCard';
import POStatusBadge from '../components/POStatusBadge';
import { getItems } from '../../api/procurement.api';

const CreatePO = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    createProcurementOrder, 
    fetchPODetails, 
    updateProcurementOrder, 
    loading, 
    error 
  } = useProcurement();

  const [poNumber, setPoNumber] = useState('');
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendorId, setVendorId] = useState('');
  const [vendorInfo, setVendorInfo] = useState(null);
  const [status, setStatus] = useState('DRAFT');
  const [lineItems, setLineItems] = useState([
    { item_id: null, item_code: '', item_description: '', unit: '', quantity: '', rate: '' }
  ]);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(!!id);
  const [items, setItems] = useState([]);


  useEffect(() => {
  getItems().then(res => setItems(res.data));
}, []);


  useEffect(() => {
    if (id) {
      loadPOForEditing();
    }
  }, [id]);

  const loadPOForEditing = async () => {
    try {
      const data = await fetchPODetails(id);
      setPoNumber(data.po_number || '');
      setPoDate(data.po_date || new Date().toISOString().split('T')[0]);
      setVendorId(String(data.vendor_id ?? ''));
      setStatus(String(data.status).toUpperCase());
      setLineItems(
        (data.line_items || []).map(item => ({
          item_id: item.item_id ?? '',
          item_description: item.item_description ?? '',
          unit: item.unit ?? '',
          quantity: item.quantity ?? '',
          rate: item.rate ?? '',
        }))
      );

      if (!data.line_items || data.line_items.length === 0) {
  setLineItems([{ item_id: '', item_description: '', unit: '', quantity: '', rate: '' }]);}

      setVendorInfo(data.vendor || null);
    } catch (err) {
      setSubmitError('Failed to load PO for editing');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!String(vendorId).trim()) {
      errors.vendorId = 'Vendor is required';
    }

    const validItems = lineItems.filter(item => item.item_id);


    if (validItems.length === 0) {
      errors.lineItems = 'At least one line item is required';
    }

    validItems.forEach((item, idx) => {
      if (!item.item_id) {
        errors[`item_${idx}_id`] = 'Item is required';
      }

      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        errors[`item_${idx}_qty`] = 'Quantity must be greater than 0';
      }
      if (!item.rate || parseFloat(item.rate) <= 0) {
        errors[`item_${idx}_rate`] = 'Rate must be greater than 0';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLineItemChange = (index, updatedItem) => {
    const newItems = [...lineItems];
    newItems[index] = updatedItem;
    setLineItems(newItems);
  };

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { item_id: '', item_description: '', unit: '', quantity: '', rate: '' }
    ]);
  };

  const handleRemoveLineItem = (index) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => {
      if (item.quantity && item.rate) {
        return sum + (parseFloat(item.quantity) * parseFloat(item.rate));
      }
      return sum;
    }, 0).toFixed(2);
  };

  const handleSaveAsDraft = async () => {
    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      const validItems = lineItems.filter(item => item.item_id);


      const poData = {
        vendor_id: parseInt(vendorId),
        lines: validItems.map(item => ({
          item_id: Number(item.item_id),
          quantity: Math.floor(Number(item.quantity)), // 👈 FIX
          price: Number(item.rate)
        }))

      };

      const result = await createProcurementOrder(poData);
      setSuccessMessage('PO saved as draft successfully');
      setTimeout(() => {
        navigate(`/procurement/${result.id}`);
      }, 1500);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to save PO');
    }
  };

  const handleUpdateDraft = async () => {
    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      const validItems = lineItems.filter(item => item.item_id);


      const poData = {
        vendor_id: parseInt(vendorId),
        lines: validItems.map(item => ({
          item_id: Number(item.item_id),
          quantity: Math.floor(Number(item.quantity)),
          price: Number(item.rate),
        })),
      };


      await updateProcurementOrder(id, poData);
      setSuccessMessage('PO updated successfully');
      setTimeout(() => {
        navigate(`/procurement/${id}`);
      }, 1500);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to update PO');
    }
  };

  const isReadOnly = String(status).toUpperCase() !== 'DRAFT';
  const subtotal = calculateSubtotal();
  const total = subtotal;

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1f2937',
  };

  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const formGroupStyle = {
    marginBottom: '16px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
    color: '#374151',
  };

  const inputStyle = {
    padding: '8px 12px',
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

  const errorMessageStyle = {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px',
  };

  const successMessageStyle = {
    color: '#16a34a',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#dcfce7',
    borderRadius: '4px',
    marginBottom: '16px',
  };

  const errorAlertStyle = {
    color: '#7f1d1d',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#fee2e2',
    borderRadius: '4px',
    marginBottom: '16px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '16px',
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #d1d5db',
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#f9fafb',
  };

  const tbodyTrStyle = {
    borderBottom: '1px solid #e5e7eb',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const secondaryButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const summaryRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    padding: '16px 0',
    borderTop: '1px solid #d1d5db',
    marginTop: '16px',
  };

  const summaryItemStyle = {
    textAlign: 'right',
  };

  const summaryLabelStyle = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const summaryValueStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  };

  console.log("STATUS =", status, "READONLY =", isReadOnly);

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>
        {isEditing ? `Edit Purchase Order` : 'Create Purchase Order'}
      </h1>

      {successMessage && (
        <div style={successMessageStyle}>{successMessage}</div>
      )}

      {(submitError || error) && (
        <div style={errorAlertStyle}>{submitError || error}</div>
      )}

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>PO Header</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>PO Number</label>
            <input
              type="text"
              value={poNumber}
              disabled
              style={readOnlyInputStyle}
              placeholder="Auto-generated"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>PO Date</label>
            <input
              type="date"
              value={poDate}
              onChange={(e) => setPoDate(e.target.value)}
              disabled={isReadOnly}
              style={isReadOnly ? readOnlyInputStyle : inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Status</label>
            <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', padding: '8px' }}>
              <POStatusBadge status={status} />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Vendor ID {validationErrors.vendorId && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            <input
              type="text"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              disabled={isReadOnly}
              style={isReadOnly ? readOnlyInputStyle : inputStyle}
              placeholder="Enter vendor ID"
            />
            {validationErrors.vendorId && (
              <div style={errorMessageStyle}>{validationErrors.vendorId}</div>
            )}
          </div>
        </div>

        {vendorInfo && <VendorInfoCard vendor={vendorInfo} />}
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Line Items</div>

        {validationErrors.lineItems && (
          <div style={errorMessageStyle}>{validationErrors.lineItems}</div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Item Code</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Unit</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Rate</th>
                <th style={thStyle}>Line Total</th>
                {!isReadOnly && <th style={thStyle}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <POLineItemRow
                  key={index}
                  index={index}
                  item={item}
                  items={items}
                  onChange={handleLineItemChange}
                  onRemove={handleRemoveLineItem}
                  isReadOnly={isReadOnly}
                />
              ))}
            </tbody>
          </table>
        </div>

        {!isReadOnly && (
          <button
            onClick={handleAddLineItem}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Add Line Item
          </button>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Summary</div>
        <div style={summaryRowStyle}>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Subtotal</div>
            <div style={summaryValueStyle}>₹ {parseFloat(subtotal).toFixed(2)}</div>
          </div>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Tax</div>
            <div style={summaryValueStyle}>₹ 0.00</div>
          </div>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Grand Total</div>
            <div style={{ ...summaryValueStyle, fontSize: '18px' }}>
              ₹ {parseFloat(total).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div style={buttonGroupStyle}>
        <button
          onClick={isEditing ? handleUpdateDraft : handleSaveAsDraft}
          disabled={loading || isReadOnly}
          style={{
            ...primaryButtonStyle,
            opacity: loading || isReadOnly ? 0.6 : 1,
            cursor: loading || isReadOnly ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving...' : isEditing ? 'Update Draft' : 'Save as Draft'}
        </button>

        <button
          onClick={() => navigate('/procurement')}
          style={secondaryButtonStyle}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreatePO;
