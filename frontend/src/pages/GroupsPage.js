// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { groupsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    is_private: false,
  });
  const { t } = useLanguage();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await groupsAPI.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await groupsAPI.create(formData);
      setFormData({ name: '', description: '', industry: '', is_private: false });
      setShowForm(false);
      fetchGroups();
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm(t('groups.deleteConfirm') || 'Are you sure you want to delete this group?')) {
      try {
        await groupsAPI.delete(groupId);
        fetchGroups();
      } catch (err) {
        console.error('Error deleting group:', err);
      }
    }
  };

  return (
    <div className="groups">
      <h1>{t('nav.groups')}</h1>
      
      <button onClick={() => setShowForm(!showForm)} className="btn" style={{ marginBottom: '1rem' }}>
        {showForm ? t('common.cancel') : t('groups.createGroup')}
      </button>

      {showForm && (
        <div className="post-card" style={{ marginBottom: '2rem' }}>
          <h3>{t('groups.createGroup')}</h3>
          <form onSubmit={handleCreateGroup}>
            <div className="form-group">
              <label>{t('groups.name')}</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('groups.description')}</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('groups.industry')}</label>
              <input type="text" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={formData.is_private} onChange={(e) => setFormData({...formData, is_private: e.target.checked})} />
                {t('groups.private')}
              </label>
            </div>
            <button type="submit" className="btn">{t('groups.createGroup')}</button>
          </form>
        </div>
      )}

      {groups.map(group => (
        <div key={group.id} className="group-card">
          <h3>{group.name}</h3>
          <p>{group.description}</p>
          <div className="meta">
            {t('groups.industry')}: {group.industry} | {group.is_private ? t('groups.private') : t('groups.public')}
          </div>
          <button onClick={() => handleDeleteGroup(group.id)} className="btn btn-danger" style={{ marginTop: '0.5rem', width: 'auto' }}>
            {t('common.delete')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default GroupsPage;
