// src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  console.log('📤 Logging in with:', email, password);
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email,
      password,
    });

      const { token } = response.data;
    localStorage.setItem('token', token);
    setMessage('✅ Logged in successfully');
    navigate('/dashboard'); // redirect after login
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    setMessage('❌ Login failed');
  }
};

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Login</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default LoginPage;
