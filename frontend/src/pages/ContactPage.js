// Made written by ali hasan
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('contact.messageSent'));
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.subtitle')}</p>
      </div>
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-item">
            <h3>{t('contact.email')}</h3>
            <p>support@b2bnet.com</p>
          </div>
          <div className="info-item">
            <h3>{t('contact.phone')}</h3>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="info-item">
            <h3>{t('contact.address')}</h3>
            <p>{t('contact.addressValue')}</p>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>{t('contact.yourName')}</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-field">
            <label>{t('contact.yourEmail')}</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-field">
            <label>{t('contact.subject')}</label>
            <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
          </div>
          <div className="form-field">
            <label>{t('contact.message')}</label>
            <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows="5" required />
          </div>
          <button type="submit" className="btn btn-primary">{t('contact.sendMessage')}</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
