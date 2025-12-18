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
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1e293b',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
    fontWeight: '500',
  };

  const lineItemsSectionStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
  };

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f1f5f9',
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  };

  const addItemButtonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const footerStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
  };

  const buttonStyle = {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
  };

  const cancelButtonStyle = {
    padding: '12px 32px',
    background: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  };

  const errorAlertStyle = {
    background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
    color: '#dc2626',
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #f87171',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
  };

  const closeErrorStyle = {
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
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
      <div>
        <h1 style={headingStyle}>Material Receipt</h1>
        <p style={subtitleStyle}>Record incoming materials and prepare for quality inspection</p>
      </div>

      {error && (
        <div style={errorAlertStyle}>
          <span>{error}</span>
          <span style={closeErrorStyle} onClick={clearError}>✕</span>
        </div>
      )}

      <MRHeader mrData={mrData} onChange={setMrData} isReadOnly={false} />

      <div style={lineItemsSectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Line Items</h2>
          <button 
            onClick={handleAddItem} 
            className="btn-success"
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
            Add Item
          </button>
        </div>
        <MRLineItemTable items={lineItems} onChange={setLineItems} isReadOnly={false} />
      </div>

      <div style={footerStyle}>
        <div style={actionButtonsStyle}>
          <button 
            onClick={() => navigate('/procurement')} 
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveReceipt}
            className="btn-primary"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving...' : 'Save & Proceed to Inspection'}
          </button>
        </div>
      </div>
    </div>
  );
}
