// Made written by ali hasan
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="about-page">
      <div className="page-header">
        <h1>{t('about.title')}</h1>
        <p>{t('about.subtitle')}</p>
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>{t('about.mission')}</h2>
          <p>{t('about.missionDesc')}</p>
        </section>
        <section className="about-section">
          <h2>{t('about.vision')}</h2>
          <p>{t('about.visionDesc')}</p>
        </section>
        <section className="about-section">
          <h2>{t('about.values')}</h2>
          <ul>
            <li><strong>{t('about.trust')}:</strong> {t('about.trustDesc')}</li>
            <li><strong>{t('about.innovation')}:</strong> {t('about.innovationDesc')}</li>
            <li><strong>{t('about.community')}:</strong> {t('about.communityDesc')}</li>
            <li><strong>{t('about.excellence')}:</strong> {t('about.excellenceDesc')}</li>
          </ul>
        </section>
        <section className="about-section">
          <h2>{t('about.team')}</h2>
          <p>{t('about.teamDesc')}</p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
