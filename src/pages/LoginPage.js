// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('📤 Logging in with:', email, password);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      const { token, userId } = response.data;
      console.log('✅ Login successful:', token);

      // Save token and userId to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Login</button>
      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
};

export default LoginPage;
