import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart<span className="title-accent">Closet</span>
          </h1>
          <p className="hero-subtitle">Premium Wardrobe Assistant</p>
          <p className="hero-description">
            Curate your style with elegance. Organize your wardrobe, plan perfect outfits, 
            and elevate your everyday fashion with our intelligent wardrobe management system.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/planner')}>
              Plan Your Outfit
            </button>
            <button className="btn-secondary" onClick={() => navigate('/closet')}>
              Browse Closet
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card card-1"></div>
          <div className="visual-card card-2"></div>
          <div className="visual-card card-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Designed for the Discerning</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👔</div>
            <h3 className="feature-title">Digital Wardrobe</h3>
            <p className="feature-description">
              Upload and organize your entire collection with beautiful, high-quality imagery
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3 className="feature-title">Smart Suggestions</h3>
            <p className="feature-description">
              AI-powered outfit recommendations based on season, occasion, and your personal style
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">Outfit Planner</h3>
            <p className="feature-description">
              Create and save your favorite combinations for any occasion
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Anywhere, Anytime</h3>
            <p className="feature-description">
              Access your wardrobe from any device with our responsive design
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Style?</h2>
          <p className="cta-description">
            Start organizing your wardrobe and discovering new outfit combinations today
          </p>
          <button className="btn-cta" onClick={() => navigate('/upload')}>
            Add Your First Item
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
