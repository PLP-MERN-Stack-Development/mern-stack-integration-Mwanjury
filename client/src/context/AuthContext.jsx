import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  const refreshMe = async () => {
    try {
      const me = await authService.me();
      setUser((u) => ({ ...u, ...me }));
    } catch (_) { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
};
