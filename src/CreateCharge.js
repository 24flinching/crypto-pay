// src/CreateCharge.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateCharge = ({ businessId, onChargeCreated }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [provider, setProvider] = useState('coinbase');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setAmount('');
        onChargeCreated(); // Notify parent to refresh charge list
      }
    } catch (err) {
      setError('Failed to create charge.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-md shadow-sm max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">➕ Create New Charge</h3>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <label className="block mb-2">
        Amount:
        <input
          type="number"
          step="0.0001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </label>

      <label className="block mb-2">
        Currency:
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
        </select>
      </label>

      <label className="block mb-4">
        Provider:
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="coinbase">Coinbase</option>
          <option value="btcpay">BTCPay</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Charge'}
      </button>
    </form>
  );
};

export default CreateCharge;
