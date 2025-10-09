import React, { useState } from 'react';
import '../css/Login.css';
import bg from '../assets/background.png';

function Login({ setAuth, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const role = data.role?.toLowerCase();

        if (role === 'admin') {
          const authData = { isAuthenticated: true, role: 'admin' };
          localStorage.setItem('auth', JSON.stringify(authData));
          setAuth(authData);
          onClose();
        } else {
          setError('Unknown role');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <div className="login-background" style={{ backgroundImage: `url(${bg})` }} />
      <div className="login-overlay" onClick={onClose} />
      <div className="login-page" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <button className="close-button" onClick={onClose} aria-label="Close login modal">
          &times;
        </button>
        <h2 id="login-title">RoboCore</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {error && <p className="error">{error}</p>}
        <div className="button-row">
          <button onClick={handleLogin}>Login</button>
        </div>
        <p>&#169; RoboCore. All rights reserved.</p>
      </div>
    </>
  );
}

export default Login;
