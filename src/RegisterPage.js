// RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('📤 Registering with:', email, password);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        email,
        password,
      });

      console.log('✅ Registration successful:', response.data.message);
      alert('Registration successful! Please log in.');

      // After registration, redirect to login page
      navigate('/');
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
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
      <button type="submit">Register</button>
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </form>
  );
};

export default RegisterPage;
