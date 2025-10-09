import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Help from './pages/Help';
import Settings from './pages/Settings';
import './index.css';

function AppWrapper() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ isAuthenticated: false, role: null });

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth({ isAuthenticated: false, role: null });
    navigate('/');
  };

  const isAdmin = auth.isAuthenticated && auth.role === 'admin';

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout auth={auth} setAuth={setAuth} onLogout={handleLogout} />}
      >
        <Route index element={<Homepage auth={auth} />} />
        <Route path="homepage" element={<Homepage auth={auth} />} />
        <Route
          path="notifications"
          element={auth.isAuthenticated ? <Notifications /> : <Navigate to="/" />}
        />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route
          path="settings"
          element={auth.isAuthenticated ? <Settings /> : <Navigate to="/" />}
        />
        <Route
          path="dashboard"
          element={isAdmin ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
