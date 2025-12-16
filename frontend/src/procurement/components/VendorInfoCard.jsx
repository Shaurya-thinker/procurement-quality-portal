const VendorInfoCard = ({ vendor }) => {
  const containerStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#f9fafb',
  };

  const headingStyle = {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const infoStyle = {
    fontSize: '14px',
    marginBottom: '8px',
    color: '#1f2937',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#4b5563',
    marginRight: '4px',
  };

  if (!vendor) {
    return <div style={containerStyle}>No vendor information available</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Vendor Information</div>
      {vendor.name && (
        <div style={infoStyle}>
          <span style={labelStyle}>Name:</span>
          {vendor.name}
        </div>
      )}
      {vendor.address && (
        <div style={infoStyle}>
          <span style={labelStyle}>Address:</span>
          {vendor.address}
        </div>
      )}
      {vendor.gst && (
        <div style={infoStyle}>
          <span style={labelStyle}>GST:</span>
          {vendor.gst}
        </div>
      )}
      {vendor.contact && (
        <div style={infoStyle}>
          <span style={labelStyle}>Contact:</span>
          {vendor.contact}
        </div>
      )}
    </div>
  );
};

export default VendorInfoCard;
