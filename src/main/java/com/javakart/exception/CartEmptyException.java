package com.javakart.exception;

public class CartEmptyException extends RuntimeException {
    
    public CartEmptyException() {
        super("Cart is empty");
    }
    
    public CartEmptyException(String message) {
        super(message);
    }
    
    public CartEmptyException(String message, Throwable cause) {
        super(message, cause);
    }
}