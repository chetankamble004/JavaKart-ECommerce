package com.javakart.dto;

import java.math.BigDecimal;

public class CartDTO {
    private Long cartId;
    private Long userId;
    private BigDecimal totalAmount;
    
    // Constructors
    public CartDTO() {}
    
    public CartDTO(Long cartId, Long userId, BigDecimal totalAmount) {
        this.cartId = cartId;
        this.userId = userId;
        this.totalAmount = totalAmount;
    }
    
    // Getters and Setters
    public Long getCartId() {
        return cartId;
    }
    
    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}