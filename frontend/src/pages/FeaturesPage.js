// Made written by ali hasan
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FeaturesPage = () => {
  const { t } = useLanguage();

  const features = [
    { icon: '🏢', title: t('landing.features.profiles.title'), desc: t('landing.features.profiles.description') },
    { icon: '🤝', title: t('landing.features.connections.title'), desc: t('landing.features.connections.description') },
    { icon: '💼', title: t('landing.features.jobs.title'), desc: t('landing.features.jobs.description') },
    { icon: '📅', title: t('landing.features.events.title'), desc: t('landing.features.events.description') },
    { icon: '👥', title: t('landing.features.groups.title'), desc: t('landing.features.groups.description') },
    { icon: '⭐', title: t('landing.features.reviews.title'), desc: t('landing.features.reviews.description') },
    { icon: '📊', title: t('features.analytics'), desc: t('features.analyticsDesc') },
    { icon: '🔒', title: t('features.security'), desc: t('features.securityDesc') },
    { icon: '🌐', title: t('features.global'), desc: t('features.globalDesc') },
  ];

  return (
    <div className="features-page">
      <div className="page-header">
        <h1>{t('features.title')}</h1>
        <p>{t('features.subtitle')}</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
