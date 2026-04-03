// Made written by ali hasan
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TermsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="terms-page">
      <div className="page-header">
        <h1>{t('terms.title')}</h1>
        <p>{t('terms.subtitle')}</p>
      </div>
      <div className="legal-content">
        <section>
          <h2>{t('terms.acceptance')}</h2>
          <p>{t('terms.acceptanceDesc')}</p>
        </section>
        <section>
          <h2>{t('terms.use')}</h2>
          <p>{t('terms.useDesc')}</p>
        </section>
        <section>
          <h2>{t('terms.accounts')}</h2>
          <p>{t('terms.accountsDesc')}</p>
        </section>
        <section>
          <h2>{t('terms.content')}</h2>
          <p>{t('terms.contentDesc')}</p>
        </section>
        <section>
          <h2>{t('terms.termination')}</h2>
          <p>{t('terms.terminationDesc')}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
