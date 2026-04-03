// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    event_type: 'networking',
    is_virtual: false,
    meeting_link: '',
  });
  const { t } = useLanguage();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventsAPI.create(formData);
      setFormData({ title: '', description: '', event_date: '', location: '', event_type: 'networking', is_virtual: false, meeting_link: '' });
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm(t('events.deleteConfirm') || 'Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(eventId);
        fetchEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  return (
    <div className="events">
      <h1>{t('nav.events')}</h1>
      
      <button onClick={() => setShowForm(!showForm)} className="btn" style={{ marginBottom: '1rem' }}>
        {showForm ? t('common.cancel') : t('events.createEvent')}
      </button>

      {showForm && (
        <div className="post-card" style={{ marginBottom: '2rem' }}>
          <h3>{t('events.createEvent')}</h3>
          <form onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label>{t('events.title')}</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('events.description')}</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('events.datetime')}</label>
              <input type="datetime-local" value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('events.location')}</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('events.type')}</label>
              <select value={formData.event_type} onChange={(e) => setFormData({...formData, event_type: e.target.value})}>
                <option value="networking">{t('events.networking')}</option>
                <option value="conference">{t('events.conference')}</option>
                <option value="webinar">{t('events.webinar')}</option>
                <option value="workshop">{t('events.workshop')}</option>
                <option value="meetup">{t('events.meetup')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={formData.is_virtual} onChange={(e) => setFormData({...formData, is_virtual: e.target.checked})} />
                {t('events.virtual')}
              </label>
            </div>
            {formData.is_virtual && (
              <div className="form-group">
                <label>{t('events.meetingLink')}</label>
                <input type="text" value={formData.meeting_link} onChange={(e) => setFormData({...formData, meeting_link: e.target.value})} />
              </div>
            )}
            <button type="submit" className="btn">{t('events.createEvent')}</button>
          </form>
        </div>
      )}

      {events.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <div className="meta">
            {new Date(event.event_date).toLocaleString()} - {event.location}
            {event.is_virtual && ` (${t('events.virtual')})`}
          </div>
          <button onClick={() => handleDeleteEvent(event.id)} className="btn btn-danger" style={{ marginTop: '0.5rem', width: 'auto' }}>
            {t('common.delete')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default EventsPage;
