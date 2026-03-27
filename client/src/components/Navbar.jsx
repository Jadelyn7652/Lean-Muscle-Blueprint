import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, hasSubscription } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-orange-500 tracking-tight">
        Lean Muscle Blueprint
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/courses" className="text-gray-300 hover:text-white transition">Courses</Link>
        {!hasSubscription && (
          <Link to="/pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
        )}
        {user ? (
          <>
            {hasSubscription && (
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
            )}
            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition">Log in</Link>
            <Link
              to="/pricing"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
