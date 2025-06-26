import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyAccount = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndBusinesses = async () => {
      try {
        setError(null);
        setLoadingUser(true);
        setLoadingBusinesses(true);

        const userRes = await axios.get('http://localhost:3001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);
        setLoadingUser(false);

        const bizRes = await axios.get('http://localhost:3001/api/businesses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinesses(bizRes.data.businesses || []);
        setLoadingBusinesses(false);
      } catch (err) {
        console.error('❌ Error loading account:', err);
        setError('Failed to load account data. Please try again.');
        setLoadingUser(false);
        setLoadingBusinesses(false);
      }
    };

    fetchUserAndBusinesses();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('businessId');
    window.location.href = '/login';
  };

  const handleSwitchBusiness = (biz) => {
    localStorage.setItem('businessId', biz.id);
    alert(`Switched to: ${biz.name}`);
    // Optionally you could trigger a more elegant UI refresh here instead of full reload
    window.location.reload();
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">👤 My Account</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loadingUser ? (
        <p>Loading user info...</p>
      ) : user ? (
        <div className="mb-6">
          <p className="mb-1"><strong>Email:</strong> {user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            🚪 Log Out
          </button>
        </div>
      ) : (
        <p>User info not available.</p>
      )}

      <h3 className="text-lg font-semibold mb-2">🏢 My Businesses</h3>

      {loadingBusinesses ? (
        <p>Loading businesses...</p>
      ) : businesses.length > 0 ? (
        <ul className="space-y-2">
          {businesses.map((biz) => (
            <li
              key={biz.id}
              className="border p-3 rounded-xl text-sm flex justify-between items-center"
            >
              <span>{biz.name}</span>
              <button
                onClick={() => handleSwitchBusiness(biz)}
                className="text-blue-600 text-xs underline hover:text-blue-800"
              >
                Switch
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No businesses found.</p>
      )}
    </div>
  );
};

export default MyAccount;
