 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil dan decode token dari localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error('Token tidak valid:', err);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Selamat Datang! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Anda telah berhasil login
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pengguna</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Nama:</span>
                <span className="font-semibold text-gray-800">{user.nama || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Email:</span>
                <span className="font-semibold text-gray-800">{user.email || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Role:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' ? '👨‍💼 Admin' : '👨‍🎓 Mahasiswa'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">✓</div>
            <p className="text-gray-600 text-sm">Login Berhasil</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">🔒</div>
            <p className="text-gray-600 text-sm">Token Aman</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition transform hover:scale-105"
        >
          🚪 Logout
        </button>
      </div>

      {/* Footer */}
      <p className="text-white text-center mt-8 text-sm">
        © 2025 Aplikasi Autentikasi | PAW TI501P
      </p>
    </div>
  );
}

export default DashboardPage;
 