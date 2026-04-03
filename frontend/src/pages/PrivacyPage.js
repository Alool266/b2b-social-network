// Made written by ali hasan
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPage = () => {
  const { t } = useLanguage();

  return (
    <div className="privacy-page">
      <div className="page-header">
        <h1>{t('privacy.title')}</h1>
        <p>{t('privacy.subtitle')}</p>
      </div>
      <div className="legal-content">
        <section>
          <h2>{t('privacy.collection')}</h2>
          <p>{t('privacy.collectionDesc')}</p>
        </section>
        <section>
          <h2>{t('privacy.usage')}</h2>
          <p>{t('privacy.usageDesc')}</p>
        </section>
        <section>
          <h2>{t('privacy.sharing')}</h2>
          <p>{t('privacy.sharingDesc')}</p>
        </section>
        <section>
          <h2>{t('privacy.security')}</h2>
          <p>{t('privacy.securityDesc')}</p>
        </section>
        <section>
          <h2>{t('privacy.rights')}</h2>
          <p>{t('privacy.rightsDesc')}</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
