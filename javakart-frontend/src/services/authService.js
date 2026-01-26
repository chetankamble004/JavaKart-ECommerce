// src/services/authService.js
import { authAPI } from './api';

export const authService = {
  register: async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};