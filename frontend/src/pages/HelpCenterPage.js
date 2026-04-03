// Made written by ali hasan
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HelpCenterPage = () => {
  const { t } = useLanguage();

  const faqs = [
    { q: t('help.faq1.q'), a: t('help.faq1.a') },
    { q: t('help.faq2.q'), a: t('help.faq2.a') },
    { q: t('help.faq3.q'), a: t('help.faq3.a') },
    { q: t('help.faq4.q'), a: t('help.faq4.a') },
    { q: t('help.faq5.q'), a: t('help.faq5.a') },
  ];

  return (
    <div className="help-page">
      <div className="page-header">
        <h1>{t('help.title')}</h1>
        <p>{t('help.subtitle')}</p>
      </div>
      <div className="help-content">
        <section className="help-section">
          <h2>{t('help.gettingStarted')}</h2>
          <p>{t('help.gettingStartedDesc')}</p>
        </section>
        <section className="help-section">
          <h2>{t('help.faq')}</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </section>
        <section className="help-section">
          <h2>{t('help.needMoreHelp')}</h2>
          <p>{t('help.needMoreHelpDesc')}</p>
        </section>
      </div>
    </div>
  );
};

export default HelpCenterPage;
