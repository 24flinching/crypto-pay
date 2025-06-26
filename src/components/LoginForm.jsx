import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();

      // Save token and userId for future authenticated requests
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);

      onLoginSuccess && onLoginSuccess();
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <label className="block mb-2">
        Email:
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="block mb-4">
        Password:
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};

export default LoginForm;
