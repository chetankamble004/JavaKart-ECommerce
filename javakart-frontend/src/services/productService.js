// src/services/productService.js
import { productAPI } from './api';

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await productAPI.getAll();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await productAPI.getById(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchProducts: async (keyword) => {
    try {
      const response = await productAPI.search(keyword);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductsByCategory: async (categoryId) => {
    try {
      const response = await productAPI.getByCategory(categoryId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};