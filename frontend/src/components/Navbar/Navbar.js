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

  // AUTH CHECK
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      const isAuth = !!token;

      setIsLoggedIn(isAuth);

      if (isAuth) {
        setIsProfileLoading(true);
        try {
          const response = await authAPI.getProfile();
          const userName = response.data.username;

          if (userName) {
            setUserInitial(userName.charAt(0).toUpperCase());
          }
        } catch (error) {
          console.log('Profile fetch failed');
        } finally {
          setIsProfileLoading(false);
        }
      } else {
        setUserInitial('');
      }
    };

    checkAuthAndFetchProfile();

    const handleAuthChange = () => checkAuthAndFetchProfile();

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.log('Logout API failed');
    } finally {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setUserInitial('');
      window.dispatchEvent(new Event('authChange'));
      navigate('/login');
    }
  };

  // SCROLL HIDE/SHOW
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setShowNavbar(!(currentScrollY > lastScrollY && currentScrollY > 100));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const ProfileAvatar = () => (
    <div className="profile-avatar">
      {isProfileLoading ? (
        <div className="avatar-circle loading">...</div>
      ) : userInitial ? (
        <div className="avatar-circle">{userInitial}</div>
      ) : (
        <User size={20} />
      )}
    </div>
  );

  return (
    <nav className={`navbar ${showNavbar ? 'visible' : 'hidden'}`}>
      <div className="container navbar-container">

        {/* BRAND */}
        <Link to="/" className="navbar-brand">
          <span>GetFlow</span>
        </Link>

        {/* MENU TOGGLE */}
        <button
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* LINKS */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>

          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/services" className="nav-link">Services</Link>

          </div>

          {/* AUTH SECTION */}
          <div className="navbar-auth">

            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/main" className="nav-link">API Key</Link>

                {/* PROFILE */}
                <Link to="/profile" className="profile-link">
                  <ProfileAvatar />
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline flex items-center gap-2">
                  <LogIn size={18} />
                  Login
                </Link>

                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;