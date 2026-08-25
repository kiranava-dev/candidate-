import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h1>Recruitment BI Dashboard</h1>
      <div className="user-info">
        <Link to="/dashboard" style={{ color: '#fff' }}>Dashboard</Link>
        <Link to="/candidates" style={{ color: '#fff' }}>Candidates</Link>
        <span>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
