import React, { useState, useEffect } from 'react';
import '../css/Login.css';

// src/components/Login.jsx
import { login } from "../api.js";

async function handleLogin(email, password) {
  const data = await login(email, password);
  console.log(data);
}


function Login({ setAuth, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(undefined);
  const [playfulMessage, setPlayfulMessage] = useState('');
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);

  // Playful messages
  const playfulMessages = [
    "Oops! Only {attempts} attempt(s) left—choose wisely!",
    "Careful! You have {attempts} more shot(s) before a timeout!",
    "Almost there! {attempts} attempt(s) left, keep going!",
    "Don't panic! {attempts} attempt(s) remain, stay calm!",
    "Keep cool, you’ve got {attempts} tries left!",
  ];

  const getPlayfulMessage = (attempts) => {
    const messageTemplate =
      playfulMessages[Math.floor(Math.random() * playfulMessages.length)];
    return messageTemplate.replace("{attempts}", attempts);
  };

  // Live countdown timer
  useEffect(() => {
    if (lockSecondsLeft <= 0) return;

    const timer = setInterval(() => {
      setLockSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockSecondsLeft]);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);

        // If account is locked
        if (data.lockUntil) {
          setLockSecondsLeft(Math.ceil((data.lockUntil - Date.now()) / 1000));
          setAttemptsLeft(undefined);
          setPlayfulMessage('');
          return;
        }

        // Update attempts left for normal failed attempt
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
          setPlayfulMessage(getPlayfulMessage(data.attemptsLeft));
        }

        return;
      }

      // Successful login
      const role = data.role;
      const authData = { isAuthenticated: true, role, token: data.token };
      localStorage.setItem('auth', JSON.stringify(authData));

      setAuth(authData);
      onClose();

      setError('');
      setAttemptsLeft(undefined);
      setPlayfulMessage('');
      setLockSecondsLeft(0);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <>
      <div className="login-overlay" onClick={onClose} />
      <div className="login-page">
        <button className="close-button" onClick={onClose}>&times;</button>

        <h2>-RoboCore-</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setAttemptsLeft(undefined);
            setPlayfulMessage('');
            setLockSecondsLeft(0);
          }}
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

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={lockSecondsLeft > 0} 
        >
          Login
        </button>

        {playfulMessage && <p className="warn">{playfulMessage}</p>}

        {lockSecondsLeft > 0 && (
          <p className="warn">
            ⏱ Too many attempts! Try again in {lockSecondsLeft}s
          </p>
        )}

        <p className="copyright">© RoboCore. All rights reserved.</p>
      </div>
    </>
  );
}

export default Login;
