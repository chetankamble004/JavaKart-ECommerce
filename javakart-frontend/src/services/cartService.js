import api from './api';

export const cartService = {
  // Get cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add to cart
  addToCart: async (cartItem) => {
    const response = await api.post('/cart/items', cartItem);
    return response.data;
  },

  // Update cart item
  updateCartItem: async (itemId, cartItem) => {
    const response = await api.put(`/cart/items/${itemId}`, cartItem);
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },

  // Get cart count
  getCartCount: async () => {
    const cart = await cartService.getCart();
    return cart.cartItems?.length || 0;
  },

  // Get cart total
  getCartTotal: async () => {
    const cart = await cartService.getCart();
    return cart.totalAmount || 0;
  },
};