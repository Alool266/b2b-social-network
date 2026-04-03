// Made written by ali hasan
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LandingPage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: '🏢',
      title: t('landing.features.profiles.title'),
      description: t('landing.features.profiles.description')
    },
    {
      icon: '🤝',
      title: t('landing.features.connections.title'),
      description: t('landing.features.connections.description')
    },
    {
      icon: '💼',
      title: t('landing.features.jobs.title'),
      description: t('landing.features.jobs.description')
    },
    {
      icon: '📅',
      title: t('landing.features.events.title'),
      description: t('landing.features.events.description')
    },
    {
      icon: '👥',
      title: t('landing.features.groups.title'),
      description: t('landing.features.groups.description')
    },
    {
      icon: '⭐',
      title: t('landing.features.reviews.title'),
      description: t('landing.features.reviews.description')
    }
  ];

  const stats = [
    { number: t('landing.stats.companies'), label: t('landing.stats.companiesLabel') },
    { number: t('landing.stats.connections'), label: t('landing.stats.connectionsLabel') },
    { number: t('landing.stats.events'), label: t('landing.stats.eventsLabel') },
    { number: t('landing.stats.industries'), label: t('landing.stats.industriesLabel') }
  ];

  const testimonials = [
    {
      quote: t('landing.testimonials.testimonial1.quote'),
      author: t('landing.testimonials.testimonial1.author'),
      role: t('landing.testimonials.testimonial1.role')
    },
    {
      quote: t('landing.testimonials.testimonial2.quote'),
      author: t('landing.testimonials.testimonial2.author'),
      role: t('landing.testimonials.testimonial2.role')
    },
    {
      quote: t('landing.testimonials.testimonial3.quote'),
      author: t('landing.testimonials.testimonial3.author'),
      role: t('landing.testimonials.testimonial3.role')
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {t('landing.title')} <span className="gradient-text">{t('landing.titleHighlight')}</span>
          </h1>
          <p className="hero-subtitle">
            {t('landing.subtitle')}
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary btn-lg">{t('landing.cta.getStarted')}</Link>
            <Link to="/login" className="btn-outline btn-lg">{t('nav.login')}</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" alt="Business collaboration" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">{t('landing.features.title')}</h2>
        <p className="section-subtitle">{t('landing.features.subtitle')}</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">{t('landing.testimonials.title')}</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>{t('landing.cta.title')}</h2>
          <p>{t('landing.cta.subtitle')}</p>
          <Link to="/register" className="btn-primary btn-lg">{t('landing.cta.createAccount')}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-3d">B2B<span className="brand-highlight">Net</span></span>
            <p>{t('footer.tagline')}</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>{t('footer.platform')}</h4>
              <Link to="/features">{t('footer.features')}</Link>
              <Link to="/pricing">{t('footer.pricing')}</Link>
              <Link to="/about">{t('footer.about')}</Link>
            </div>
            <div className="footer-column">
              <h4>{t('footer.support')}</h4>
              <Link to="/help">{t('footer.helpCenter')}</Link>
              <Link to="/contact">{t('footer.contact')}</Link>
              <Link to="/docs">{t('footer.documentation')}</Link>
            </div>
            <div className="footer-column">
              <h4>{t('footer.legal')}</h4>
              <Link to="/privacy">{t('footer.privacy')}</Link>
              <Link to="/terms">{t('footer.terms')}</Link>
              <Link to="/security">{t('footer.security')}</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer.copyright')} <a href="https://alool266.github.io/portfolio-website/" target="_blank" rel="noopener noreferrer">ali hasan</a></p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
