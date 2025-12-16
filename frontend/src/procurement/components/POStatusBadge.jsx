const POStatusBadge = ({ status }) => {
  const statusStyles = {
    DRAFT: {
      backgroundColor: '#fbbf24',
      color: '#78350f',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block',
    },
    SENT: {
      backgroundColor: '#86efac',
      color: '#15803d',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block',
    },
  };

  const style = statusStyles[status] || statusStyles.DRAFT;

  return <span style={style}>{status}</span>;
};

export default POStatusBadge;
