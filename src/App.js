import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import MyAccount from './MyAccount';
import PrivateRoute from './PrivateRoute';
import NavBar from './components/NavBar';

function AuthRedirect({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // Redirect logged-in users away from login/register pages to dashboard
  if (token && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect logged-out users from protected routes to login
  return children;
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <RegisterPage />
            </AuthRedirect>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/myaccount"
          element={
            <PrivateRoute>
              <MyAccount />
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
