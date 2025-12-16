export default function StockSummary({ items = [] }) {
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
  };

  const descriptionStyle = {
    fontSize: '13px',
    color: '#6b7280',
  };

  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity_available || 0), 0);
  const locations = new Set(items.map(item => item.location).filter(Boolean)).size;

  const lowStockItems = items.filter(item => (item.quantity_available || 0) <= 5).length;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={labelStyle}>Total Items</div>
        <div style={valueStyle}>{totalItems}</div>
        <div style={descriptionStyle}>In inventory</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>Total Quantity</div>
        <div style={valueStyle}>{totalQuantity}</div>
        <div style={descriptionStyle}>Units available</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>Storage Locations</div>
        <div style={valueStyle}>{locations}</div>
        <div style={descriptionStyle}>Active locations</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>Low Stock Items</div>
        <div style={{ ...valueStyle, color: lowStockItems > 0 ? '#ef4444' : '#10b981' }}>
          {lowStockItems}
        </div>
        <div style={descriptionStyle}>≤ 5 units</div>
      </div>
    </div>
  );
}
