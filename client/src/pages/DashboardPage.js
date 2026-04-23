import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page page">
      <div className="container dashboard-shell">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-kicker">Welcome back</p>
            <h1 className="page-title dashboard-title">
              {user?.name ? `${user.name}'s SmartCloset` : 'Your SmartCloset workspace'}
            </h1>
            <p className="page-subtitle dashboard-subtitle">
              Pick up where you left off and move straight into wardrobe management, outfit planning, or uploads.
            </p>
          </div>
          <div className="dashboard-status-card">
            <span className="dashboard-status-label">Account</span>
            <strong>{user?.email}</strong>
            <p>Your app is now unlocked after login or signup.</p>
          </div>
        </section>

        <section className="dashboard-grid">
          <Link className="dashboard-card" to="/upload">
            <span className="dashboard-card-eyebrow">Upload</span>
            <h2>Add a new piece</h2>
            <p>Bring fresh items into your digital wardrobe with a clean intake flow.</p>
          </Link>

          <Link className="dashboard-card" to="/closet">
            <span className="dashboard-card-eyebrow">Closet</span>
            <h2>Browse your collection</h2>
            <p>Search, filter, and manage clothing you have already cataloged.</p>
          </Link>

          <Link className="dashboard-card" to="/planner">
            <span className="dashboard-card-eyebrow">Planner</span>
            <h2>Build your next look</h2>
            <p>Create outfit combinations for upcoming days, events, and routines.</p>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
