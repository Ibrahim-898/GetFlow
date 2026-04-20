import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Key, Shield, BarChart3, Mail, HelpCircle } from 'lucide-react';

import './Docs.css'; // We'll create this

const Docs = () => {
  return (
    <div className="docs-page">
      <header className="docs-header">
        <div className="docs-hero">
          <BookOpen className="docs-icon" />
          <div>
            <h1>GetFlow Documentation</h1>
            <p>Complete guide to API Management, Rate Limiting, and Monetization</p>
            <nav className="docs-nav">
              <a href="#quickstart">Quickstart</a>
              <a href="#user-guide">User Guide</a>
              <a href="#api-reference">API Reference</a>
              <a href="#features">Features</a>
              <a href="#faq">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="docs-content">
        <section id="quickstart" className="docs-section">
          <h2>🚀 Quickstart</h2>
          <div className="card-grid">
            <div className="card">
              <h3>1. Sign Up</h3>
              <p>Register at <Link to="/register">getflow.com/register</Link></p>
            </div>
            <div className="card">
              <h3>2. Login</h3>
              <p>Access dashboard at <Link to="/login">/login</Link></p>
            </div>
            <div className="card">
              <h3>3. Generate API Key</h3>
              <p>Go to Dashboard → API Keys → Generate</p>
            </div>
            <div className="card">
              <h3>4. Integrate</h3>
              <div className="code-block">Authorization: Bearer YOUR_API_KEY</div>
            </div>
          </div>
        </section>

        <section id="user-guide" className="docs-section">
          <h2>👤 User Guide</h2>
          <div className="card">
            <h3>Dashboard</h3>
            <ul>
              <li>View API usage analytics</li>
              <li>Manage API keys (generate/revoke)</li>
              <li>Monitor rate limits</li>
              <li>Profile settings</li>
            </ul>
          </div>
          <div className="card">
            <h3>API Keys</h3>
            <p>Secure per-user keys for API access. Rate limited and revocable anytime.</p>
          </div>
          <div className="card">
            <h3>Subscriptions</h3>
            <p>Manage payments via SSLCommerz. Auto-expiry handled.</p>
          </div>
        </section>

        <section id="api-reference" className="docs-section">
          <h2>📚 API Reference</h2>
          <div className="card">
            <h3>Base URL</h3>
            <code>http://localhost:8000/api</code>
          </div>
          <div className="endpoint-grid">
            <div className="endpoint-card">
              <h4>Auth</h4>
              <code>POST /auth/login</code>
              <small>email, password → JWT token</small>
            </div>
            <div className="endpoint-card">
              <h4>API Keys</h4>
              <code>POST /keys</code>
              <small>Generate key (Auth required)</small>
            </div>
            <div className="endpoint-card">
              <h4>Analytics</h4>
              <code>GET /analytics</code>
              <small>Usage stats</small>
            </div>
            <div className="endpoint-card">
              <h4>Your API Gateway</h4>
              <code>POST /gateway/*</code>
              <small>Your protected endpoints (Key required)</small>
            </div>
          </div>
        </section>

        <section id="features" className="docs-section">
          <h2>✨ Features</h2>
          <ul className="feature-list">
            <li><Shield /> Advanced Rate Limiting (Redis-powered)</li>
            <li><Key /> API Key Management</li>
            <li><BarChart3 /> Real-time Analytics</li>
            <li><Mail /> Email Notifications</li>
            <li>🔐 JWT Authentication</li>
            <li>💳 Subscription Billing</li>
            <li>📊 Usage Dashboards</li>
          </ul>

        </section>

        <section id="faq" className="docs-section">
          <h2>❓ FAQ</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How do rate limits work?</h4>
              <p>Sliding window algorithm via Redis. Configurable per key/endpoint.</p>
            </div>
            <div className="faq-item">
              <h4>What happens on limit exceed?</h4>
              <p>HTTP 429 Too Many Requests with Retry-After header.</p>
            </div>
            <div className="faq-item">
              <h4>Is my data secure?</h4>
              <p>JWT + API keys + bcrypt. No plain passwords stored.</p>
            </div>
            <div className="faq-item">
              <h4>Support?</h4>
              <p>Email support@getflow.com or GitHub issues.</p>
            </div>
          </div>
        </section>

        <section className="docs-footer">
          <div className="support-links">
            <Link to="/dashboard"><User /> Dashboard</Link>
<a href="mailto:support@getflow.com"><Mail /> Contact</a>
<a href="#"> GitHub</a>
<a href="#"><HelpCircle /> Support</a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Docs;

