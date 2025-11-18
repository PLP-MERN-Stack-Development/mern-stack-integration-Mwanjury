import React, { useState, useContext } from 'react';
import { authService } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import useApi from '../api/useApi';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const { request, loading, error } = useApi();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const res = await request(() => authService.login({ email, password }));
        login(res);
      } else {
        const res = await request(() => authService.register({ name, email, password }));
        login(res);
      }
      nav('/');
    } catch (err) { /* handled */ }
  };

  return (
    <div className="auth">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={submit}>
        {mode === 'register' && <div><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required /></div>}
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <button type="submit" disabled={loading}>{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Create an account' : 'Have an account? Login'}
      </button>
    </div>
  );
}
