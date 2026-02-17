import { useFetch } from '../hooks/useFetch';
import AppointmentRow from '../components/AppointmentRow';
import api from '../api/axios';

export default function AppointmentsPage() {
  const { data: appointments, loading, error, setData } = useFetch('/appointments');

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.patch(`/appointments/${id}/status`, { status });
      setData(appointments.map((a) => (a.id === id ? res.data : a)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="appointments-page">
      <h2>All Appointments</h2>
      {appointments?.length === 0 ? (
        <p>No appointments.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Service</th>
              <th>Client</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <AppointmentRow
                key={a.id}
                appointment={a}
                onStatusChange={handleStatusChange}
                isAdmin={true}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
