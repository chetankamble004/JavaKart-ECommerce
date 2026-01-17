package com.javakart.service;

import com.javakart.dto.CartDTO;
import com.javakart.dto.CartItemDTO;

public interface CartService {
    CartDTO getCart();
    CartItemDTO addToCart(CartItemDTO cartItemDTO);
    CartItemDTO updateCartItem(Long itemId, CartItemDTO cartItemDTO);
    void removeFromCart(Long itemId);
    void clearCart();
    CartDTO getCartByUserId(Long userId);
}