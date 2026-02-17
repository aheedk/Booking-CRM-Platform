import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

export default function ClientsPage() {
  const { data: clients, loading, error } = useFetch('/clients');

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="clients-page">
      <h2>Clients</h2>
      {clients?.length === 0 ? (
        <p>No clients registered.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.phone || '—'}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>
                  <Link to={`/admin/clients/${c.id}`} className="btn btn-sm btn-secondary">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
