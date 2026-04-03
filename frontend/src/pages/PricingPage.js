// Made written by ali hasan
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PricingPage = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.free'),
      price: '$0',
      period: t('pricing.perMonth'),
      features: [t('pricing.basicProfile'), t('pricing.limitedConnections'), t('pricing.basicSearch')],
      cta: t('pricing.getStarted'),
      popular: false
    },
    {
      name: t('pricing.pro'),
      price: '$29',
      period: t('pricing.perMonth'),
      features: [t('pricing.enhancedProfile'), t('pricing.unlimitedConnections'), t('pricing.advancedAnalytics'), t('pricing.prioritySupport')],
      cta: t('pricing.startTrial'),
      popular: true
    },
    {
      name: t('pricing.enterprise'),
      price: t('pricing.custom'),
      period: '',
      features: [t('pricing.customIntegrations'), t('pricing.dedicatedSupport'), t('pricing.sla'), t('pricing.apiAccess')],
      cta: t('pricing.contactSales'),
      popular: false
    }
  ];

  return (
    <div className="pricing-page">
      <div className="page-header">
        <h1>{t('pricing.title')}</h1>
        <p>{t('pricing.subtitle')}</p>
      </div>
      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <span className="popular-badge">{t('pricing.mostPopular')}</span>}
            <h2>{plan.name}</h2>
            <div className="price">
              <span className="amount">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>
            <ul className="features-list">
              {plan.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
            <Link to="/register" className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>{plan.cta}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
