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
    
    // Product Management
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
    
    // User Management
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
    
    // Order Management for Admin
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        // This needs a new method in OrderService to get all orders
        return ResponseEntity.ok().build();
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
    
    // Dashboard Stats
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        // Return basic stats
        return ResponseEntity.ok().build();
    }
}