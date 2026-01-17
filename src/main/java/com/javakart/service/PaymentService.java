package com.javakart.service;

import com.javakart.dto.PaymentDTO;
import java.util.Map;

public interface PaymentService {
    PaymentDTO createPayment(PaymentDTO paymentDTO);
    PaymentDTO verifyPayment(Map<String, String> paymentData);
    PaymentDTO getPaymentByOrder(Long orderId);
    PaymentDTO processPayment(Long orderId, String paymentMethod);
}