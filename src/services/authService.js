import { authAPI } from './api';

export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage or API
  async getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        // Verify token is still valid by fetching from API
        const response = await authAPI.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      } catch (error) {
        // Token invalid, clear storage
        this.logout();
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  },
};

export default authService; 