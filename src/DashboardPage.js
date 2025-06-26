// src/DashboardPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [businesses, setBusinesses] = useState([]);
  const [charges, setCharges] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/login');

    const fetchData = async () => {
      try {
        const businessRes = await axios.get('/api/businesses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinesses(businessRes.data);

        const chargesRes = await axios.get('/api/charges', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCharges(chargesRes.data);
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleCreatePayment = async (businessId) => {
    try {
      const res = await axios.post(
        '/api/charges',
        {
          businessId,
          amount: 10.0, // You can customize this
          currency: 'USD',
          provider: 'coinbase',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const charge = res.data;
      alert(`Charge created! Charge ID: ${charge.id}`);
    } catch (err) {
      console.error('Create payment failed:', err);
      alert('Failed to create payment');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <h2 className="text-xl font-semibold mt-6">Businesses</h2>
      {businesses.map((biz) => (
        <div key={biz.id} className="border p-4 rounded shadow my-2">
          <p><strong>{biz.name}</strong></p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => handleCreatePayment(biz.id)}
          >
            Create Payment
          </button>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-8">Charges</h2>
      {charges.map((charge) => (
        <div key={charge.id} className="border p-4 rounded shadow my-2">
          <p><strong>Amount:</strong> {charge.amount} {charge.currency}</p>
          <p><strong>Provider:</strong> {charge.provider}</p>
          <p><strong>Status:</strong> {charge.status}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardPage;
