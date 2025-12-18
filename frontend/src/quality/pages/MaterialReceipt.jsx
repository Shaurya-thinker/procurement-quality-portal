import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuality } from '../hooks/useQuality';
import MRHeader from '../components/MRHeader';
import MRLineItemTable from '../components/MRLineItemTable';

export default function MaterialReceipt() {
  const navigate = useNavigate();
  const { createMaterialReceipt, loading, error, clearError } = useQuality();

  const [mrData, setMrData] = useState({
    mr_number: '',
    po_number: '',
    vendor_name: '',
    vendor_address: '',
    date_of_receipt: '',
    vehicle_number: '',
    challan_invoice_number: '',
  });

  const [lineItems, setLineItems] = useState([]);

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1E293B',
    lineHeight: '1.3',
  };

  const lineItemsSectionStyle = {
    marginBottom: '24px',
  };

  const sectionTitleStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '16px',
  };

  const addItemButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#15803D',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '16px',
    transition: 'background-color 0.15s',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    justifyContent: 'flex-end',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#1F3A5F',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background-color 0.15s',
  };

  const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#64748B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background-color 0.15s',
  };

  const errorAlertStyle = {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '500',
  };

  const closeErrorStyle = {
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const handleAddItem = () => {
    setLineItems([
      ...lineItems,
      {
        item_code: '',
        description: '',
        unit: '',
        ordered_quantity: '',
        received_quantity: '',
      },
    ]);
  };

  const handleSaveReceipt = async () => {
    if (!mrData.po_number || !mrData.vendor_name || lineItems.length === 0) {
      alert('Please fill in all required fields and add at least one line item');
      return;
    }

    try {
      const payload = {
        ...mrData,
        line_items: lineItems,
      };

      const result = await createMaterialReceipt(payload);
      
      // Navigate to inspection with the MR number
      if (result && result.mr_number) {
        navigate(`/quality/inspection/${result.mr_number}`, {
          state: { mrData: result },
        });
      } else {
        alert('Material Receipt created successfully');
      }
    } catch (err) {
      console.error('Error creating material receipt:', err);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Material Receipt</h1>

      {error && (
        <div style={errorAlertStyle}>
          <span>{error}</span>
          <span style={closeErrorStyle} onClick={clearError}>✕</span>
        </div>
      )}

      <MRHeader mrData={mrData} onChange={setMrData} isReadOnly={false} />

      <div style={lineItemsSectionStyle}>
        <h2 style={sectionTitleStyle}>Line Items</h2>
        <button onClick={handleAddItem} style={addItemButtonStyle}>
          + Add Item
        </button>
        <MRLineItemTable items={lineItems} onChange={setLineItems} isReadOnly={false} />
      </div>

      <div style={actionButtonsStyle}>
        <button onClick={() => navigate('/procurement')} style={cancelButtonStyle}>
          Cancel
        </button>
        <button
          onClick={handleSaveReceipt}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save & Proceed to Inspection'}
        </button>
      </div>
    </div>
  );
}
