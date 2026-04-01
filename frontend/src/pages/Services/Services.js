import React, { useState } from 'react';
import Button from '../../components/button/Button';
import './Services.css';

const Services = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handlePayment = async (planId) => {
    try {
      
      const token = localStorage.getItem("authToken"); // make sure user is logged in
      console.log("token :",token);

      const res = await fetch("http://localhost:8000/api/payment/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          billingCycle
        })
      });

      const data = await res.json();
      console.log("Data : ",data);

      if (data.url) {
        window.location.href = data.url; // redirect to SSLCommerz
      } else {
        alert("Payment initialization failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating payment");
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small projects and testing',
      monthlyPrice: 100,
      yearlyPrice: 80,
      features: [
        '100 API requests/min',
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
      monthlyPrice: 1000,
      yearlyPrice: 900,
      features: [
        '1,000 API requests/min',
        '5 API keys',
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
      monthlyPrice: 2500,
      yearlyPrice: 2000,
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
                    {billingCycle === 'monthly'
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}
                    <small className="currency">৳</small>
                  </span>
                  <span className="period">/month</span>
                </div>

                {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                  <p className="yearly-note">
                    Billed ৳{plan.yearlyPrice * 12}/year
                  </p>
                )}

                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* ✅ PAYMENT BUTTON */}
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  fullWidth
                  size="large"
                  onClick={() => handlePayment(plan.id)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          <div className="pricing-footer">
            <p>All plans include SSL encryption and 99.9% uptime SLA</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;