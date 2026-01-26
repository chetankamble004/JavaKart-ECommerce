// src/context/AuthContext.js - UPDATED VERSION
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [backendStatus, setBackendStatus] = useState('unknown');

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Test backend connection first
          const testResponse = await fetch('http://localhost:8080/api/test');
          if (testResponse.ok) {
            setBackendStatus('connected');
            try {
              const response = await authAPI.getProfile();
              setUser(response.data);
            } catch (profileError) {
              console.error('Profile fetch failed:', profileError);
              // Token might be invalid, clear it
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } else {
            setBackendStatus('disconnected');
          }
        } catch (error) {
          console.error('Backend connection failed:', error);
          setBackendStatus('disconnected');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        const { token, ...userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(token);
        setUser(userData);
        setBackendStatus('connected');
        return { success: true, data: userData };
      } else {
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
    } catch (error) {
      console.error('Login error details:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 
              error.response?.data?.error || 
              error.message || 
              'Cannot connect to server. Please check if backend is running on port 8080.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration response:', response.data);
      
      if (response.data && (response.data.userId || response.data.username)) {
        return { success: true, data: response.data };
      } else {
        return { 
          success: false, 
          error: 'Registration failed. Invalid response from server.' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 
              error.response?.data?.error || 
              'Cannot connect to server. Please check if backend is running.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        backendStatus,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;