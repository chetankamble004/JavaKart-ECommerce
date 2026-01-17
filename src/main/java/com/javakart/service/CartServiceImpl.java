package com.javakart.service;

import com.javakart.dto.CartDTO;
import com.javakart.dto.CartItemDTO;
import com.javakart.entity.Cart;
import com.javakart.entity.CartItem;
import com.javakart.entity.Product;
import com.javakart.entity.User;
import com.javakart.exception.CartEmptyException;
import com.javakart.exception.ProductNotFoundException;
import com.javakart.repository.CartRepository;
import com.javakart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartServiceImpl implements CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserService userService;
    
    @Override
    public CartDTO getCart() {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser(currentUser)
                .orElseThrow(() -> new CartEmptyException("Cart not found"));
        
        return convertToDTO(cart);
    }
    
    @Override
    public CartItemDTO addToCart(CartItemDTO cartItemDTO) {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(currentUser);
                    return cartRepository.save(newCart);
                });
        
        Product product = productRepository.findById(cartItemDTO.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        
        // Check if product already in cart
        CartItem existingItem = null;
        for (CartItem item : cart.getCartItems()) {
            if (item.getProduct().getProductId().equals(cartItemDTO.getProductId())) {
                existingItem = item;
                break;
            }
        }
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + cartItemDTO.getQuantity());
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(cartItemDTO.getQuantity());
            cart.getCartItems().add(cartItem);
        }
        
        Cart savedCart = cartRepository.save(cart);
        
        // Return the added item
        CartItem addedItem = null;
        for (CartItem item : savedCart.getCartItems()) {
            if (item.getProduct().getProductId().equals(cartItemDTO.getProductId())) {
                addedItem = item;
                break;
            }
        }
        
        if (addedItem == null) {
            throw new RuntimeException("Failed to add item to cart");
        }
        
        return convertToItemDTO(addedItem);
    }
    
    @Override
    public CartItemDTO updateCartItem(Long itemId, CartItemDTO cartItemDTO) {
        Cart cart = cartRepository.findByUser(userService.getCurrentUser())
                .orElseThrow(() -> new CartEmptyException("Cart not found"));
        
        CartItem cartItem = null;
        for (CartItem item : cart.getCartItems()) {
            if (item.getCartItemId().equals(itemId)) {
                cartItem = item;
                break;
            }
        }
        
        if (cartItem == null) {
            throw new RuntimeException("Item not found in cart");
        }
        
        if (cartItemDTO.getQuantity() <= 0) {
            cart.getCartItems().remove(cartItem);
        } else {
            cartItem.setQuantity(cartItemDTO.getQuantity());
        }
        
        cartRepository.save(cart);
        return convertToItemDTO(cartItem);
    }
    
    @Override
    public void removeFromCart(Long itemId) {
        Cart cart = cartRepository.findByUser(userService.getCurrentUser())
                .orElseThrow(() -> new CartEmptyException("Cart not found"));
        
        List<CartItem> cartItems = cart.getCartItems();
        for (int i = 0; i < cartItems.size(); i++) {
            if (cartItems.get(i).getCartItemId().equals(itemId)) {
                cartItems.remove(i);
                break;
            }
        }
        
        cartRepository.save(cart);
    }
    
    @Override
    public void clearCart() {
        Cart cart = cartRepository.findByUser(userService.getCurrentUser())
                .orElseThrow(() -> new CartEmptyException("Cart not found"));
        
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
    
    @Override
    public CartDTO getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new CartEmptyException("Cart not found"));
        return convertToDTO(cart);
    }
    
    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getCartId());
        dto.setUserId(cart.getUser().getUserId());
        
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getCartItems()) {
            BigDecimal itemTotal = item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemTotal);
        }
        
        dto.setTotalAmount(total);
        return dto;
    }
    
    private CartItemDTO convertToItemDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setCartItemId(cartItem.getCartItemId());
        dto.setCartId(cartItem.getCart().getCartId());
        dto.setProductId(cartItem.getProduct().getProductId());
        dto.setProductName(cartItem.getProduct().getProductName());
        dto.setPrice(cartItem.getProduct().getPrice());
        dto.setQuantity(cartItem.getQuantity());
        dto.setImageUrl(cartItem.getProduct().getImageUrl());
        return dto;
    }
}