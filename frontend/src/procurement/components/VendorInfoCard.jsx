const VendorInfoCard = ({ vendor }) => {
  if (!vendor) return null;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#f9fafb',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Vendor Information
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Name:</strong> {vendor.name || 'Unknown Vendor'}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Contact:</strong> {vendor.contact || '-'}
      </div>

      <div>
        <strong>Status:</strong> {vendor.status || 'ACTIVE'}
      </div>
    </div>
  );
};

export default VendorInfoCard;
