// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
        const res = await axios.get(`${API_BASE}/api/charges/${businessId}`, {
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
        `${API_BASE}/api/charges`,
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
