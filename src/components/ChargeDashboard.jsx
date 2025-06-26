import React, { useState, useEffect } from 'react';
import { QRCode } from 'qrcode.react';

const PaymentDisplay = ({ paymentUrl, amount, currency }) => {
  if (!paymentUrl) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-2xl shadow-md bg-white max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold">Scan to Pay</h2>
      <QRCode value={paymentUrl} size={256} />
      <div className="text-center mt-2">
        <p className="text-lg font-bold">{amount} {currency}</p>
        <p className="text-sm text-gray-500 break-all">{paymentUrl}</p>
      </div>
    </div>
  );
};

const ChargeDashboard = () => {
  const token = localStorage.getItem('token');
  const businessId = localStorage.getItem('businessId');

  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [provider, setProvider] = useState('coinbase');
  const [paymentData, setPaymentData] = useState(null);
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (token && businessId) {
      fetchCharges();
    }
  }, []);

  // Fetch existing charges for the business
  const fetchCharges = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/charges/${businessId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch charges');
      const data = await res.json();
      setCharges(data.charges);
    } catch (err) {
      console.error(err);
      setError('Error fetching charges');
    } finally {
      setLoading(false);
    }
  };

  // Create a new charge and show payment info
  const handleCreateCharge = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setCreateError('Please enter a valid amount');
      return;
    }
    setCreating(true);
    setCreateError('');
    setPaymentData(null);

    try {
      const res = await fetch('http://localhost:3001/api/charges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          currency,
          provider,
          businessId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create charge');
      }

      const data = await res.json();
      setPaymentData(data); // Should contain paymentUrl, amount, currency
      fetchCharges(); // Refresh the list to include the new charge
    } catch (err) {
      console.error(err);
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Charge Dashboard</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          Amount:
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-2 font-semibold">
          Currency:
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="USDT">USDT</option>
          </select>
        </label>

        <label className="block mb-2 font-semibold">
          Provider:
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="coinbase">Coinbase</option>
            <option value="btcpay">BTCPay</option>
          </select>
        </label>

        {createError && <div className="mb-2 text-red-600">{createError}</div>}

        <button
          onClick={handleCreateCharge}
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {creating ? 'Creating Charge...' : 'Create Charge'}
        </button>
      </div>

      <PaymentDisplay
        paymentUrl={paymentData?.paymentUrl}
        amount={paymentData?.amount}
        currency={paymentData?.currency}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Charges</h2>
        {loading ? (
          <p>Loading charges...</p>
        ) : charges.length === 0 ? (
          <p>No charges found.</p>
        ) : (
          <ul className="space-y-2">
            {charges.map((charge) => (
              <li
                key={charge.id}
                className="p-2 border rounded shadow-sm hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setPaymentData({
                    paymentUrl: charge.paymentUrl,
                    amount: charge.amount,
                    currency: charge.currency,
                  })
                }
              >
                <p><strong>Amount:</strong> {charge.amount} {charge.currency}</p>
                <p><strong>Provider:</strong> {charge.provider}</p>
                <p><strong>Status:</strong> {charge.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChargeDashboard;
