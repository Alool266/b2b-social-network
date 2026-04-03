// Made written by ali hasan
import React, { useState } from 'react';
import { searchAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [results, setResults] = useState(null);
  const { t } = useLanguage();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const response = await searchAPI.global(query, type || null);
      setResults(response.data);
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  return (
    <div className="search-container">
      <h1>{t('nav.search')}</h1>
      
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <option value="">{t('search.all')}</option>
          <option value="companies">{t('nav.companies')}</option>
          <option value="posts">{t('nav.feed')}</option>
          <option value="jobs">{t('nav.jobs')}</option>
          <option value="events">{t('nav.events')}</option>
          <option value="groups">{t('nav.groups')}</option>
        </select>
        <button type="submit" className="btn" style={{ width: 'auto' }}>{t('common.search')}</button>
      </form>

      {results && (
        <div>
          {results.companies && results.companies.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2>{t('nav.companies')}</h2>
              {results.companies.map(company => (
                <div key={company.id} className="connection-card">
                  <Link to={`/profile/${company.id}`}>{company.name}</Link>
                  <span>{company.industry}</span>
                </div>
              ))}
            </div>
          )}

          {results.posts && results.posts.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2>{t('nav.feed')}</h2>
              {results.posts.map(post => (
                <div key={post.id} className="post-card">
                  <p>{post.content}</p>
                  <div className="meta">{new Date(post.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}

          {results.jobs && results.jobs.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2>{t('nav.jobs')}</h2>
              {results.jobs.map(job => (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.location} - {job.job_type}</p>
                </div>
              ))}
            </div>
          )}

          {results.events && results.events.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2>{t('nav.events')}</h2>
              {results.events.map(event => (
                <div key={event.id} className="event-card">
                  <h3>{event.title}</h3>
                  <p>{new Date(event.event_date).toLocaleDateString()} - {event.location}</p>
                </div>
              ))}
            </div>
          )}

          {results.groups && results.groups.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2>{t('nav.groups')}</h2>
              {results.groups.map(group => (
                <div key={group.id} className="group-card">
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                </div>
              ))}
            </div>
          )}

          {!results.companies?.length && !results.posts?.length && !results.jobs?.length && !results.events?.length && !results.groups?.length && (
            <p>{t('search.noResults')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
