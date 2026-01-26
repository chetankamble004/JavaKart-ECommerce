import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const loadCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCartItems(cartData.cartItems || []);
      setCartTotal(cartData.totalAmount || 0);
      setCartCount(cartData.cartItems?.length || 0);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const cartItem = {
        productId,
        quantity,
      };
      await cartService.addToCart(cartItem);
      await loadCart();
      toast.success('Product added to cart!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const cartItem = { quantity };
      await cartService.updateCartItem(itemId, cartItem);
      await loadCart();
      toast.success('Cart updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId === productId);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItem,
    isInCart,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;