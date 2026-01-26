// src/services/orderService.js
import { orderAPI } from './api';

export const orderService = {
  createOrder: async () => {
    try {
      const response = await orderAPI.create();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const response = await orderAPI.getAll();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await orderAPI.getById(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelOrder: async (id) => {
    try {
      const response = await orderAPI.cancel(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};