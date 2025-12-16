export default function MRHeader({ mrData, onChange, isReadOnly = false }) {
  const containerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    marginBottom: '24px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
    backgroundColor: isReadOnly ? '#f3f4f6' : '#ffffff',
    color: '#1f2937',
    cursor: isReadOnly ? 'not-allowed' : 'text',
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
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Material Receipt Details</h2>
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
