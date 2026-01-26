import api from './api';

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  // Search products
  searchProducts: async (keyword) => {
    const response = await api.get(`/products/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // Create product (admin only)
  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Upload product image
  uploadProductImage: async (productId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/uploads/product/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get trending products
  getTrendingProducts: async () => {
    const response = await api.get('/products?sort=rating&limit=8');
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async () => {
    const response = await api.get('/products?sort=createdAt&limit=8');
    return response.data;
  },
};