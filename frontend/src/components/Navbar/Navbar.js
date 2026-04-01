import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { LogIn, LogOut, User } from 'lucide-react';

import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // Check auth token + fetch profile
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      const isAuth = !!token;
      
      setIsLoggedIn(isAuth);

      if (isAuth) {
        setIsProfileLoading(true);
        try {
          // Assuming your authAPI has a method for profile, or use axios/fetch directly
          const response = await authAPI.getProfile(); // or fetch('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
          
          const userName = response.data.username;
          
          if (userName) {
            setUserInitial(userName.charAt(0).toUpperCase());
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Optional: If profile fetch fails, you can still keep user logged in or logout
          // setIsLoggedIn(false);
        } finally {
          setIsProfileLoading(false);
        }
      } else {
        setUserInitial('');
      }
    };

    checkAuthAndFetchProfile();

    // Listen for auth changes (e.g. after login/logout)
    const handleAuthChange = () => {
      checkAuthAndFetchProfile();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
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
      setUserInitial('');
      window.dispatchEvent(new Event('authChange'));
      navigate('/login');
    }
  };

  // Scroll effect (unchanged)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Profile Avatar Component
  const ProfileAvatar = () => (
    <div className="profile-avatar" title="Profile">
      {isProfileLoading ? (
        <div className="avatar-circle loading">...</div>
      ) : userInitial ? (
        <div className="avatar-circle">
          {userInitial}
        </div>
      ) : (
        <User size={20} />
      )}
    </div>
  );

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
                <Link to="/main" className="nav-link">Create Apikey</Link>
                
                {/* Profile Link */}
                <Link to="/profile" className="profile-link">
                  <ProfileAvatar />
                </Link>

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
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;