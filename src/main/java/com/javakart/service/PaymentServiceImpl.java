package com.javakart.service;

import com.javakart.dto.PaymentDTO;
import com.javakart.entity.Order;
import com.javakart.entity.Payment;
import com.javakart.exception.InvalidOrderException;
import com.javakart.repository.OrderRepository;
import com.javakart.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Override
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Order order = orderRepository.findById(paymentDTO.getOrderId())
                .orElseThrow(() -> new InvalidOrderException("Order not found"));
        
        // Check if payment already exists for this order
        paymentRepository.findByOrder_OrderId(order.getOrderId())
                .ifPresent(payment -> {
                    throw new RuntimeException("Payment already exists for this order");
                });
        
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setPaymentStatus("PENDING");
        payment.setTransactionId(generateTransactionId());
        payment.setPaymentDate(LocalDateTime.now());
        
        Payment savedPayment = paymentRepository.save(payment);
        return convertToDTO(savedPayment);
    }
    
    @Override
    public PaymentDTO verifyPayment(Map<String, String> paymentData) {
        String transactionId = paymentData.get("transactionId");
        String status = paymentData.get("status");
        
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        if ("SUCCESS".equals(status)) {
            payment.setPaymentStatus("SUCCESS");
            
            // Update order status
            Order order = payment.getOrder();
            order.setOrderStatus("PROCESSING");
            orderRepository.save(order);
            
            // Send confirmation email
            try {
                emailService.sendOrderConfirmationEmail(
                    order.getUser().getEmail(),
                    order.getUser().getFullName(),
                    order.getOrderId(),
                    order.getTotalAmount().doubleValue()
                );
            } catch (Exception e) {
                // Log error but don't fail payment
                System.err.println("Failed to send email: " + e.getMessage());
            }
        } else {
            payment.setPaymentStatus("FAILED");
        }
        
        Payment updatedPayment = paymentRepository.save(payment);
        return convertToDTO(updatedPayment);
    }
    
    @Override
    public PaymentDTO getPaymentByOrder(Long orderId) {
        Payment payment = paymentRepository.findByOrder_OrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order"));
        return convertToDTO(payment);
    }
    
    @Override
    public PaymentDTO processPayment(Long orderId, String paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new InvalidOrderException("Order not found"));
        
        // For Cash on Delivery (COD)
        if ("COD".equals(paymentMethod)) {
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentMethod("COD");
            payment.setPaymentStatus("PENDING");
            payment.setTransactionId("COD-" + UUID.randomUUID().toString().substring(0, 8));
            payment.setPaymentDate(LocalDateTime.now());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            // Update order status for COD
            order.setOrderStatus("PROCESSING");
            orderRepository.save(order);
            
            return convertToDTO(savedPayment);
        }
        
        // For online payments, create pending payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus("PENDING");
        payment.setTransactionId(generateTransactionId());
        payment.setPaymentDate(LocalDateTime.now());
        
        Payment savedPayment = paymentRepository.save(payment);
        return convertToDTO(savedPayment);
    }
    
    private String generateTransactionId() {
        return "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
    
    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setOrderId(payment.getOrder().getOrderId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentDate(payment.getPaymentDate());
        return dto;
    }
}