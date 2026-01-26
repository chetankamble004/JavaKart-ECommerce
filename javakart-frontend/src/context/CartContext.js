// src/context/CartContext.js - COMPLETE FIXED VERSION
import React, { createContext, useState, useContext } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return null;
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addItem({
        productId,
        quantity,
      });
      await fetchCart();
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add to cart' 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateItem(itemId, { quantity });
      await fetchCart();
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update cart' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove from cart' 
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  };

  const getCartTotal = () => {
    if (!cart) return 0;
    return cart.totalAmount || 0;
  };

  const getItemCount = () => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.length || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;