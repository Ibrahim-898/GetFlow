import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/button/Button';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Protect Your APIs with
              <span className="highlight"> Intelligent Rate Limiting</span>
            </h1>
            <p className="hero-description">
              Enterprise-grade rate limiting solution that scales with your business. 
              Prevent abuse, reduce costs, and ensure fair usage with our advanced 
              traffic management system.
            </p>
            <div className="hero-actions">
              <Link to="/register">
                <Button size="large">Start Free Trial</Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="large">View Services</Button>
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">99.9%</span>
                <span className="stat-label">Uptime SLA</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">10M+</span>
                <span className="stat-label">API Requests/day</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">50+</span>
                <span className="stat-label">Global PoPs</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="dashboard-header">
                <div className="header-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="header-title">Rate Limit Dashboard</span>
              </div>
              <div className="dashboard-content">
                <div className="chart-area">
                  <div className="chart-bars">
                    {[65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 70, 95].map((height, i) => (
                      <div key={i} className="chart-bar" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                </div>
                <div className="stats-cards">
                  <div className="mini-card">
                    <span className="mini-label">Total Requests</span>
                    <span className="mini-value">2.4M</span>
                  </div>
                  <div className="mini-card">
                    <span className="mini-label">Blocked</span>
                    <span className="mini-value error">12.5K</span>
                  </div>
                  <div className="mini-card">
                    <span className="mini-label">Allowed</span>
                    <span className="mini-value success">2.38M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose RateGuard?</h2>
          <p className="section-subtitle">
            Everything you need to protect and manage your API traffic at scale
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3>Lightning Fast</h3>
              <p>Sub-millisecond latency with edge computing. Your users won't notice any delay.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-grade encryption, DDoS protection, and compliance with SOC 2, GDPR, and HIPAA.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3>Global Scale</h3>
              <p>50+ global points of presence ensuring low latency worldwide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3>Easy Integration</h3>
              <p>SDKs for all major languages. Get started in minutes with simple REST APIs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>Real-time Analytics</h3>
              <p>Live dashboards with detailed metrics, alerts, and custom reporting.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <h3>Flexible Policies</h3>
              <p>Create custom rules based on IP, user, API key, or custom headers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get started in three simple steps
          </p>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up for free and get your API keys instantly.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Integrate SDK</h3>
              <p>Add our SDK to your API with just a few lines of code.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Set Policies</h3>
              <p>Configure your rate limits and start protecting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Secure Your APIs?</h2>
            <p>Start your free trial today. No credit card required.</p>
            <div className="cta-actions">
              <Link to="/register">
                <Button size="large">Get Started Free</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="large">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;