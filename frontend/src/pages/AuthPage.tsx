// @ts-nocheck
import React, { useState } from 'react';
import { useAuthStore } from '../store';
import { apiClient } from '../api/client';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const form = new URLSearchParams();
        form.append('username', username);
        form.append('password', password);
        const { data } = await apiClient.post('/auth/login', form, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        setToken(data.access_token);
      } else {
        await apiClient.post('/auth/register', { username, email, password });
        // auto-login after register
        const form = new URLSearchParams();
        form.append('username', username);
        form.append('password', password);
        const { data } = await apiClient.post('/auth/login', form, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        setToken(data.access_token);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Something went wrong.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', paddingTop: '6rem' }}>
      <h1 className="title-glow" style={{ fontSize: '2.2rem', textAlign: 'center' }}>SonicAI</h1>
      <p className="subtitle" style={{ textAlign: 'center' }}>{isLogin ? 'Sign in to your studio' : 'Create your account'}</p>

      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            className="input-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: '#ff6b6b', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--secondary)', cursor: 'pointer' }}
          >
            {isLogin ? 'Register' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};
