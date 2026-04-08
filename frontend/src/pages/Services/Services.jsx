import React, { useState } from "react";
import Button from "../../components/button/Button";
import { toast } from "react-toastify";
import "./Services.css";
import api from "../../services/api";

const Services = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handlePayment = async (planId) => {
    try {
      const res = await api.post("/payment/init", {
        planId,
        billingCycle,
      });

      const data = res.data;

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Payment URL not received");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Server or network error");
    }
  };

  const plans = [
    {
      id: "free",
      name: "Starter",
      description: "Perfect for small projects and testing",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "100 API requests/min",
        "1 API key",
        "Basic rate limiting",
        "Email support",
        "7-day analytics",
        "Community access",
      ],
      cta: "Free",
    },
    {
      id: "pro",
      name: "Professional",
      description: "Best for growing businesses",
      monthlyPrice: 1000,
      yearlyPrice: 900,
      features: [
        "1,000 API requests/min",
        "5 API keys",
        "Advanced rate limiting",
        "Priority email support",
        "90-day analytics",
        "Custom rules",
        "Webhook alerts",
        "Team collaboration",
      ],
      cta: "Purchase",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large-scale applications",
      monthlyPrice: 2500,
      yearlyPrice: 2000,
      features: [
        "Unlimited API requests",
        "Unlimited API keys",
        "Enterprise rate limiting",
        "24/7 phone support",
        "Unlimited analytics",
        "Custom integrations",
        "SLA guarantee",
        "Dedicated account manager",
        "On-premise option",
      ],
      cta: "Purchase",
      popular: false,
    },
  ];

  return (
    <div className="services-page">
      <section className="pricing-section">
        <div className="container">
          <div className="pricing-header">
            <h1 className="section-title">Simple, Transparent Pricing</h1>
            <p className="section-subtitle">Choose the perfect plan for your needs.</p>

            <div className="billing-toggle">
              <button
                className={`toggle-btn ${billingCycle === "monthly" ? "active" : ""}`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>

              <button
                className={`toggle-btn ${billingCycle === "yearly" ? "active" : ""}`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
                <span className="save-badge">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <div key={plan.id} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}

                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                </div>

                <div className="plan-price">
                  <span className="amount">
                    {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    <small className="currency">৳</small>
                  </span>
                  <span className="period">/month</span>
                </div>

                {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                  <p className="yearly-note">Billed ৳{plan.yearlyPrice * 12}/year</p>
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

                <Button
                  variant={plan.popular ? "primary" : "outline"}
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