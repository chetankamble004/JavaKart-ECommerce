// src/services/cartService.js
import { cartAPI } from './api';

export const cartService = {
  getCart: async () => {
    try {
      const response = await cartAPI.get();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addToCart: async (item) => {
    try {
      const response = await cartAPI.addItem(item);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCartItem: async (itemId, data) => {
    try {
      const response = await cartAPI.updateItem(itemId, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      const response = await cartAPI.removeItem(itemId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await cartAPI.clear();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};