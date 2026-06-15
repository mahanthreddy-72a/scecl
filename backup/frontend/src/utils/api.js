import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Separate instance for bulk imports with longer timeout
const bulkApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 300000
});

// Add interceptor to handle responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 401 is expected when not logged in
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  adminLogin: (username, password) => api.post('/auth/admin/login', { username, password }),
  adminLogout: () => api.post('/auth/admin/logout'),
  adminStatus: () => api.get('/auth/admin/status'),
  studentLogin: (scs_no) => api.post('/auth/student/login', { scs_no }),
  studentLogout: () => api.post('/auth/student/logout'),
  studentStatus: () => api.get('/auth/student/status')
};

// Voting endpoints
export const votingAPI = {
  submitVotes: (votes) => api.post('/voting/submit', { votes }),
  getPositions: () => api.get('/voting/positions'),
  getCandidates: (position) => api.get(`/voting/candidates/${position}`),
  logActivity: (status) => api.post('/voting/activity', { status })
};

// Candidates endpoints
export const candidatesAPI = {
  getAll: () => api.get('/candidates'),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (formData) => api.post('/candidates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/candidates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/candidates/${id}`)
};

// Students endpoints
export const studentsAPI = {
  getAll: (page = 1, limit = 20, search = '') => api.get('/students', {
    params: { page, limit, search }
  }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  bulkImport: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return bulkApi.post('/students/import/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getActivityLogs: (limit = 50) => api.get('/dashboard/activity', { params: { limit } }),
  getResults: () => api.get('/dashboard/results'),
  getPositionResults: (position) => api.get(`/dashboard/results/position/${position}`),
  getHouseResults: () => api.get('/dashboard/results/house'),
  getParticipationByClass: () => api.get('/dashboard/participation/class'),
  getParticipationByHouse: () => api.get('/dashboard/participation/house'),
  getCurrentActivity: () => api.get('/dashboard/activity/current')
};

export default api;
