import { useFetch } from '../hooks/useFetch';
import AppointmentRow from '../components/AppointmentRow';
import api from '../api/axios';

export default function MyAppointmentsPage() {
  const { data: appointments, loading, error, setData } = useFetch('/appointments/mine');

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      const res = await api.patch(`/appointments/${id}/cancel`);
      setData(appointments.map((a) => (a.id === id ? res.data : a)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="appointments-page">
      <h2>My Appointments</h2>
      {appointments?.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <AppointmentRow
                key={a.id}
                appointment={a}
                onCancel={handleCancel}
                isAdmin={false}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
