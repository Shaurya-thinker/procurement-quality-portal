const getStatusStyle = (status) => {
  let color = '#1f2937';
  let background = '#e5e7eb';

  switch (status) {
    case 'NOT_STARTED':
      color = '#374151';
      background = '#f3f4f6';
      break;

    case 'IN_PROGRESS':
      color = '#92400e';
      background = '#fef3c7';
      break;

    case 'COMPLETED':
      color = '#065f46';
      background = '#d1fae5';
      break;

    case 'ABSENT':
      color = '#7f1d1d';
      background = '#fee2e2';
      break;

    default:
      break;
  }

  return { color, background };
};

const AttendanceStatusBadge = ({ status }) => {
  const { color, background } = getStatusStyle(status);

  const label = status
    ? status.replace('_', ' ')
    : 'UNKNOWN';

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
        letterSpacing: '0.3px',
      }}
    >
      {label}
    </span>
  );
};

export default AttendanceStatusBadge;
