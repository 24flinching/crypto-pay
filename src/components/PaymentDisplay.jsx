// src/components/PaymentDisplay.jsx
import React from 'react';
import { QRCode } from 'qrcode.react';

const PaymentDisplay = ({ paymentUrl, amount, currency }) => {
  if (!paymentUrl) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-2xl shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Scan to Pay</h2>
      <QRCode value={paymentUrl} size={256} />
      <div className="text-center mt-2">
        <p className="text-lg font-bold">{amount} {currency}</p>
        <p className="text-sm text-gray-500 break-all">{paymentUrl}</p>
      </div>
    </div>
  );
};

export default PaymentDisplay;
