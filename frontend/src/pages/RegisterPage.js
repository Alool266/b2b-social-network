// Made written by ali hasan
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: '',
    location: '',
    size: '',
    logo_url: '',
    email: '',
    password: '',
    user_name: '',
  });
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(formData);
      navigate('/login');
    } catch (err) {
      setError(t('auth.registrationFailed'));
    }
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-content">
          <div className="auth-logo">
            <h1 className="brand-3d">B2B<span className="brand-highlight">Net</span></h1>
          </div>
          <h2 className="auth-title">{t('auth.createAccount')}</h2>
          <p className="auth-subtitle">{t('auth.joinBusinesses')}</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <div className="auth-steps">
            <div className={`step ${step === 1 ? 'active' : ''}`}>{t('auth.companyInfo')}</div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>{t('auth.accountDetails')}</div>
          </div>
          
          <form onSubmit={handleRegister} className="auth-form">
            {step === 1 ? (
              <>
                <div className="form-field">
                  <label htmlFor="name">{t('auth.companyName')}</label>
                  <input 
                    id="name"
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder={t('auth.companyPlaceholder')}
                    required 
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="industry">{t('auth.industry')}</label>
                  <select id="industry" name="industry" value={formData.industry} onChange={handleChange}>
                    <option value="">{t('auth.selectIndustry')}</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="description">{t('auth.description')}</label>
                  <textarea 
                    id="description"
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder={t('auth.descriptionPlaceholder')}
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="website">{t('auth.website')}</label>
                    <input 
                      id="website"
                      type="url" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      placeholder={t('auth.websitePlaceholder')}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="location">{t('auth.location')}</label>
                    <input 
                      id="location"
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange} 
                      placeholder={t('auth.locationPlaceholder')}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="size">{t('auth.companySize')}</label>
                  <select id="size" name="size" value={formData.size} onChange={handleChange}>
                    <option value="">{t('auth.selectSize')}</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <button type="button" className="btn-primary btn-large btn-block" onClick={nextStep}>{t('auth.continueAccount')}</button>
              </>
            ) : (
              <>
                <div className="form-field">
                  <label htmlFor="user_name">{t('auth.yourName')}</label>
                  <input 
                    id="user_name"
                    type="text" 
                    name="user_name" 
                    value={formData.user_name} 
                    onChange={handleChange} 
                    placeholder={t('auth.namePlaceholder')}
                    required 
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">{t('auth.email')}</label>
                  <input 
                    id="email"
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder={t('auth.emailPlaceholder')}
                    required 
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="password">{t('auth.password')}</label>
                  <input 
                    id="password"
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder={t('auth.passwordPlaceholder')}
                    required 
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="logo_url">{t('auth.logoUrl')}</label>
                  <input 
                    id="logo_url"
                    type="text" 
                    name="logo_url" 
                    value={formData.logo_url} 
                    onChange={handleChange} 
                    placeholder={t('auth.logoPlaceholder')}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary btn-large" onClick={prevStep}>{t('common.back')}</button>
                  <button type="submit" className="btn-primary btn-large">{t('auth.createAccount')}</button>
                </div>
              </>
            )}
          </form>
          
          <div className="auth-divider">
            <span>{t('auth.or')}</span>
          </div>
          
          <Link to="/login" className="btn-secondary btn-large btn-block">
            {t('auth.signInInstead')}
          </Link>
          
          <p className="auth-footer">
            {t('auth.haveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
          </p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-image">
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80" alt="Business meeting" />
          <div className="auth-image-overlay">
            <h2>{t('auth.growBusiness')}</h2>
            <p>{t('auth.connectPartners')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
