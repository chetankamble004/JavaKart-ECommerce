package com.javakart.controller;

import com.javakart.dto.OrderDTO;
import com.javakart.dto.ProductDTO;
import com.javakart.dto.UserDTO;
import com.javakart.service.OrderService;
import com.javakart.service.ProductService;
import com.javakart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private OrderService orderService;
    
    // ========== PRODUCT MANAGEMENT ==========
    @PostMapping("/products")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
    
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long productId, @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(productId, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
    
    // ========== USER MANAGEMENT ==========
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/users/{userId}/block")
    public ResponseEntity<UserDTO> blockUser(@PathVariable Long userId) {
        UserDTO blockedUser = userService.blockUser(userId);
        return ResponseEntity.ok(blockedUser);
    }
    
    @PutMapping("/users/{userId}/unblock")
    public ResponseEntity<UserDTO> unblockUser(@PathVariable Long userId) {
        UserDTO unblockedUser = userService.unblockUser(userId);
        return ResponseEntity.ok(unblockedUser);
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
    
    // ========== ORDER MANAGEMENT ==========
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long orderId) {
        OrderDTO cancelledOrder = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(cancelledOrder);
    }
    
    @PostMapping("/orders/{orderId}/refund")
    public ResponseEntity<String> processRefund(@PathVariable Long orderId) {
        // Implementation for refund processing
        // This would integrate with payment gateway API
        return ResponseEntity.ok("Refund processed for order: " + orderId);
    }
    
    // ========== INVENTORY MANAGEMENT ==========
    @PutMapping("/products/{productId}/stock")
    public ResponseEntity<ProductDTO> updateStock(
            @PathVariable Long productId, 
            @RequestParam Integer quantity) {
        ProductDTO product = productService.getProductById(productId);
        product.setStockQuantity(quantity);
        ProductDTO updatedProduct = productService.updateProduct(productId, product);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @GetMapping("/products/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts() {
        // Get all products and filter low stock
        List<ProductDTO> allProducts = productService.getAllProducts();
        List<ProductDTO> lowStock = allProducts.stream()
                .filter(p -> p.getStockQuantity() < 10)
                .toList();
        return ResponseEntity.ok(lowStock);
    }
}