import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import { useLocation } from 'react-router-dom';
import { FiLink, FiSettings, FiBarChart2 } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Button from '../../components/button/Button';
import Spline from "@splinetool/react-spline";
import "./Home.css";

export default function Home() {
  const location = useLocation();
  
  // 1. Initialize visibility state based on if a message exists in location.state
  const [showAlert, setShowAlert] = useState(!!location.state?.message);

  // 2. Setup the auto-dismiss timer
  useEffect(() => {
    if (location.state?.message) {
      setShowAlert(true); // Ensure it shows if navigation happens again

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000); // Alert disappears after 5 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [location.state]);

  return (
    <div className="home">
      {/* 3. Render alert only if showAlert is true */}
      {showAlert && (
        <div className="success-alert">
          {location.state.message}
        </div>
      )}

      <div className="landing">
        {/* ================= HERO SECTION ================= */}
        <section className="hero">
          <div className="hero-left">
            <h1>
              Control Your <span>API Traffic</span><br />
              Scale Without Fear
            </h1>
            <p>
              A high-performance distributed Rate Limiter microservice
              built for modern companies. Protect your APIs,
              prevent abuse, and manage traffic intelligently.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">Get Started</button>
              <button className="secondary-btn">View Docs</button>
            </div>
          </div>

          <div className="hero-right">
            <Spline className='sp-bot' scene="https://prod.spline.design/GAMMydgfkQs4zK5r/scene.splinecode" />
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="features">
          <h2>Why Choose Our Rate Limiter?</h2>

          <div className="feature-grid">
            <div className="card">
              <h3>⚡ Ultra Fast</h3>
              <p>Handles millions of requests with minimal latency.</p>
            </div>

            <div className="card">
              <h3>🛡 Secure</h3>
              <p>Prevents DDoS, brute-force and API abuse automatically.</p>
            </div>

            <div className="card">
              <h3>📊 Real-Time Analytics</h3>
              <p>Monitor traffic spikes and user behavior instantly.</p>
            </div>

            <div className="card">
              <h3>🌍 Distributed</h3>
              <p>Scalable microservice architecture for enterprise systems.</p>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="how">
          <h2>How It Works</h2>

          <div className="steps">
            <div className="step">
              <div className="icon">
                <FiLink />
              </div>
              <h4>1. Integrate</h4>
              <p>Plug our microservice into your API gateway.</p>
            </div>

            <div className="step">
              <div className="icon">
                <FiSettings />
              </div>
              <h4>2. Configure</h4>
              <p>Set limits per user, IP, or token.</p>
            </div>

            <div className="step">
              <div className="icon">
                <FiBarChart2 />
              </div>
              <h4>3. Monitor</h4>
              <p>Track traffic with real-time dashboards.</p>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="cta">
          <h2>Ready to Protect Your APIs?</h2>
          <button className="primary-btn">Start Free Trial</button>
        </section>
      </div>
    </div>
  );
}
