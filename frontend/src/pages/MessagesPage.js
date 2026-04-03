// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { messagesAPI, companiesAPI, connectionsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const MessagesPage = () => {
  const { companyId: selectedCompanyId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(selectedCompanyId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { t } = useLanguage();
  const companyId = localStorage.getItem('company_id');

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchMessages();
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const connectionsRes = await connectionsAPI.getByCompany(companyId);
      const connectedCompanyIds = connectionsRes.data
        .filter(c => c.status === 'accepted')
        .map(c => c.requester_id === companyId ? c.receiver_id : c.requester_id);
      
      const allCompanies = await companiesAPI.getAll();
      setCompanies(allCompanies.data.filter(c => connectedCompanyIds.includes(c.id)));
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await messagesAPI.getConversation(companyId, selectedCompany);
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCompany) return;
    try {
      await messagesAPI.send(companyId, selectedCompany, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="messages">
      <h1>{t('nav.messages')}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1rem' }}>
        <div>
          <h3>{t('messages.conversations')}</h3>
          {companies.map(company => (
            <div
              key={company.id}
              className="connection-card"
              style={{ cursor: 'pointer', background: selectedCompany === company.id ? '#e3f2fd' : 'white' }}
              onClick={() => setSelectedCompany(company.id)}
            >
              {company.name}
            </div>
          ))}
        </div>

        <div>
          {selectedCompany ? (
            <>
              <h3>{t('messages.chatWith')} {companies.find(c => c.id === selectedCompany)?.name}</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
                {messages.map(msg => (
                  <div key={msg.id} className="message-thread" style={{ textAlign: msg.sender_id === companyId ? 'right' : 'left' }}>
                    <p>{msg.content}</p>
                    <div className="meta">{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('messages.typeMessage')}
                  required
                />
                <button type="submit" className="btn" style={{ width: 'auto' }}>{t('messages.send')}</button>
              </form>
            </>
          ) : (
            <p>{t('messages.selectCompany')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
