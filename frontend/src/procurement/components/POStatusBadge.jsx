const getStatusStyle = (status) => {
  let color = '#1f2937';
  let background = '#e5e7eb';

  switch (status) {
    case 'DRAFT':
      color = '#1d4ed8';
      background = '#dbeafe';
      break;

    case 'SENT':
      color = '#065f46';
      background = '#d1fae5';
      break;

    case 'CANCELLED':
      color = '#7f1d1d';
      background = '#fee2e2';
      break;

    default:
      break;
  }

  return { color, background };
};

const POStatusBadge = ({ status }) => {
  const { color, background } = getStatusStyle(status);

  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '600',
        color,
        backgroundColor: background,
        display: 'inline-block',
        textTransform: 'uppercase',
      }}
    >
      {status}
    </span>
  );
};

export default POStatusBadge;
