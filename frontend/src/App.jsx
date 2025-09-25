import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Help from './pages/Help';
import Settings from './pages/Settings';
import './index.css';

function App() {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: null });

  const isAdmin = auth.isAuthenticated && auth.role === 'admin';
  const isGuest = auth.isAuthenticated && auth.role === 'guest';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout auth={auth} setAuth={setAuth} />}>
          {/* Homepage as default */}
          <Route index element={<Homepage auth={auth} />} />

          {/* Shared pages */}
          <Route
            path="homepage"
            element={<Homepage auth={auth} />}
          />
          <Route
            path="notifications"
            element={auth.isAuthenticated ? <Notifications /> : <Navigate to="/" />}
          />
          <Route
            path="about"
            element={<About />}
          />
          <Route
            path="help"
            element={<Help />}
          />
          <Route
            path="settings"
            element={auth.isAuthenticated ? <Settings /> : <Navigate to="/" />}
          />

          {/* Admin-only */}
          <Route
            path="dashboard"
            element={isAdmin ? <Dashboard /> : <Navigate to="/" />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
