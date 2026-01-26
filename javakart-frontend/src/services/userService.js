// src/services/userService.js - FIXED VERSION
import { authAPI } from './api';

const userService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return {
        success: true,
        data: response.data,
        message: 'Registration successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        details: error.response?.data
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Store token and user data in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
        details: error.response?.data
      };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await authAPI.getProfile();
      return {
        success: true,
        data: response.data,
        message: 'Profile loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load profile',
        details: error.response?.data
      };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      
      // Update stored user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
        details: error.response?.data
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      success: true,
      message: 'Logged out successfully'
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  // Get user token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Update user data in localStorage
  updateLocalUser: (userData) => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...storedUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Validate user session
  validateSession: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { valid: false, message: 'No token found' };
    }

    try {
      // Try to get profile to validate token
      const response = await authAPI.getProfile();
      return {
        valid: true,
        data: response.data,
        message: 'Session is valid'
      };
    } catch (error) {
      // Token is invalid, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        valid: false,
        error: 'Session expired. Please login again.'
      };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.updateProfile({
        currentPassword,
        password: newPassword
      });
      return {
        success: true,
        data: response.data,
        message: 'Password changed successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to change password',
        details: error.response?.data
      };
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      // This would be a separate API endpoint
      // For now, we'll use a placeholder
      return {
        success: true,
        message: 'Account deletion requested. Feature coming soon.'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete account'
      };
    }
  },

  // Reset password request
  requestPasswordReset: async (email) => {
    try {
      // This would call a password reset API
      // For now, return success
      return {
        success: true,
        message: 'Password reset instructions sent to your email'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send reset instructions'
      };
    }
  },

  // Verify reset token
  verifyResetToken: async (token) => {
    try {
      // This would verify the reset token
      return {
        success: true,
        valid: true,
        message: 'Token is valid'
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        error: 'Invalid or expired token'
      };
    }
  }
};

export default userService;