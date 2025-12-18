export default function MRHeader({ mrData, onChange, isReadOnly = false }) {
  const containerStyle = {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f1f5f9',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: '1.4',
  };

  const inputStyle = {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: isReadOnly ? '#f8fafc' : 'white',
    color: '#1e293b',
    cursor: isReadOnly ? 'not-allowed' : 'text',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  };

  const handleChange = (field, value) => {
    if (!isReadOnly && onChange) {
      onChange({
        ...mrData,
        [field]: value,
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={{ fontSize: '24px' }}>📋</span>
        <h2 style={titleStyle}>Material Receipt Details</h2>
      </div>
      <div style={gridStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>MR Number</label>
          <input
            type="text"
            value={mrData.mr_number || ''}
            onChange={(e) => handleChange('mr_number', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
            placeholder="Auto-generated"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>PO Number</label>
          <input
            type="text"
            value={mrData.po_number || ''}
            onChange={(e) => handleChange('po_number', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Vendor Name</label>
          <input
            type="text"
            value={mrData.vendor_name || ''}
            onChange={(e) => handleChange('vendor_name', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Vendor Address</label>
          <input
            type="text"
            value={mrData.vendor_address || ''}
            onChange={(e) => handleChange('vendor_address', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Date of Receipt</label>
          <input
            type="date"
            value={mrData.date_of_receipt || ''}
            onChange={(e) => handleChange('date_of_receipt', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Vehicle Number</label>
          <input
            type="text"
            value={mrData.vehicle_number || ''}
            onChange={(e) => handleChange('vehicle_number', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Challan / Invoice Number</label>
          <input
            type="text"
            value={mrData.challan_invoice_number || ''}
            onChange={(e) => handleChange('challan_invoice_number', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}
