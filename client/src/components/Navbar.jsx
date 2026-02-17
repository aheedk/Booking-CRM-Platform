import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">BookingCRM</Link>
      </div>
      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/services">Services</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/services">Services</Link>
            {user.role === 'client' && (
              <Link to="/my-appointments">My Appointments</Link>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/admin/appointments">Appointments</Link>
                <Link to="/admin/clients">Clients</Link>
              </>
            )}
            <span className="navbar-user">{user.firstName}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
