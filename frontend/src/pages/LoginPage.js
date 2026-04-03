// Made written by ali hasan
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('company_id', response.data.company_id);
      localStorage.setItem('role', response.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-content">
          <div className="auth-logo">
            <h1 className="brand-3d">B2B<span className="brand-highlight">Net</span></h1>
          </div>
          <h2 className="auth-title">{t('auth.welcomeBack')}</h2>
          <p className="auth-subtitle">{t('auth.signInSubtitle')}</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-field">
              <label htmlFor="email">{t('auth.email')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">{t('auth.password')}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>
            <button type="submit" className="btn-primary btn-large">{t('auth.signIn')}</button>
          </form>
          
          <div className="auth-divider">
            <span>{t('auth.or')}</span>
          </div>
          
          <Link to="/register" className="btn-secondary btn-large btn-block">
            {t('auth.createAccount')}
          </Link>
          
          <p className="auth-footer">
            {t('auth.noAccount')} <Link to="/register">{t('auth.registerHere')}</Link>
          </p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-image">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" alt="Modern office" />
          <div className="auth-image-overlay">
            <h2>{t('auth.connectBusinesses')}</h2>
            <p>{t('auth.joinCompanies')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
