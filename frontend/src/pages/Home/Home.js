import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLink, FiSettings, FiBarChart2 } from "react-icons/fi";
import Spline from "@splinetool/react-spline";
import "./Home.css";

export default function Home() {
  const location = useLocation();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [loading, setLoading] = useState(true);

  // ✅ Handle payment status from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      setAlertMessage("Payment Successful!");
      setShowAlert(true);
    } else if (paymentStatus === "failed") {
      setAlertMessage("Payment Failed!");
      setShowAlert(true);
    } else if (paymentStatus === "cancelled") {
      setAlertMessage("Payment Cancelled!");
      setShowAlert(true);
    }

    if (paymentStatus) {
      // auto hide after 5 seconds
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const handleSplineLoad = () => {
    console.log("Spline scene loaded successfully!");
    setLoading(false);
  };

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 8000);

    return () => clearTimeout(fallbackTimer);
  }, [loading]);

  return (
    <div className="home">

      {loading && (
        <div className="preloader">
          <div className="loader"></div>
          <p>Loading 3D scene...</p>
        </div>
      )}

      {/* ✅ Alert */}
      {showAlert && (
        <div className="success-alert">
          {alertMessage}
        </div>
      )}

      <div className="landing">
        <section className="hero">
          <div className="hero-left">
            <h1>
              Control Your <span>API Traffic</span><br />
              Scale Without Fear
            </h1>

            <p>
              A high-performance distributed Rate Limiter microservice
              built for modern companies.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">
                <Link to="/services">Get Started</Link>
              </button>
              <button className="secondary-btn">View Docs</button>
            </div>
          </div>

          <div className="hero-right">
            <Spline
              className="sp-bot"
              scene="https://prod.spline.design/GAMMydgfkQs4zK5r/scene.splinecode"
              onLoad={handleSplineLoad}
            />
          </div>
        </section>

        {/* باقي sections unchanged */}
      </div>
    </div>
  );
}