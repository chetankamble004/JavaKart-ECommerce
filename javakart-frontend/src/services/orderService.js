import api from './api';

export const orderService = {
  // Create order
  createOrder: async () => {
    const response = await api.post('/orders');
    return response.data;
  },

  // Get all orders for current user
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}/status?status=${status}`);
    return response.data;
  },

  // Get orders by user (admin)
  getOrdersByUser: async (userId) => {
    const response = await api.get(`/admin/orders/user/${userId}`);
    return response.data;
  },

  // Process refund (admin)
  processRefund: async (orderId) => {
    const response = await api.post(`/admin/orders/${orderId}/refund`);
    return response.data;
  },
};