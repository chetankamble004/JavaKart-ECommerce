package com.javakart.controller;

import com.javakart.dto.CartDTO;
import com.javakart.dto.CartItemDTO;  // Add this import
import com.javakart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        CartDTO cart = cartService.getCart();
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/items")
    public ResponseEntity<CartItemDTO> addToCart(@RequestBody CartItemDTO cartItemDTO) {
        CartItemDTO addedItem = cartService.addToCart(cartItemDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedItem);
    }
    
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable Long itemId, 
                                                     @RequestBody CartItemDTO cartItemDTO) {
        CartItemDTO updatedItem = cartService.updateCartItem(itemId, cartItemDTO);
        return ResponseEntity.ok(updatedItem);
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId) {
        cartService.removeFromCart(itemId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}