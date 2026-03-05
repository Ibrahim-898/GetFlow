import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>GetFlow</span>
            </Link>
            <p className="footer-description">
              Enterprise-grade API rate limiting solution for modern applications.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>Product</h4>
              <Link to="/services">Features</Link>
              <Link to="/services">Pricing</Link>
              <Link to="/services">Enterprise</Link>
            </div>
            
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="#documentation">Documentation</a>
              <a href="#api">API Reference</a>
              <a href="#guides">Guides</a>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#blog">Blog</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RateGuard. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;