import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">MERN Blog</Link>
      </div>
      <div className="nav-right">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/create">Create</Link>
            <button onClick={handleLogout} className="link-btn">Logout</button>
          </>
        ) : (
          <Link to="/auth">Login / Register</Link>
        )}
      </div>
    </nav>
  );
}
