// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { jobsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: 'full-time',
    salary_range: '',
  });
  const { t } = useLanguage();
  const companyId = localStorage.getItem('company_id');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await jobsAPI.create(companyId, formData);
      setFormData({ title: '', description: '', requirements: '', location: '', job_type: 'full-time', salary_range: '' });
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm(t('jobs.deleteConfirm') || 'Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.delete(jobId);
        fetchJobs();
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  return (
    <div className="jobs">
      <h1>{t('nav.jobs')}</h1>
      
      <button onClick={() => setShowForm(!showForm)} className="btn" style={{ marginBottom: '1rem' }}>
        {showForm ? t('common.cancel') : t('jobs.postJob')}
      </button>

      {showForm && (
        <div className="post-card" style={{ marginBottom: '2rem' }}>
          <h3>{t('jobs.createPosting')}</h3>
          <form onSubmit={handleCreateJob}>
            <div className="form-group">
              <label>{t('jobs.title')}</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('jobs.description')}</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('jobs.requirements')}</label>
              <textarea value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{t('jobs.location')}</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('jobs.type')}</label>
              <select value={formData.job_type} onChange={(e) => setFormData({...formData, job_type: e.target.value})}>
                <option value="full-time">{t('jobs.fullTime')}</option>
                <option value="part-time">{t('jobs.partTime')}</option>
                <option value="contract">{t('jobs.contract')}</option>
                <option value="freelance">{t('jobs.freelance')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('jobs.salary')}</label>
              <input type="text" value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
            </div>
            <button type="submit" className="btn">{t('jobs.postJob')}</button>
          </form>
        </div>
      )}

      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <div className="meta">
            {job.location} - {t(`jobs.${job.job_type}`)} {job.salary_range && `| ${job.salary_range}`}
          </div>
          {job.company_id === companyId && (
            <button onClick={() => handleDeleteJob(job.id)} className="btn btn-danger" style={{ marginTop: '0.5rem', width: 'auto' }}>
              {t('common.delete')}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default JobsPage;
