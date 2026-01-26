package com.javakart.service;

import com.javakart.dto.PaymentDTO;
import com.javakart.entity.Order;
import com.javakart.entity.Payment;
import com.javakart.exception.InvalidOrderException;
import com.javakart.repository.OrderRepository;
import com.javakart.repository.PaymentRepository;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
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
    
    @Autowired
    private SMSService smsService;
    
    @Autowired
    private RazorpayService razorpayService;
    
    @Autowired
    private InvoiceService invoiceService;
    
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
        
        // If online payment, create Razorpay order
        if ("ONLINE".equals(paymentDTO.getPaymentMethod())) {
            try {
                PaymentDTO razorpayResponse = razorpayService.createRazorpayOrder(paymentDTO);
                savedPayment.setTransactionId(razorpayResponse.getTransactionId());
                paymentRepository.save(savedPayment);
                return razorpayResponse;
            } catch (RazorpayException e) {
                throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
            }
        }
        
        return convertToDTO(savedPayment);
    }
    
    @Override
    public PaymentDTO verifyPayment(Map<String, String> paymentData) {
        String transactionId = paymentData.get("transactionId");
        String status = paymentData.get("status");
        String razorpayPaymentId = paymentData.get("razorpay_payment_id");
        String razorpaySignature = paymentData.get("razorpay_signature");
        
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        // Verify Razorpay signature for online payments
        if ("ONLINE".equals(payment.getPaymentMethod())) {
            boolean isValid = razorpayService.verifyPayment(transactionId, razorpayPaymentId, razorpaySignature);
            if (!isValid) {
                payment.setPaymentStatus("FAILED");
                paymentRepository.save(payment);
                throw new RuntimeException("Payment verification failed");
            }
        }
        
        if ("SUCCESS".equals(status)) {
            payment.setPaymentStatus("SUCCESS");
            
            // Update order status
            Order order = payment.getOrder();
            order.setOrderStatus("PROCESSING");
            orderRepository.save(order);
            
            // Generate invoice
            try {
                invoiceService.generateInvoice(order.getOrderId());
            } catch (Exception e) {
                System.err.println("Failed to generate invoice: " + e.getMessage());
            }
            
            // Send confirmation email
            try {
                emailService.sendOrderConfirmationEmail(
                    order.getUser().getEmail(),
                    order.getUser().getFullName(),
                    order.getOrderId(),
                    order.getTotalAmount().doubleValue()
                );
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
            
            // Send SMS notification
            try {
                smsService.sendOrderConfirmationSMS(
                    order.getUser().getMobile(),
                    order.getOrderId(),
                    order.getTotalAmount().doubleValue()
                );
            } catch (Exception e) {
                System.err.println("Failed to send SMS: " + e.getMessage());
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
            
            // Generate invoice for COD
            try {
                invoiceService.generateInvoice(order.getOrderId());
            } catch (Exception e) {
                System.err.println("Failed to generate invoice: " + e.getMessage());
            }
            
            // Send notifications
            sendPaymentNotifications(order, "COD");
            
            return convertToDTO(savedPayment);
        }
        
        // For online payments
        if ("ONLINE".equals(paymentMethod)) {
            PaymentDTO paymentDTO = new PaymentDTO();
            paymentDTO.setOrderId(orderId);
            paymentDTO.setAmount(order.getTotalAmount());
            paymentDTO.setPaymentMethod("ONLINE");
            
            return createPayment(paymentDTO);
        }
        
        throw new RuntimeException("Invalid payment method");
    }
    
    private void sendPaymentNotifications(Order order, String paymentMethod) {
        // Email
        try {
            emailService.sendOrderConfirmationEmail(
                order.getUser().getEmail(),
                order.getUser().getFullName(),
                order.getOrderId(),
                order.getTotalAmount().doubleValue()
            );
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
        
        // SMS
        try {
            smsService.sendOrderConfirmationSMS(
                order.getUser().getMobile(),
                order.getOrderId(),
                order.getTotalAmount().doubleValue()
            );
        } catch (Exception e) {
            System.err.println("Failed to send SMS: " + e.getMessage());
        }
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