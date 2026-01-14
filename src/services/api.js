const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  }),

  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  }),

  getCurrentUser: () => apiRequest('/auth/me'),
};

// Users API
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  update: (id, data) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: data,
  }),
  getByProject: (projectId) => apiRequest(`/users/project/${projectId}`),
};

// Projects API
export const projectsAPI = {
  getAll: () => apiRequest('/projects'),
  getById: (id) => apiRequest(`/projects/${id}`),
  create: (data) => apiRequest('/projects', {
    method: 'POST',
    body: data,
  }),
  update: (id, data) => apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: data,
  }),
  delete: (id) => apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  }),
  addMember: (id, userId) => apiRequest(`/projects/${id}/members`, {
    method: 'POST',
    body: { userId },
  }),
  removeMember: (id, userId) => apiRequest(`/projects/${id}/members/${userId}`, {
    method: 'DELETE',
  }),
};

// Tasks API
export const tasksAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/tasks${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/tasks/${id}`),
  create: (data) => apiRequest('/tasks', {
    method: 'POST',
    body: data,
  }),
  update: (id, data) => apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: data,
  }),
  delete: (id) => apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  }),
  getByProject: (projectId) => apiRequest(`/tasks/project/${projectId}`),
  getByUser: (userId) => apiRequest(`/tasks/user/${userId}`),
};

// Meetings API
export const meetingsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/meetings${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/meetings/${id}`),
  create: (data) => apiRequest('/meetings', {
    method: 'POST',
    body: data,
  }),
  update: (id, data) => apiRequest(`/meetings/${id}`, {
    method: 'PUT',
    body: data,
  }),
  delete: (id) => apiRequest(`/meetings/${id}`, {
    method: 'DELETE',
  }),
  join: (id) => apiRequest(`/meetings/${id}/join`, {
    method: 'POST',
  }),
  getOngoing: () => apiRequest('/meetings/status/ongoing'),
  getUpcoming: () => apiRequest('/meetings/status/upcoming'),
  getHistory: () => apiRequest('/meetings/status/history'),
};

// Actions API
export const actionsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/actions${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/actions/${id}`),
  create: (data) => apiRequest('/actions', {
    method: 'POST',
    body: data,
  }),
  getTimeline: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/actions/recent/timeline${queryString ? `?${queryString}` : ''}`);
  },
};

export default {
  auth: authAPI,
  users: usersAPI,
  projects: projectsAPI,
  tasks: tasksAPI,
  meetings: meetingsAPI,
  actions: actionsAPI,
};
