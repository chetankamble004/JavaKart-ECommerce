package com.javakart.controller;

import com.javakart.dto.PaymentDTO;
import com.javakart.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentDTO paymentDTO) {
        PaymentDTO payment = paymentService.createPayment(paymentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }
    
    @PostMapping("/verify")
    public ResponseEntity<PaymentDTO> verifyPayment(@RequestBody Map<String, String> paymentData) {
        PaymentDTO verifiedPayment = paymentService.verifyPayment(paymentData);
        return ResponseEntity.ok(verifiedPayment);
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<PaymentDTO> getPaymentByOrder(@PathVariable Long orderId) {
        PaymentDTO payment = paymentService.getPaymentByOrder(orderId);
        return ResponseEntity.ok(payment);
    }
}