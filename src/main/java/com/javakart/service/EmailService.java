package com.javakart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendRegistrationEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to JavaKart!");
        message.setText("Dear " + username + ",\n\n" +
                       "Thank you for registering with JavaKart. " +
                       "Your account has been successfully created.\n\n" +
                       "Happy Shopping!\n" +
                       "JavaKart Team");
        message.setFrom("noreply@javakart.com");
        
        mailSender.send(message);
    }
    
    public void sendOrderConfirmationEmail(String toEmail, String username, Long orderId, Double amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Order Confirmation - Order #" + orderId);
        message.setText("Dear " + username + ",\n\n" +
                       "Thank you for your order! Your order has been confirmed.\n\n" +
                       "Order ID: " + orderId + "\n" +
                       "Amount: ₹" + amount + "\n\n" +
                       "We will notify you once your order is shipped.\n\n" +
                       "JavaKart Team");
        message.setFrom("noreply@javakart.com");
        
        mailSender.send(message);
    }
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Password Reset Request");
        message.setText("You have requested to reset your password.\n\n" +
                       "Use the following token to reset your password: " + resetToken + "\n\n" +
                       "If you didn't request this, please ignore this email.\n\n" +
                       "JavaKart Team");
        message.setFrom("noreply@javakart.com");
        
        mailSender.send(message);
    }
}