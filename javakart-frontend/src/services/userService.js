import api from './api';

export const userService = {
  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Get all users (admin)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Block user (admin)
  blockUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/block`);
    return response.data;
  },

  // Unblock user (admin)
  unblockUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/unblock`);
    return response.data;
  },

  // Delete user (admin)
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user (admin)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Get user addresses
  getUserAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  // Add address
  addAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/addresses/${addressId}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/addresses/${addressId}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    const response = await api.put(`/addresses/${addressId}/default`);
    return response.data;
  },
};