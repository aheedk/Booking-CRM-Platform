import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user.role === 'admin') return <AdminDashboard />;
  return <ClientDashboard />;
}

function ClientDashboard() {
  const { user } = useAuth();
  const { data: appointments, loading } = useFetch('/appointments/mine');

  const upcoming = appointments?.filter(
    (a) => a.status === 'scheduled' && new Date(a.start_time) > new Date()
  );

  return (
    <div className="dashboard">
      <h2>Welcome, {user.firstName}!</h2>
      <div className="dashboard-section">
        <h3>Upcoming Appointments</h3>
        {loading ? (
          <p>Loading...</p>
        ) : upcoming?.length > 0 ? (
          <ul className="appointment-list">
            {upcoming.slice(0, 5).map((a) => (
              <li key={a.id}>
                <strong>{a.service_name}</strong> —{' '}
                {new Date(a.start_time).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming appointments.</p>
        )}
        <Link to="/services" className="btn btn-primary">
          Book a Service
        </Link>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { data: appointments, loading: loadingAppts } = useFetch('/appointments');
  const { data: clients, loading: loadingClients } = useFetch('/clients');

  const todayAppts = appointments?.filter((a) => {
    const d = new Date(a.start_time);
    const today = new Date();
    return d.toDateString() === today.toDateString() && a.status === 'scheduled';
  });

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Today's Appointments</h3>
          <span className="stat-number">
            {loadingAppts ? '...' : todayAppts?.length || 0}
          </span>
        </div>
        <div className="stat-card">
          <h3>Total Clients</h3>
          <span className="stat-number">
            {loadingClients ? '...' : clients?.length || 0}
          </span>
        </div>
      </div>
      <div className="dashboard-actions">
        <Link to="/admin/services/new" className="btn btn-primary">
          Add Service
        </Link>
        <Link to="/admin/appointments" className="btn btn-secondary">
          View All Appointments
        </Link>
        <Link to="/admin/clients" className="btn btn-secondary">
          View Clients
        </Link>
      </div>
    </div>
  );
}
