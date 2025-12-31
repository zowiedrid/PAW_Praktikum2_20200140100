import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Webcam from 'react-webcam';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function PresensiPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const getToken = () => localStorage.getItem('token');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // Get location on component mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      jwtDecode(token);
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }

    // Get user location
    getLocation();
  }, [navigate]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError('');
        },
        (error) => {
          setLocationError("Gagal mendapatkan lokasi: " + error.message);
          console.log('Geolocation error:', error);
        }
      );
    } else {
      setLocationError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    if (!image) {
      setError("Foto wajib ada! Silahkan ambil foto terlebih dahulu.");
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const token = getToken();
      const blob = await (await fetch(image)).blob();
      
      // Buat FormData
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg');

      const response = await axios.post(
        'http://localhost:3001/api/presensi/check-in',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage(response.data.message);
      setImage(null); // Reset foto setelah sukses
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Check-in gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        'http://localhost:3001/api/presensi/check-out',
        {
          latitude: coords.lat,
          longitude: coords.lng
        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Check-out gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Lakukan Presensi</h2>

          {locationError && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md mb-4">
              {locationError}
            </div>
          )}

          {message && <p className="text-green-600 mb-4 text-center font-semibold">{message}</p>}
          {error && <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>}

          {coords && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Koordinat Anda:</strong> Latitude: {coords.lat.toFixed(6)}, Longitude: {coords.lng.toFixed(6)}
              </p>
              <button
                onClick={getLocation}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Perbarui Lokasi
              </button>
            </div>
          )}

          {/* Tampilan Kamera */}
          <div className="my-4 border rounded-lg overflow-hidden bg-black">
            {image ? (
              <img src={image} alt="Selfie" className="w-full" />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
              />
            )}
          </div>

          <div className="mb-6">
            {!image ? (
              <button 
                onClick={capture} 
                className="bg-blue-500 text-white px-4 py-2 rounded w-full font-semibold hover:bg-blue-600"
              >
                Ambil Foto 📸
              </button>
            ) : (
              <button 
                onClick={() => setImage(null)} 
                className="bg-gray-500 text-white px-4 py-2 rounded w-full font-semibold hover:bg-gray-600"
              >
                Foto Ulang 🔄
              </button>
            )}
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleCheckIn}
              disabled={loading || !coords || !image}
              className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Check-In'}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={loading || !coords}
              className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Check-Out'}
            </button>
          </div>
        </div>

        {coords && (
          <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Peta Lokasi Presensi</h3>
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>
                  Lokasi Presensi Anda<br />
                  Lat: {coords.lat.toFixed(6)}<br />
                  Lng: {coords.lng.toFixed(6)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default PresensiPage;
