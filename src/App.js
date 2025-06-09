import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

function App() {
  const [amount, setAmount] = useState('');
  const [url, setUrl] = useState('');

  const handleGeneratePayment = async () => {
    try {
      const response = await fetch('https://crypto-pay-backend.onrender.com/create-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (data.hostedUrl) {
        setUrl(data.hostedUrl);
      } else {
        alert("Failed to generate payment link.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="App">
      <h1>Crypto Payment</h1>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleGeneratePayment}>Generate Payment</button>

      {url && (
        <div style={{ marginTop: '20px' }}>
          <h3>Scan to Pay</h3>
          <QRCodeCanvas value={url} size={256} />
          <p><a href={url} target="_blank" rel="noreferrer">{url}</a></p>
        </div>
      )}
    </div>
  );
}

export default App;
