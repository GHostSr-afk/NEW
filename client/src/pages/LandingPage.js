import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-nav-shell">
        <nav className="landing-nav">
          <Link to="/" className="landing-brand">
            <span className="brand-mark">SC</span>
            <span className="brand-text">SmartCloset</span>
          </Link>

          <div className="landing-nav-links">
            <a href="#about" className="landing-link">About</a>
            <a href="#benefits" className="landing-link">Why It Works</a>
            <a href="#footer" className="landing-link">Contact</a>
          </div>

          <div className="landing-nav-actions">
            <Link className="landing-link" to="/login">Login</Link>
            <Link className="landing-button landing-button-dark" to="/register">Sign Up</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="about">
          <div className="hero-copy">
            <div className="hero-eyebrow-wrap">
              <span className="hero-kicker">Wardrobe intelligence</span>
              <div className="hero-avatars" aria-hidden="true">
                <span className="avatar-chip">A</span>
                <span className="avatar-chip">S</span>
                <span className="avatar-chip">C</span>
              </div>
            </div>

            <h1 className="hero-title">
              A refined digital closet that shows what to wear, when to wear it, and what to buy next.
            </h1>
            <p className="hero-description">
              SmartCloset helps you upload clothing, organize your wardrobe, plan looks, and make better styling decisions from one calm interface. The hero layout borrows the layered feel of modern component galleries while staying fully within your existing palette.
            </p>

            <div className="hero-actions">
              <Link className="landing-button landing-button-dark" to="/register">Create account</Link>
              <Link className="landing-button landing-button-light" to="/login">Login</Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-card">
                <span className="hero-stat-value">Upload</span>
                <span className="hero-stat-label">Turn photos into a searchable personal closet.</span>
              </div>
              <div className="hero-stat-card">
                <span className="hero-stat-value">Plan</span>
                <span className="hero-stat-label">Preview outfit combinations before your day starts.</span>
              </div>
              <div className="hero-stat-card">
                <span className="hero-stat-value">Repeat Less</span>
                <span className="hero-stat-label">See what you own and use it more intentionally.</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="ambient-orb orb-one" aria-hidden="true"></div>
            <div className="ambient-orb orb-two" aria-hidden="true"></div>

            <div className="hero-demo-card">
              <div className="demo-topbar">
                <div className="demo-dots" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="demo-topbar-label">Live wardrobe preview</span>
              </div>

              <div className="demo-workspace">
                <aside className="demo-sidebar">
                  <div className="demo-sidebar-block active">
                    <span className="demo-sidebar-title">My Closet</span>
                    <span className="demo-sidebar-text">84 items ready</span>
                  </div>
                  <div className="demo-sidebar-block">
                    <span className="demo-sidebar-title">Planner</span>
                    <span className="demo-sidebar-text">3 looks saved</span>
                  </div>
                  <div className="demo-sidebar-block">
                    <span className="demo-sidebar-title">Uploads</span>
                    <span className="demo-sidebar-text">2 pending tags</span>
                  </div>
                </aside>

                <div className="demo-main">
                  <div className="demo-main-header">
                    <div>
                      <p className="demo-kicker">How it works</p>
                      <h2 className="demo-title">Upload, sort, combine.</h2>
                    </div>
                    <div className="demo-pulse">
                      <span className="demo-pulse-dot"></span>
                      <span>Active</span>
                    </div>
                  </div>

                  <div className="demo-grid">
                    <div className="demo-garment demo-garment-one">
                      <span>Outerwear</span>
                    </div>
                    <div className="demo-garment demo-garment-two">
                      <span>Top</span>
                    </div>
                    <div className="demo-garment demo-garment-three">
                      <span>Bottom</span>
                    </div>
                  </div>

                  <div className="demo-timeline">
                    <div className="timeline-step step-one">
                      <span className="timeline-number">01</span>
                      <p>Add clothes</p>
                    </div>
                    <div className="timeline-step step-two">
                      <span className="timeline-number">02</span>
                      <p>Filter by season</p>
                    </div>
                    <div className="timeline-step step-three">
                      <span className="timeline-number">03</span>
                      <p>Build a look</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-floating-note note-one">
              <span className="floating-label">Today</span>
              <strong>Minimal workwear set ready</strong>
            </div>
            <div className="hero-floating-note note-two">
              <span className="floating-label">Planner</span>
              <strong>Suggested for warm weather</strong>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-heading">
            <p className="section-kicker">What the app is about</p>
            <h2 className="section-title">A wardrobe app built to reduce friction in everyday dressing.</h2>
          </div>

          <div className="about-grid">
            <article className="about-card about-card-dark">
              <p className="about-card-label">Organize clearly</p>
              <h3>See your wardrobe as a complete system, not scattered photos and guesses.</h3>
              <p>
                SmartCloset gives your clothing a structure: categories, seasons, combinations, and a cleaner way to understand what you already own.
              </p>
            </article>

            <article className="about-card">
              <p className="about-card-label">Plan visually</p>
              <h3>Move from "what should I wear?" to a ready-made set of looks.</h3>
              <p>
                The app makes it easier to test combinations, save outfits, and spend less time rethinking basics every morning.
              </p>
            </article>

            <article className="about-card">
              <p className="about-card-label">Use more of what you own</p>
              <h3>Get more value from your closet before buying something new.</h3>
              <p>
                When your pieces are visible and searchable, repeat purchases drop and overlooked items finally become usable again.
              </p>
            </article>
          </div>
        </section>

        <section className="benefits-section" id="benefits">
          <div className="section-heading">
            <p className="section-kicker">Why it is useful</p>
            <h2 className="section-title">SmartCloset solves the practical problems behind getting dressed.</h2>
          </div>

          <div className="benefits-layout">
            <div className="benefits-column">
              <div className="benefit-card">
                <span className="benefit-number">01</span>
                <h3>Stops decision fatigue</h3>
                <p>Saved outfits and wardrobe visibility mean fewer rushed choices before work, class, or travel.</p>
              </div>
              <div className="benefit-card">
                <span className="benefit-number">02</span>
                <h3>Makes your closet searchable</h3>
                <p>Instead of forgetting what you own, you can browse by category and season in seconds.</p>
              </div>
            </div>

            <div className="benefits-spotlight">
              <div className="spotlight-panel">
                <p className="spotlight-label">Designed for everyday use</p>
                <h3>Useful when your wardrobe is full, but your options still feel unclear.</h3>
                <p>
                  The core value is not decoration. It is reducing clutter, improving reuse, and helping you build confident outfits faster.
                </p>
                <div className="spotlight-bars" aria-hidden="true">
                  <span className="spotlight-bar bar-a"></span>
                  <span className="spotlight-bar bar-b"></span>
                  <span className="spotlight-bar bar-c"></span>
                </div>
              </div>
            </div>

            <div className="benefits-column">
              <div className="benefit-card">
                <span className="benefit-number">03</span>
                <h3>Helps you pack and prepare</h3>
                <p>Plan combinations ahead of time for travel, events, and busy weeks without starting from zero.</p>
              </div>
              <div className="benefit-card">
                <span className="benefit-number">04</span>
                <h3>Supports smarter buying</h3>
                <p>When you know what is already in your closet, you buy with more intention and fewer duplicates.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer" id="footer">
        <div className="footer-brand-block">
          <div className="landing-brand footer-brand">
            <span className="brand-mark">SC</span>
            <span className="brand-text">SmartCloset</span>
          </div>
          <p className="footer-copy">
            Organize your wardrobe, plan outfits, and move into the app through dedicated login and signup flows.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <span className="footer-heading">Product</span>
            <a href="#about">About</a>
            <a href="#benefits">Why It Works</a>
          </div>
          <div className="footer-column">
            <span className="footer-heading">Access</span>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
