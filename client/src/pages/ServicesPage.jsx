import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import ServiceCard from '../components/ServiceCard';
import api from '../api/axios';

export default function ServicesPage() {
  const { user } = useAuth();
  const { data: services, loading, error, setData } = useFetch('/services');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      setData(services.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  if (loading) return <div className="loading">Loading services...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="services-page">
      <div className="page-header">
        <h2>Our Services</h2>
        {user?.role === 'admin' && (
          <Link to="/admin/services/new" className="btn btn-primary">
            Add Service
          </Link>
        )}
      </div>
      <div className="card-grid">
        {services?.map((service) => (
          <ServiceCard key={service.id} service={service} onDelete={handleDelete} />
        ))}
      </div>
      {services?.length === 0 && <p>No services available.</p>}
    </div>
  );
}
