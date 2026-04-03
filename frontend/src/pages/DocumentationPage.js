// Made written by ali hasan
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const DocumentationPage = () => {
  const { t } = useLanguage();

  return (
    <div className="docs-page">
      <div className="page-header">
        <h1>{t('docs.title')}</h1>
        <p>{t('docs.subtitle')}</p>
      </div>
      <div className="docs-content">
        <section className="docs-section">
          <h2>{t('docs.gettingStarted')}</h2>
          <p>{t('docs.gettingStartedDesc')}</p>
        </section>
        <section className="docs-section">
          <h2>{t('docs.apiReference')}</h2>
          <p>{t('docs.apiReferenceDesc')}</p>
        </section>
        <section className="docs-section">
          <h2>{t('docs.guides')}</h2>
          <p>{t('docs.guidesDesc')}</p>
        </section>
        <section className="docs-section">
          <h2>{t('docs.support')}</h2>
          <p>{t('docs.supportDesc')}</p>
        </section>
      </div>
    </div>
  );
};

export default DocumentationPage;
