import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h1 className="logo-text">SmartCloset</h1>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/upload" 
            className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
          >
            Upload
          </Link>
          <Link 
            to="/closet" 
            className={`nav-link ${isActive('/closet') ? 'active' : ''}`}
          >
            My Closet
          </Link>
          <Link 
            to="/planner" 
            className={`nav-link ${isActive('/planner') ? 'active' : ''}`}
          >
            Outfit Planner
          </Link>
        </div>

        <div className="nav-actions">
          <span className="user-email">{user?.email}</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
