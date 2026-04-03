// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companiesAPI, connectionsAPI, reviewsAPI, badgesAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [connections, setConnections] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [badges, setBadges] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const { t } = useLanguage();
  const currentCompanyId = localStorage.getItem('company_id');

  useEffect(() => {
    fetchProfileData();
  }, [companyId]);

  const fetchProfileData = async () => {
    try {
      const [companyRes, connectionsRes, reviewsRes, badgesRes] = await Promise.all([
        companiesAPI.getById(companyId),
        connectionsAPI.getByCompany(companyId),
        reviewsAPI.getByCompany(companyId),
        badgesAPI.getAll(),
      ]);
      setCompany(companyRes.data);
      setConnections(connectionsRes.data.filter(c => c.status === 'accepted'));
      setReviews(reviewsRes.data);
      setBadges(badgesRes.data);
      
      // Check connection status
      const existing = connectionsRes.data.find(
        c => (c.requester_id === currentCompanyId || c.receiver_id === currentCompanyId) && c.status === 'pending'
      );
      if (existing) {
        setConnectionStatus(existing.requester_id === currentCompanyId ? 'requested' : 'pending');
      } else {
        const accepted = connectionsRes.data.find(
          c => (c.requester_id === currentCompanyId && c.receiver_id === companyId) || (c.requester_id === companyId && c.receiver_id === currentCompanyId)
        );
        if (accepted) setConnectionStatus('accepted');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleSendRequest = async () => {
    try {
      await connectionsAPI.sendRequest(currentCompanyId, companyId);
      setConnectionStatus('requested');
      alert(t('common.success') || 'Connection request sent!');
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  return (
    <div className="profile">
      {!company ? (
        <div>{t('common.loading')}</div>
      ) : (
        <>
          <h1>{company.name} {company.is_verified && <span className="badge">✓ {t('profile.verified')}</span>}</h1>
          
          <div className="profile-info">
            <div><label>{t('profile.industry')}:</label> {company.industry || t('profile.notSpecified')}</div>
            <div><label>{t('profile.location')}:</label> {company.location || t('profile.notSpecified')}</div>
            <div><label>{t('profile.size')}:</label> {company.size || t('profile.notSpecified')}</div>
            <div><label>{t('profile.website')}:</label> {company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a> : t('profile.notSpecified')}</div>
            <div style={{ gridColumn: '1 / -1' }}><label>{t('profile.description')}:</label> {company.description || t('profile.noDescription')}</div>
          </div>

          {badges.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3>{t('profile.badges')}</h3>
              {badges.map(badge => (
                <span key={badge.id} className="badge">{badge.name}</span>
              ))}
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h2>{t('profile.connections')} ({connections.length})</h2>
            {connections.length === 0 ? (
              <p>{t('profile.noConnections')}</p>
            ) : (
              connections.map(conn => (
                <div key={conn.id} className="connection-card">
                  <span>{t('profile.connectionId')}: {conn.requester_id === companyId ? conn.receiver_id : conn.requester_id}</span>
                  <span>{t('profile.status')}: {conn.status}</span>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h2>{t('profile.reviews')} ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p>{t('profile.noReviews')}</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <p>{review.comment}</p>
                  <div className="meta">{t('profile.reviewer')}: {review.reviewer_id}</div>
                </div>
              ))
            )}
          </div>

          {currentCompanyId !== companyId && (
            <div style={{ marginTop: '2rem' }}>
              {connectionStatus === 'accepted' ? (
                <p>✓ {t('profile.connected')}</p>
              ) : connectionStatus === 'requested' ? (
                <p>{t('profile.requestSent')}</p>
              ) : (
                <button onClick={handleSendRequest} className="btn">{t('profile.sendRequest')}</button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
