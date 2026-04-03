// Made written by ali hasan
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SecurityPage = () => {
  const { t } = useLanguage();

  return (
    <div className="security-page">
      <div className="page-header">
        <h1>{t('security.title')}</h1>
        <p>{t('security.subtitle')}</p>
      </div>
      <div className="security-content">
        <section>
          <h2>{t('security.encryption')}</h2>
          <p>{t('security.encryptionDesc')}</p>
        </section>
        <section>
          <h2>{t('security.authentication')}</h2>
          <p>{t('security.authenticationDesc')}</p>
        </section>
        <section>
          <h2>{t('security.monitoring')}</h2>
          <p>{t('security.monitoringDesc')}</p>
        </section>
        <section>
          <h2>{t('security.compliance')}</h2>
          <p>{t('security.complianceDesc')}</p>
        </section>
        <section>
          <h2>{t('security.reporting')}</h2>
          <p>{t('security.reportingDesc')}</p>
        </section>
      </div>
    </div>
  );
};

export default SecurityPage;
