export default function AppointmentRow({ appointment, onStatusChange, onCancel, isAdmin }) {
  const start = new Date(appointment.start_time);

  return (
    <tr>
      <td>{start.toLocaleDateString()}</td>
      <td>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td>{appointment.service_name}</td>
      {isAdmin && (
        <td>{appointment.client_first_name} {appointment.client_last_name}</td>
      )}
      <td>
        <span className={`status status-${appointment.status}`}>
          {appointment.status}
        </span>
      </td>
      <td>
        {appointment.status === 'scheduled' && (
          <>
            {isAdmin && (
              <button
                onClick={() => onStatusChange(appointment.id, 'completed')}
                className="btn btn-sm btn-primary"
              >
                Complete
              </button>
            )}
            <button
              onClick={() =>
                isAdmin
                  ? onStatusChange(appointment.id, 'cancelled')
                  : onCancel(appointment.id)
              }
              className="btn btn-sm btn-danger"
            >
              Cancel
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
