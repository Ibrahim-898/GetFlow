import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/button/Button';
import './Services.css';

const Services = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small projects and testing',
      monthlyPrice: 100,
      yearlyPrice: 80,
      features: [
        '10,000 API requests/month',
        '1 API key',
        'Basic rate limiting',
        'Email support',
        '7-day analytics',
        'Community access'
      ],
      cta: 'Start Trial',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Best for growing businesses',
      monthlyPrice: 500,
      yearlyPrice: 400,
      features: [
        '1,000,000 API requests/month',
        '10 API keys',
        'Advanced rate limiting',
        'Priority email support',
        '90-day analytics',
        'Custom rules',
        'Webhook alerts',
        'Team collaboration'
      ],
      cta: 'Start Trial',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large-scale applications',
      monthlyPrice: 1000,
      yearlyPrice: 800,
      features: [
        'Unlimited API requests',
        'Unlimited API keys',
        'Enterprise rate limiting',
        '24/7 phone support',
        'Unlimited analytics',
        'Custom integrations',
        'SLA guarantee',
        'Dedicated account manager',
        'On-premise option'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const services = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      title: 'Token Bucket',
      description: 'Smooth rate limiting using token bucket algorithm. Ideal for APIs with burst traffic patterns.',
      useCase: 'Best for: API endpoints with varying traffic'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: 'Sliding Window',
      description: 'Precise rate limiting with sliding window counter. Minimizes burst traffic impact.',
      useCase: 'Best for: Strict rate enforcement'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      title: 'Leaky Bucket',
      description: 'Constant flow rate limiting. Perfect for preventing sudden traffic spikes.',
      useCase: 'Best for: Message queues & streaming'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Fixed Window',
      description: 'Simple and efficient rate limiting. Great for high-performance applications.',
      useCase: 'Best for: High-throughput APIs'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      ),
      title: 'Adaptive Limits',
      description: 'AI-powered dynamic rate limiting that adjusts based on traffic patterns.',
      useCase: 'Best for: Auto-scaling applications'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'User-Based Limits',
      description: 'Rate limit per user, per IP, or per API key with flexible policies.',
      useCase: 'Best for: Multi-tenant applications'
    }
  ];

  return (
    <div className="services-page">
      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <div className="pricing-header">
            <h1 className="section-title">Simple, Transparent Pricing</h1>
            <p className="section-subtitle">
              Choose the perfect plan for your needs. All plans include a 14-day free trial.
            </p>
            
            <div className="billing-toggle">
              <button 
                className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly
                <span className="save-badge">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                </div>
                <div className="plan-price">
                  <span className="amount">
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    <small className="currency">৳</small>
                  </span>
                  <span className="period">/month</span>
                </div>
                {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                  <p className="yearly-note">Billed ${plan.yearlyPrice * 12}/year</p>
                )}
                
                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/register">
                  <Button 
                    variant={plan.popular ? 'primary' : 'outline'} 
                    fullWidth 
                    size="large"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="pricing-footer">
            <p>All plans include SSL encryption and 99.9% uptime SLA</p>
          </div>
        </div>
      </section>

      {/* Services/Algorithms Section */}
      <section className="algorithms-section">
        <div className="container">
          <h2 className="section-title">Rate Limiting Algorithms</h2>
          <p className="section-subtitle">
            Choose the right algorithm for your specific use case
          </p>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="use-case">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  {service.useCase}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="container">
          <h2 className="section-title">Compare Plans</h2>
          <p className="section-subtitle">
            See what's included in each plan
          </p>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Starter</th>
                  <th>Professional</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>API Requests/month</td>
                  <td>10,000</td>
                  <td>1,000,000</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>API Keys</td>
                  <td>1</td>
                  <td>10</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Algorithms</td>
                  <td>1</td>
                  <td>All</td>
                  <td>All + Custom</td>
                </tr>
                <tr>
                  <td>Analytics Retention</td>
                  <td>7 days</td>
                  <td>90 days</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Team Members</td>
                  <td>1</td>
                  <td>5</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Support</td>
                  <td>Community</td>
                  <td>Priority Email</td>
                  <td>24/7 Phone</td>
                </tr>
                <tr>
                  <td>SLA</td>
                  <td>—</td>
                  <td>99.9%</td>
                  <td>99.99%</td>
                </tr>
                <tr>
                  <td>Custom Domain</td>
                  <td>—</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Have questions? We're here to help.
          </p>

          <div className="faq-grid">
            <div className="faq-item">
              <h4>How does the free trial work?</h4>
              <p>Start with a 14-day free trial of our Professional plan. No credit card required. You'll have full access to all features during the trial period.</p>
            </div>
            <div className="faq-item">
              <h4>Can I change plans anytime?</h4>
              <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.</p>
            </div>
            <div className="faq-item">
              <h4>What happens if I exceed my limit?</h4>
              <p>We'll notify you when you're close to your limit. If exceeded, requests will be rate-limited with a clear error message. You can upgrade or purchase additional capacity.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer on-premise solutions?</h4>
              <p>Yes, our Enterprise plan includes on-premise deployment options for organizations with specific compliance or infrastructure requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of developers protecting their APIs with RateGuard.</p>
            <div className="cta-actions">
              <Link to="/register">
                <Button size="large">Start Free Trial</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="large">Talk to Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;