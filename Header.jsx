import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>📅 Clinic Calendar</h1>
          <span className="header-subtitle">Appointment Management System</span>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <ThemeToggle />
            <span className="user-name">Welcome, {user.username}</span>
            <span className="user-role">{user.role}</span>
            <button onClick={logout} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;