// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [charges, setCharges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      console.log('🔐 Token:', token);

      try {
        const response = await axios.get('http://localhost:3001/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('✅ Dashboard data:', response.data);
        setBusinesses(response.data.businesses);
        setCharges(response.data.charges);
      } catch (err) {
        console.error('❌ Error fetching dashboard:', err.response?.data || err.message);
        setError('Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p>{error}</p>}

      <h3>Your Businesses</h3>
      <ul>
        {businesses.map((biz) => (
          <li key={biz.id}>{biz.name}</li>
        ))}
      </ul>

      <h3>Your Charges</h3>
      <ul>
        {charges.map((charge) => (
          <li key={charge.id}>
            {charge.amount} {charge.currency} - {charge.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
