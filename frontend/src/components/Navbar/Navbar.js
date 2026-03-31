import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { LogIn, LogOut } from 'lucide-react';

import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true); // <-- for scroll effect
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('authChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log('Logout API failed, clearing local state');
    } finally {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      window.dispatchEvent(new Event('authChange'));
      navigate('/login');
    }
  };

  // ------------------- Scroll effect -------------------
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // scrolling down and scrolled at least 100px
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${showNavbar ? 'visible' : 'hidden'}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>GetFlow</span>
        </Link>

        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/services" className="nav-link">Services</Link>
          </div>          
          <div className="navbar-auth">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/main" className="nav-link">Get API</Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span>Logout</span>      
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-outline flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;