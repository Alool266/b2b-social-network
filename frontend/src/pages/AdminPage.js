// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const AdminPage = () => {
  const { t } = useLanguage();
  const role = localStorage.getItem('role');

  if (role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h1>⛔ Access Denied</h1>
          <p>{t('admin.accessDenied') || 'You do not have permission to access this page.'}</p>
        </div>
      </div>
    );
  }

  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [systemLogs, setSystemLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, companiesRes, postsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getCompanies(),
        adminAPI.getPosts(),
        adminAPI.getUsers(),
      ]);
      setStats(statsRes.data);
      setCompanies(companiesRes.data);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await adminAPI.getEvents?.();
      if (response) setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await adminAPI.getGroups?.();
      if (response) setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await adminAPI.getJobs?.();
      if (response) setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm(t('admin.deleteCompanyConfirm'))) {
      try {
        await adminAPI.deleteCompany(companyId);
        fetchAdminData();
      } catch (err) {
        console.error('Error deleting company:', err);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm(t('admin.deletePostConfirm'))) {
      try {
        await adminAPI.deletePost(postId);
        fetchAdminData();
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await adminAPI.updateUserRole(userId, role);
      fetchAdminData();
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  const handleBanUser = async (userId) => {
    if (window.confirm(t('admin.banConfirm').replace('{type}', t('nav.users')))) {
      try {
        await adminAPI.banUser?.(userId);
        fetchAdminData();
      } catch (err) {
        console.error('Error banning user:', err);
      }
    }
  };

  const handleUnbanUser = async (userId) => {
    if (window.confirm(t('admin.unbanConfirm').replace('{type}', t('nav.users')))) {
      try {
        await adminAPI.unbanUser?.(userId);
        fetchAdminData();
      } catch (err) {
        console.error('Error unbanning user:', err);
      }
    }
  };

  const handleBanCompany = async (companyId) => {
    if (window.confirm(t('admin.banConfirm').replace('{type}', t('nav.companies')))) {
      try {
        await adminAPI.banCompany?.(companyId);
        fetchAdminData();
      } catch (err) {
        console.error('Error banning company:', err);
      }
    }
  };

  const handleUnbanCompany = async (companyId) => {
    if (window.confirm(t('admin.unbanConfirm').replace('{type}', t('nav.companies')))) {
      try {
        await adminAPI.unbanCompany?.(companyId);
        fetchAdminData();
      } catch (err) {
        console.error('Error unbanning company:', err);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm(t('admin.deleteEventConfirm'))) {
      try {
        await adminAPI.deleteEvent?.(eventId);
        fetchEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm(t('admin.deleteGroupConfirm'))) {
      try {
        await adminAPI.deleteGroup?.(groupId);
        fetchGroups();
      } catch (err) {
        console.error('Error deleting group:', err);
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm(t('admin.deleteJobConfirm'))) {
      try {
        await adminAPI.deleteJob?.(jobId);
        fetchJobs();
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      await adminAPI.toggleMaintenance?.(!maintenanceMode);
      setMaintenanceMode(!maintenanceMode);
    } catch (err) {
      console.error('Error toggling maintenance mode:', err);
    }
  };

  const handleToggleRegistration = async () => {
    try {
      await adminAPI.toggleRegistration?.(!registrationOpen);
      setRegistrationOpen(!registrationOpen);
    } catch (err) {
      console.error('Error toggling registration:', err);
    }
  };

  const handleSelectAll = (items) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = async (type, deleteFn) => {
    if (window.confirm(t('admin.deleteConfirm'))) {
      try {
        for (const id of selectedItems) {
          await deleteFn(id);
        }
        setSelectedItems([]);
        fetchAdminData();
      } catch (err) {
        console.error('Error bulk deleting:', err);
      }
    }
  };

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'banned': 'status-banned',
      'pending': 'status-pending',
      'approved': 'status-approved',
      'rejected': 'status-rejected'
    };
    return <span className={`status-badge ${statusMap[status] || ''}`}>{t(`admin.${status}`) || status}</span>;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>{t('nav.admin')}</h1>
        <div className="admin-header-actions">
          <button onClick={() => setShowSettings(!showSettings)} className="btn btn-outline">
            {t('admin.settings')}
          </button>
          <button onClick={() => setShowLogs(!showLogs)} className="btn btn-outline">
            {t('admin.systemLogs')}
          </button>
        </div>
      </div>

      {maintenanceMode && (
        <div className="maintenance-warning">
          ⚠️ {t('admin.maintenanceWarning')}
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h2>{t('admin.siteSettings')}</h2>
          <div className="setting-item">
            <div>
              <h3>{t('admin.maintenanceMode')}</h3>
              <p>{maintenanceMode ? t('admin.enableMaintenance') : t('admin.disableMaintenance')}</p>
            </div>
            <button onClick={handleToggleMaintenance} className={`toggle-btn ${maintenanceMode ? 'active' : ''}`}>
              {maintenanceMode ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="setting-item">
            <div>
              <h3>{t('admin.registrationOpen')}</h3>
              <p>{t('admin.registrationOpenDesc')}</p>
            </div>
            <button onClick={handleToggleRegistration} className={`toggle-btn ${registrationOpen ? 'active' : ''}`}>
              {registrationOpen ? t('admin.registrationOpen') : t('admin.registrationClosed')}
            </button>
          </div>
          <div className="settings-actions">
            <button className="btn btn-outline">{t('admin.exportData')}</button>
            <button className="btn btn-outline">{t('admin.importData')}</button>
            <button className="btn btn-outline">{t('admin.createBackup')}</button>
            <button className="btn btn-outline">{t('admin.restoreBackup')}</button>
          </div>
        </div>
      )}

      {/* System Logs Panel */}
      {showLogs && (
        <div className="logs-panel">
          <div className="logs-header">
            <h2>{t('admin.systemLogs')}</h2>
            <div>
              <button className="btn btn-outline" style={{ marginRight: '0.5rem' }}>{t('admin.clearLogs')}</button>
              <button className="btn btn-outline">{t('admin.exportData')}</button>
            </div>
          </div>
          <div className="logs-content">
            <p>{t('admin.loading')}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('stats')} className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}>
          📊 {t('admin.stats')}
        </button>
        <button onClick={() => setActiveTab('companies')} className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}>
          🏢 {t('nav.companies')}
        </button>
        <button onClick={() => setActiveTab('users')} className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}>
          👤 {t('nav.users')}
        </button>
        <button onClick={() => setActiveTab('posts')} className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}>
          📝 {t('nav.feed')}
        </button>
        <button onClick={() => { setActiveTab('events'); fetchEvents(); }} className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}>
          📅 {t('nav.events')}
        </button>
        <button onClick={() => { setActiveTab('groups'); fetchGroups(); }} className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}>
          👥 {t('nav.groups')}
        </button>
        <button onClick={() => { setActiveTab('jobs'); fetchJobs(); }} className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}>
          💼 {t('nav.jobs')}
        </button>
      </div>

      {/* Search and Filter Bar */}
      {activeTab !== 'stats' && (
        <div className="admin-toolbar">
          <div className="search-bar">
            <input
              type="text"
              placeholder={t('admin.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-bar">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">{t('admin.all')}</option>
              <option value="active">{t('admin.active')}</option>
              <option value="inactive">{t('admin.inactive')}</option>
              <option value="banned">{t('admin.banned')}</option>
              <option value="pending">{t('admin.pending')}</option>
            </select>
          </div>
          {selectedItems.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedItems.length} {t('admin.bulkActions').toLowerCase()}</span>
              <button className="btn btn-danger">{t('admin.deleteSelected')}</button>
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <h3>{stats.total_companies}</h3>
            <p>{t('admin.totalCompanies')}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <h3>{stats.total_users}</h3>
            <p>{t('admin.totalUsers')}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <h3>{stats.total_posts}</h3>
            <p>{t('admin.totalPosts')}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🤝</div>
            <h3>{stats.total_connections}</h3>
            <p>{t('admin.totalConnections')}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <h3>{stats.total_jobs}</h3>
            <p>{t('admin.totalJobs')}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <h3>{stats.total_events}</h3>
            <p>{t('admin.totalEvents')}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>{stats.total_groups}</h3>
            <p>{t('admin.totalGroups')}</p>
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>{t('admin.manageCompanies')}</h2>
            <button className="btn btn-primary">{t('admin.addNew')}</button>
          </div>
          <div className="select-all-bar">
            <input
              type="checkbox"
              checked={selectedItems.length === companies.length && companies.length > 0}
              onChange={() => handleSelectAll(companies)}
            />
            <span>{t('admin.selectAll')}</span>
          </div>
          {filterItems(companies).map(company => (
            <div key={company.id} className={`admin-item ${selectedItems.includes(company.id) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={selectedItems.includes(company.id)}
                onChange={() => handleSelectItem(company.id)}
              />
              <div className="item-info">
                <strong>{company.name}</strong>
                <span className="item-meta">{company.industry} - {company.location}</span>
                <span className="item-meta">ID: {company.id}</span>
              </div>
              <div className="item-actions">
                {getStatusBadge(company.status)}
                <button className="btn btn-sm btn-outline">{t('admin.view')}</button>
                <button className="btn btn-sm btn-outline">{t('admin.edit')}</button>
                {company.status === 'banned' ? (
                  <button className="btn btn-sm btn-success" onClick={() => handleUnbanCompany(company.id)}>
                    {t('admin.unbanCompany')}
                  </button>
                ) : (
                  <button className="btn btn-sm btn-warning" onClick={() => handleBanCompany(company.id)}>
                    {t('admin.banCompany')}
                  </button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCompany(company.id)}>
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>{t('admin.manageUsers')}</h2>
            <button className="btn btn-primary">{t('admin.addNew')}</button>
          </div>
          <div className="select-all-bar">
            <input
              type="checkbox"
              checked={selectedItems.length === users.length && users.length > 0}
              onChange={() => handleSelectAll(users)}
            />
            <span>{t('admin.selectAll')}</span>
          </div>
          {filterItems(users).map(user => (
            <div key={user.id} className={`admin-item ${selectedItems.includes(user.id) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={selectedItems.includes(user.id)}
                onChange={() => handleSelectItem(user.id)}
              />
              <div className="item-info">
                <strong>{user.name}</strong>
                <span className="item-meta">{user.email}</span>
                <span className="item-meta">{t('admin.company')}: {user.company_id}</span>
              </div>
              <div className="item-actions">
                {getStatusBadge(user.status)}
                <select 
                  value={user.role} 
                  onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                  className="role-select"
                >
                  <option value="user">{t('admin.userRole')}</option>
                  <option value="admin">{t('admin.adminRole')}</option>
                </select>
                {user.status === 'banned' ? (
                  <button className="btn btn-sm btn-success" onClick={() => handleUnbanUser(user.id)}>
                    {t('admin.unbanUser')}
                  </button>
                ) : (
                  <button className="btn btn-sm btn-warning" onClick={() => handleBanUser(user.id)}>
                    {t('admin.banUser')}
                  </button>
                )}
                <button className="btn btn-sm btn-outline">{t('admin.view')}</button>
                <button className="btn btn-sm btn-danger">{t('common.delete')}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>{t('admin.managePosts')}</h2>
          </div>
          <div className="select-all-bar">
            <input
              type="checkbox"
              checked={selectedItems.length === posts.length && posts.length > 0}
              onChange={() => handleSelectAll(posts)}
            />
            <span>{t('admin.selectAll')}</span>
          </div>
          {filterItems(posts).map(post => (
            <div key={post.id} className={`admin-item ${selectedItems.includes(post.id) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={selectedItems.includes(post.id)}
                onChange={() => handleSelectItem(post.id)}
              />
              <div className="item-info">
                <p className="post-content">{post.content?.substring(0, 100)}...</p>
                <span className="item-meta">{t('admin.company')}: {post.company_id}</span>
                <span className="item-meta">{t('admin.createdAt')}: {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-sm btn-outline">{t('admin.view')}</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeletePost(post.id)}>
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>{t('admin.manageEvents')}</h2>
          </div>
          {events.length === 0 ? (
            <p className="no-items">{t('admin.noItems')}</p>
          ) : (
            events.map(event => (
              <div key={event.id} className="admin-item">
                <div className="item-info">
                  <strong>{event.title}</strong>
                  <span className="item-meta">{event.description?.substring(0, 50)}...</span>
                  <span className="item-meta">{event.location} - {new Date(event.event_date).toLocaleDateString()}</span>
                </div>
                <div className="item-actions">
                  <button className="btn btn-sm btn-outline">{t('admin.view')}</button>
                  <button className="btn btn-sm btn-outline">{t('admin.edit')}</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEvent(event.id)}>
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>{t('admin.manageGroups')}</h2>
          </div>
          {groups.length === 0 ? (
            <p className="no-items">{t('admin.noItems')}</p>
          ) : (
            groups.map(group => (
              <div key={group.id} className="admin-item">
                <div className="item-info">
                  <strong>{group.name}</strong>
                  <span className="item-meta">{group.description?.substring(0, 50)}...</span>
                  <span className="item-meta">{group.industry} - {group.is_private ? t('groups.private') : t('groups.public')}</span>
                </div>
                <div className="item-actions">
                  <button className="btn btn-sm btn-outline">{t('admin.view')}</button>
                  <button className="btn btn-sm btn-outline">{t('admin.edit')}</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteGroup(group.id)}>
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>{t('admin.manageJobs')}</h2>
          </div>
          {jobs.length === 0 ? (
            <p className="no-items">{t('admin.noItems')}</p>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="admin-item">
                <div className="item-info">
                  <strong>{job.title}</strong>
                  <span className="item-meta">{job.location} - {job.job_type}</span>
                  <span className="item-meta">{t('admin.company')}: {job.company_id}</span>
                </div>
                <div className="item-actions">
                  <button className="btn btn-sm btn-outline">{t('admin.view')}</button>
                  <button className="btn btn-sm btn-outline">{t('admin.edit')}</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteJob(job.id)}>
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
