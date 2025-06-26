// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

const Dashboard = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [provider, setProvider] = useState('coinbase');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const businessId = localStorage.getItem('businessId');

  useEffect(() => {
    let intervalId;

    const fetchCharges = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/charges/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCharges(res.data.charges || []);
      } catch (err) {
        console.error('❌ Error fetching charges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
    intervalId = setInterval(fetchCharges, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId);
  }, [businessId, token]);

  const handleCreateCharge = async (e) => {
    e.preventDefault();
    if (!amount) return alert('Please enter an amount');

    setSubmitting(true);
    try {
      const res = await axios.post(
        'http://localhost:3001/api/charges',
        {
          amount: parseFloat(amount),
          currency,
          provider,
          businessId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('✅ Charge created:', res.data);
      setAmount('');
    } catch (err) {
      console.error('❌ Error creating charge:', err);
      alert('Failed to create charge');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">📋 Your Charges</h2>

      {/* 💸 Charge Creation Form */}
      <form
        onSubmit={handleCreateCharge}
        className="mb-8 border p-4 rounded-2xl shadow space-y-4"
      >
        <h3 className="text-lg font-semibold">➕ Create New Charge</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            step="any"
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="BTC">BTC</option>
          </select>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="coinbase">Coinbase</option>
            <option value="btcpay">BTCPay</option>
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>

      {/* 🧾 Charge List */}
      {loading ? (
        <p className="text-center">⏳ Loading charges...</p>
      ) : !charges.length ? (
        <p className="text-center">⚠️ No charges found</p>
      ) : (
        <ul className="space-y-6">
          {charges.map((charge) => (
            <li
              key={charge.id}
              className="border p-4 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">
                  {charge.amount} {charge.currency}
                </span>
                <span className="text-sm text-gray-600">Status: {charge.status}</span>
              </div>
              <div className="text-sm text-gray-500 mb-3">Provider: {charge.provider}</div>

              {charge.paymentUrl ? (
                <div className="flex flex-col items-center">
                  <QRCodeCanvas value={charge.paymentUrl} size={160} />
                  <p className="text-xs mt-2 break-all text-center">{charge.paymentUrl}</p>
                  <a
                    href={charge.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-blue-600 text-sm underline"
                  >
                    💸 Pay Now
                  </a>
                </div>
              ) : (
                <p className="text-sm text-red-500 text-center mt-2">❌ No payment URL available</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
