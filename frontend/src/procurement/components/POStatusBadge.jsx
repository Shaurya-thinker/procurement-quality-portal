const POStatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'DRAFT':
        return 'status-badge draft';
      case 'SENT':
        return 'status-badge sent';
      default:
        return 'status-badge draft';
    }
  };

  return <span className={getStatusClass(status)}>{status}</span>;
};

export default POStatusBadge;
