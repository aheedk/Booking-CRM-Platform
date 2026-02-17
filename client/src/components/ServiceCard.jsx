import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ServiceCard({ service, onDelete }) {
  const { user } = useAuth();

  return (
    <div className="card">
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <div className="card-details">
        <span>{service.duration} min</span>
        <span>${Number(service.price).toFixed(2)}</span>
      </div>
      <div className="card-actions">
        {user?.role === 'client' && (
          <Link to={`/book/${service.id}`} className="btn btn-primary">
            Book Now
          </Link>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to={`/admin/services/${service.id}/edit`} className="btn btn-secondary">
              Edit
            </Link>
            <button onClick={() => onDelete(service.id)} className="btn btn-danger">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
