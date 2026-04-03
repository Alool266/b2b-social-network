// Made written by ali hasan
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('company_id');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: (companyId) => api.get(`/auth/me?company_id=${companyId}`),
};

// Companies
export const companiesAPI = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
  update: (id, data) => api.put(`/companies/${id}`, data),
};

// Posts
export const postsAPI = {
  getAll: () => api.get('/posts'),
  create: (companyId, content, postType = 'general') => api.post('/posts', { company_id: companyId, content, post_type: postType }),
  delete: (id) => api.delete(`/posts/${id}`),
};

// Connections
export const connectionsAPI = {
  getByCompany: (companyId) => api.get(`/connections/${companyId}`),
  sendRequest: (requesterId, receiverId) => api.post('/connections/request', { requester_id: requesterId, receiver_id: receiverId }),
  accept: (connectionId) => api.post(`/connections/accept/${connectionId}`),
  reject: (connectionId) => api.post(`/connections/reject/${connectionId}`),
  remove: (connectionId) => api.delete(`/connections/${connectionId}`),
};

// Messages
export const messagesAPI = {
  getConversation: (companyId, otherCompanyId) => api.get(`/messages/${companyId}?other_company_id=${otherCompanyId}`),
  send: (senderId, receiverId, content) => api.post('/messages', { sender_id: senderId, receiver_id: receiverId, content }),
  markRead: (messageId) => api.put(`/messages/${messageId}/read`),
};

// Jobs
export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  create: (companyId, data) => api.post('/jobs', { company_id: companyId, ...data }),
  getById: (id) => api.get(`/jobs/${id}`),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getByCompany: (companyId) => api.get(`/jobs/company/${companyId}`),
};

// Events
export const eventsAPI = {
  getAll: () => api.get('/events'),
  create: (data) => api.post('/events', data),
  getById: (id) => api.get(`/events/${id}`),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (eventId) => api.post(`/events/${eventId}/register`),
};

// Groups
export const groupsAPI = {
  getAll: () => api.get('/groups'),
  create: (data) => api.post('/groups', data),
  getById: (id) => api.get(`/groups/${id}`),
  update: (id, data) => api.put(`/groups/${id}`, data),
  delete: (id) => api.delete(`/groups/${id}`),
  join: (groupId, companyId) => api.post(`/groups/${groupId}/join`, { company_id: companyId }),
  leave: (groupId, companyId) => api.post(`/groups/${groupId}/leave`, { company_id: companyId }),
};

// Reviews
export const reviewsAPI = {
  getByCompany: (companyId) => api.get(`/reviews/company/${companyId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Notifications
export const notificationsAPI = {
  getByCompany: (companyId) => api.get(`/notifications/${companyId}`),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: (companyId) => api.put(`/notifications/read-all/${companyId}`),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Badges
export const badgesAPI = {
  getAll: () => api.get('/badges'),
  create: (data) => api.post('/badges', data),
  update: (id, data) => api.put(`/badges/${id}`, data),
  delete: (id) => api.delete(`/badges/${id}`),
  award: (companyId, badgeId) => api.post(`/companies/${companyId}/badges/${badgeId}`),
  revoke: (companyId, badgeId) => api.delete(`/companies/${companyId}/badges/${badgeId}`),
};

// Search
export const searchAPI = {
  global: (query, type = null) => {
    const params = { q: query };
    if (type) params.type = type;
    return api.get('/search', { params });
  },
  companies: (query) => api.get(`/search/companies?q=${query}`),
  posts: (query) => api.get(`/search/posts?q=${query}`),
  jobs: (query) => api.get(`/search/jobs?q=${query}`),
  events: (query) => api.get(`/search/events?q=${query}`),
  groups: (query) => api.get(`/search/groups?q=${query}`),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getCompanies: () => api.get('/admin/companies'),
  deleteCompany: (id) => api.delete(`/admin/companies/${id}`),
  getPosts: () => api.get('/admin/posts'),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
};

export default api;
