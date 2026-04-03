// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companiesAPI, postsAPI, connectionsAPI, jobsAPI, eventsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const DashboardPage = () => {
  const [company, setCompany] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const { t } = useLanguage();
  const companyId = localStorage.getItem('company_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, postsRes, connectionsRes, jobsRes, eventsRes] = await Promise.all([
          companiesAPI.getById(companyId),
          postsAPI.getAll(),
          connectionsAPI.getByCompany(companyId),
          jobsAPI.getAll(),
          eventsAPI.getAll(),
        ]);
        setCompany(companyRes.data);
        setPosts(postsRes.data.slice(0, 5));
        setConnections(connectionsRes.data.filter(c => c.status === 'accepted'));
        setJobs(jobsRes.data.slice(0, 3));
        setEvents(eventsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchData();
  }, [companyId]);

  if (!company) return <div className="dashboard">{t('common.loading')}</div>;

  return (
    <div className="dashboard">
      <h1>{t('dashboard.welcome')}, {company.name}</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{connections.length}</h3>
          <p>{t('dashboard.stats.connections')}</p>
        </div>
        <div className="stat-card">
          <h3>{posts.length}</h3>
          <p>{t('dashboard.stats.posts')}</p>
        </div>
        <div className="stat-card">
          <h3>{jobs.length}</h3>
          <p>{t('dashboard.stats.jobs')}</p>
        </div>
        <div className="stat-card">
          <h3>{events.length}</h3>
          <p>{t('dashboard.stats.events')}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h2>{t('dashboard.recentPosts')}</h2>
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <p>{post.content}</p>
              <div className="meta">{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
          ))}
          <Link to="/feed">{t('dashboard.viewAllPosts')}</Link>
        </div>

        <div>
          <h2>{t('dashboard.latestJobs')}</h2>
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.location} - {job.job_type}</p>
            </div>
          ))}
          <Link to="/jobs">{t('dashboard.viewAllJobs')}</Link>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>{t('dashboard.upcomingEvents')}</h2>
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{new Date(event.event_date).toLocaleDateString()} - {event.location}</p>
          </div>
        ))}
        <Link to="/events">{t('dashboard.viewAllEvents')}</Link>
      </div>
    </div>
  );
};

export default DashboardPage;
