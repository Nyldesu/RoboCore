import React, { useState, useEffect } from 'react';
import '../css/Login.css';
import { loginUser } from '../api.js';

function Login({ setAuth, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(undefined);
  const [playfulMessage, setPlayfulMessage] = useState('');
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);

  const playfulMessages = [
    "Oops! Only {attempts} attempt(s) left—choose wisely!",
    "Careful! You have {attempts} more shot(s) before a timeout!",
    "Almost there! {attempts} attempt(s) left, keep going!",
    "Don't panic! {attempts} attempt(s) remain, stay calm!",
    "Keep cool, you’ve got {attempts} tries left!",
  ];

  const getPlayfulMessage = (attempts) => {
    const template =
      playfulMessages[Math.floor(Math.random() * playfulMessages.length)];
    return template.replace("{attempts}", attempts);
  };

  // Countdown timer for lockout
  useEffect(() => {
    if (lockSecondsLeft <= 0) return;

    const timer = setInterval(() => {
      setLockSecondsLeft(prev =>
        prev <= 1 ? (clearInterval(timer), 0) : prev - 1
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [lockSecondsLeft]);

  // Handle login click
  const handleLoginClick = async () => {
    setError('');

    try {
      const data = await loginUser(email, password);

      const authData = {
        isAuthenticated: true,
        role: data.role,
        token: data.token,
      };
      localStorage.setItem('auth', JSON.stringify(authData));
      localStorage.setItem('authToken', data.token); 
      setAuth(authData);

      // Reset 
      setAttemptsLeft(undefined);
      setPlayfulMessage('');
      setLockSecondsLeft(0);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setAuth({ isAuthenticated: false });
      localStorage.removeItem('auth');
      localStorage.removeItem('authToken');

      setError(err.message || 'Invalid email or password.');

      if (err.lockUntil) {
        setLockSecondsLeft(Math.ceil((err.lockUntil - Date.now()) / 1000));
        setAttemptsLeft(undefined);
        setPlayfulMessage('');
      }
      else if (err.attemptsLeft !== undefined) {
        setAttemptsLeft(err.attemptsLeft);
        setPlayfulMessage(getPlayfulMessage(err.attemptsLeft));
      }
    }
  };

  // Enter key handler
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLoginClick();
  };

  return (
    <>
      <div className="login-overlay" onClick={onClose} />
      <div className="login-page">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <h2>-RoboCore-</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setAttemptsLeft(undefined);
            setPlayfulMessage('');
            setLockSecondsLeft(0);
          }}
          onKeyDown={handleKeyDown}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />

        {error && <p className="error">{error}</p>}

        <button
          className="login-button"
          onClick={handleLoginClick}
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
