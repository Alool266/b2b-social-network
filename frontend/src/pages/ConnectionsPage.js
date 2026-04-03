// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { connectionsAPI, companiesAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newRequestCompanyId, setNewRequestCompanyId] = useState('');
  const { t } = useLanguage();
  const companyId = localStorage.getItem('company_id');

  useEffect(() => {
    fetchConnections();
    fetchCompanies();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await connectionsAPI.getByCompany(companyId);
      setConnections(response.data.filter(c => c.status === 'accepted'));
      setPendingRequests(response.data.filter(c => c.status === 'pending' && c.receiver_id === companyId));
    } catch (err) {
      console.error('Error fetching connections:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companiesAPI.getAll();
      setCompanies(response.data.filter(c => c.id !== companyId));
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!newRequestCompanyId) return;
    try {
      await connectionsAPI.sendRequest(companyId, newRequestCompanyId);
      setNewRequestCompanyId('');
      fetchConnections();
      alert(t('connections.requestSent') || 'Connection request sent!');
    } catch (err) {
      alert(t('connections.requestFailed') || 'Failed to send request. It may already exist.');
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      await connectionsAPI.accept(connectionId);
      fetchConnections();
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleRejectRequest = async (connectionId) => {
    try {
      await connectionsAPI.reject(connectionId);
      fetchConnections();
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    if (window.confirm(t('connections.removeConfirm') || 'Are you sure you want to remove this connection?')) {
      try {
        await connectionsAPI.remove(connectionId);
        fetchConnections();
      } catch (err) {
        console.error('Error removing connection:', err);
      }
    }
  };

  return (
    <div className="connections">
      <h1>{t('nav.connections')}</h1>

      <div className="post-card" style={{ marginBottom: '2rem' }}>
        <h3>{t('connections.sendRequest')}</h3>
        <form onSubmit={handleSendRequest}>
          <div className="form-group">
            <select value={newRequestCompanyId} onChange={(e) => setNewRequestCompanyId(e.target.value)} required>
              <option value="">{t('connections.selectCompany')}</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name} - {company.industry}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn">{t('connections.sendRequestButton')}</button>
        </form>
      </div>

      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>{t('connections.pendingRequests')} ({pendingRequests.length})</h2>
          {pendingRequests.map(request => (
            <div key={request.id} className="connection-card">
              <div>
                <strong>{t('connections.from')}:</strong> {request.requester_id}
                <div className="meta">{new Date(request.created_at).toLocaleDateString()}</div>
              </div>
              <div>
                <button onClick={() => handleAcceptRequest(request.id)} className="btn" style={{ marginRight: '0.5rem' }}>{t('connections.accept')}</button>
                <button onClick={() => handleRejectRequest(request.id)} className="btn btn-danger">{t('connections.reject')}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2>{t('connections.yourConnections')} ({connections.length})</h2>
        {connections.length === 0 ? (
          <p>{t('connections.noConnections')}</p>
        ) : (
          connections.map(conn => (
            <div key={conn.id} className="connection-card">
              <div>
                <strong>{t('connections.connectedWith')}:</strong> {conn.requester_id === companyId ? conn.receiver_id : conn.requester_id}
                <div className="meta">{t('connections.connectedOn')} {new Date(conn.created_at).toLocaleDateString()}</div>
              </div>
              <button onClick={() => handleRemoveConnection(conn.id)} className="btn btn-danger">{t('connections.remove')}</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
