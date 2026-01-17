package com.javakart.service;

import com.javakart.dto.OrderDTO;
import com.javakart.entity.*;
import com.javakart.exception.CartEmptyException;
import com.javakart.exception.InvalidOrderException;
import com.javakart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Override
    public OrderDTO createOrder() {
        User currentUser = userService.getCurrentUser();
        
        // Get user's cart
        Cart cart = cartRepository.findByUser(currentUser)
                .orElseThrow(() -> new CartEmptyException("Cart is empty"));
        
        if (cart.getCartItems().isEmpty()) {
            throw new CartEmptyException("Cannot create order with empty cart");
        }
        
        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getCartItems()) {
            BigDecimal itemTotal = cartItem.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }
        
        // Create order
        Order order = new Order();
        order.setUser(currentUser);
        order.setTotalAmount(totalAmount);
        order.setOrderStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(getUserShippingAddress(currentUser));
        
        Order savedOrder = orderRepository.save(order);
        
        // Create order items from cart items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            
            // Update product stock
            Product product = cartItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
            
            orderItems.add(orderItem);
        }
        
        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);
        
        // Clear the cart
        cart.getCartItems().clear();
        cartRepository.save(cart);
        
        return convertToDTO(savedOrder);
    }
    
    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new InvalidOrderException("Order not found"));
        return convertToDTO(order);
    }
    
    @Override
    public List<OrderDTO> getOrders() {
        User currentUser = userService.getCurrentUser();
        return orderRepository.findByUser(currentUser)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new InvalidOrderException("Order not found"));
        
        if (!isValidStatus(status)) {
            throw new InvalidOrderException("Invalid order status");
        }
        
        order.setOrderStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }
    
    @Override
    public OrderDTO cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new InvalidOrderException("Order not found"));
        
        // Only pending orders can be cancelled
        if (!"PENDING".equals(order.getOrderStatus())) {
            throw new InvalidOrderException("Only pending orders can be cancelled");
        }
        
        order.setOrderStatus("CANCELLED");
        
        // Restore product stock
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());
            productRepository.save(product);
        }
        
        Order cancelledOrder = orderRepository.save(order);
        return convertToDTO(cancelledOrder);
    }
    
    @Override
    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUser_UserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private String getUserShippingAddress(User user) {
        // Get default address or first address
        if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
            for (Address address : user.getAddresses()) {
                if (address.getIsDefault() != null && address.getIsDefault()) {
                    return formatAddress(address);
                }
            }
            return formatAddress(user.getAddresses().get(0));
        }
        return "No address provided";
    }
    
    private String formatAddress(Address address) {
        return address.getStreet() + ", " + address.getCity() + ", " + 
               address.getState() + ", " + address.getCountry() + " - " + address.getZipCode();
    }
    
    private boolean isValidStatus(String status) {
        return List.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED")
                .contains(status);
    }
    
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUser().getUserId());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderDate(order.getOrderDate());
        dto.setShippingAddress(order.getShippingAddress());
        return dto;
    }
}