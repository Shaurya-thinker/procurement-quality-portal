import { useState } from 'react';

export default function GatePassReceiveCard({ gatePassData, onReceive, loading = false }) {
  const [selectedItems, setSelectedItems] = useState(
    (gatePassData?.items || []).reduce((acc, item, index) => {
      acc[index] = { ...item, store_location: '' };
      return acc;
    }, {})
  );

  const [error, setError] = useState('');

  const containerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '2px solid #10b981',
    padding: '24px',
    marginBottom: '24px',
  };

  const headerStyle = {
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '16px',
    marginBottom: '20px',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px',
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
  };

  const infoFieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
  };

  const itemsTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
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

  const inputStyle = {
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'inherit',
    width: '100%',
    backgroundColor: '#ffffff',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
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

  const handleLocationChange = (index, location) => {
    setSelectedItems(prev => ({
      ...prev,
      [index]: { ...prev[index], store_location: location },
    }));
  };

  const validateBeforeReceive = () => {
    setError('');

    const items = Object.values(selectedItems);
    for (let item of items) {
      if (!item.store_location?.trim()) {
        setError('All items must have a store location assigned');
        return false;
      }
    }

    return true;
  };

  const handleReceive = async () => {
    if (!validateBeforeReceive()) {
      return;
    }

    const itemsToReceive = Object.values(selectedItems).map(item => ({
      item_code: item.item_code,
      item_name: item.description,
      quantity: item.accepted_quantity,
      location: item.store_location,
      gate_pass_number: gatePassData?.gate_pass_number,
      mr_number: gatePassData?.mr_number,
    }));

    onReceive(itemsToReceive);
  };

  if (!gatePassData) {
    return null;
  }

  const items = gatePassData.items || [];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          Receive Gate Pass Items
          <span style={{ ...badgeStyle, marginLeft: '12px' }}>
            {items.length} items
          </span>
        </div>
      </div>

      <div style={infoGridStyle}>
        <div style={infoFieldStyle}>
          <div style={labelStyle}>Gate Pass Number</div>
          <div style={valueStyle}>{gatePassData.gate_pass_number}</div>
        </div>
        <div style={infoFieldStyle}>
          <div style={labelStyle}>MR Number</div>
          <div style={valueStyle}>{gatePassData.mr_number}</div>
        </div>
        <div style={infoFieldStyle}>
          <div style={labelStyle}>PO Number</div>
          <div style={valueStyle}>{gatePassData.po_number}</div>
        </div>
        <div style={infoFieldStyle}>
          <div style={labelStyle}>Vendor</div>
          <div style={valueStyle}>{gatePassData.vendor_name}</div>
        </div>
      </div>

      {error && <div style={errorAlertStyle}>{error}</div>}

      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={itemsTableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Item Code</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Store Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.item_code || '-'}</td>
                <td style={tdStyle}>{item.description || '-'}</td>
                <td style={tdStyle}>{item.accepted_quantity || 0}</td>
                <td style={tdStyle}>
                  <input
                    type="text"
                    value={selectedItems[index]?.store_location || ''}
                    onChange={(e) => handleLocationChange(index, e.target.value)}
                    style={inputStyle}
                    placeholder="e.g., Shelf A-01, Rack B-02"
                    disabled={loading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={actionButtonsStyle}>
        <button
          onClick={() => window.history.back()}
          style={cancelButtonStyle}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleReceive}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Receiving...' : '✓ Receive Items'}
        </button>
      </div>
    </div>
  );
}
