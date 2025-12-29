import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
      }
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-lg font-semibold text-gray-800">
              Web Presensi
            </Link>
            {user && (
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <Link to="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/presensi" className="hover:text-blue-600">
                  Presensi
                </Link>
                {user.role === 'admin' && (
                  <Link to="/reports" className="hover:text-blue-600">
                    Laporan Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-700">Halo, {user.nama}</span>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="py-1 px-3 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Link to="/login" className="hover:text-blue-600">Login</Link>
                <Link to="/register" className="hover:text-blue-600">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
