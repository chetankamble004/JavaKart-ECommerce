// src/services/api.js - FIXED VERSION
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Test endpoints
export const testBackend = () => api.get('/test');
export const testHealth = () => api.get('/test/health');

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Product endpoints
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
};

// Cart endpoints
export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (item) => api.post('/cart/items', item),
  updateItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
};

// Order endpoints
export const orderAPI = {
  create: () => api.post('/orders'),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Payment endpoints
export const paymentAPI = {
  create: (paymentData) => api.post('/payments', paymentData),
  verify: (paymentData) => api.post('/payments/verify', paymentData),
  getByOrder: (orderId) => api.get(`/payments/${orderId}`),
};

// Review endpoints
export const reviewAPI = {
  add: (reviewData) => api.post('/reviews', reviewData),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getAverage: (productId) => api.get(`/reviews/product/${productId}/average`),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  blockUser: (userId) => api.put(`/admin/users/${userId}/block`),
  unblockUser: (userId) => api.put(`/admin/users/${userId}/unblock`),
  getAllOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (orderId, status) => 
    api.put(`/admin/orders/${orderId}/status?status=${status}`),
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

// Analytics endpoints
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getSalesAnalytics: (startDate, endDate) => 
    api.get(`/analytics/sales?startDate=${startDate}&endDate=${endDate}`),
  getUserAnalytics: () => api.get('/analytics/users'),
  getProductAnalytics: () => api.get('/analytics/products'),
};

export default api;