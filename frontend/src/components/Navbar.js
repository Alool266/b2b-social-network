// Made written by ali hasan
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const navigate = useNavigate();
  const { language, direction, toggleLanguage, t } = useLanguage();

  React.useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem('access_token');
      const role = localStorage.getItem('role');
      setIsLoggedIn(!!token);
      setIsAdmin(role === 'admin');
    };

    updateAuthState();
    window.addEventListener('storage', updateAuthState);
    return () => window.removeEventListener('storage', updateAuthState);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="header" dir={direction}>
      <div className="header-container">
        <Link to="/" className="header-brand">
          <span className="brand-3d">B2B<span className="brand-highlight">Net</span></span>
        </Link>
        
        <nav className="header-nav">
          <div className="language-switcher" onClick={toggleLanguage} role="button" tabIndex={0} aria-label="Switch language">
            <svg className="globe-icon" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" title="Switch language">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span className={`lang-label ${language === 'en' ? 'active' : ''}`}>EN</span>
            <div className="switch-toggle">
              <div className="switch-thumb"></div>
            </div>
            <span className={`lang-label ${language === 'ar' ? 'active' : ''}`}>عربي</span>
          </div>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link">{t('nav.dashboard')}</Link>
              <Link to="/feed" className="nav-link">{t('nav.feed')}</Link>
              <Link to="/connections" className="nav-link">{t('nav.connections')}</Link>
              <Link to="/messages" className="nav-link">{t('nav.messages')}</Link>
              <Link to="/jobs" className="nav-link">{t('nav.jobs')}</Link>
              <Link to="/events" className="nav-link">{t('nav.events')}</Link>
              <Link to="/groups" className="nav-link">{t('nav.groups')}</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">
                  <svg className="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  {t('nav.admin')}
                </Link>
              )}
              <button onClick={handleLogout} className="btn-outline">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary btn-sm">{t('nav.register')}</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
