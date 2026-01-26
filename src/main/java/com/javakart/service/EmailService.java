package com.javakart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.features.email-notifications:true}")
    private boolean emailEnabled;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    public void sendRegistrationEmail(String toEmail, String username) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping registration email.");
            return;
        }
        
        String subject = "Welcome to JavaKart!";
        String text = "Dear " + username + ",\n\n" +
                     "Thank you for registering with JavaKart. " +
                     "Your account has been successfully created.\n\n" +
                     "You can now:\n" +
                     "• Browse thousands of products\n" +
                     "• Add items to your cart\n" +
                     "• Place orders with secure payments\n" +
                     "• Track your orders in real-time\n\n" +
                     "Start shopping now: " + baseUrl + "\n\n" +
                     "If you have any questions, contact our support team.\n\n" +
                     "Happy Shopping!\n" +
                     "JavaKart Team";
        
        sendSimpleEmail(toEmail, subject, text);
    }
    
    public void sendOrderConfirmationEmail(String toEmail, String username, Long orderId, Double amount) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping order confirmation.");
            return;
        }
        
        String subject = "Order Confirmation - Order #" + orderId;
        String text = "Dear " + username + ",\n\n" +
                     "Thank you for your order! Your order has been confirmed.\n\n" +
                     "📦 Order Details:\n" +
                     "Order ID: #" + orderId + "\n" +
                     "Amount: ₹" + String.format("%.2f", amount) + "\n" +
                     "Date: " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")) + "\n\n" +
                     "We will notify you once your order is shipped.\n" +
                     "Track your order: " + baseUrl + "/orders/" + orderId + "\n\n" +
                     "JavaKart Team";
        
        sendSimpleEmail(toEmail, subject, text);
    }
    
    public void sendOrderStatusEmail(String toEmail, String username, Long orderId, String status) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping order status email.");
            return;
        }
        
        String subject = "Order Status Update - Order #" + orderId;
        String text = "Dear " + username + ",\n\n" +
                     "Your order status has been updated.\n\n" +
                     "📦 Order Details:\n" +
                     "Order ID: #" + orderId + "\n" +
                     "New Status: " + status + "\n" +
                     "Date: " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")) + "\n\n" +
                     "Track your order: " + baseUrl + "/orders/" + orderId + "\n\n" +
                     "JavaKart Team";
        
        sendSimpleEmail(toEmail, subject, text);
    }
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping password reset email.");
            return;
        }
        
        String subject = "Password Reset Request";
        String resetLink = baseUrl + "/reset-password?token=" + resetToken;
        
        String text = "You have requested to reset your password.\n\n" +
                     "Use the following link to reset your password:\n" +
                     resetLink + "\n\n" +
                     "This link will expire in 1 hour.\n\n" +
                     "If you didn't request this, please ignore this email.\n\n" +
                     "JavaKart Team";
        
        sendSimpleEmail(toEmail, subject, text);
    }
    
    public void sendPasswordChangedEmail(String toEmail, String username) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping password changed email.");
            return;
        }
        
        String subject = "Password Changed Successfully";
        String text = "Dear " + username + ",\n\n" +
                     "Your password has been successfully changed.\n\n" +
                     "If you did not make this change, please contact our support team immediately.\n\n" +
                     "JavaKart Team";
        
        sendSimpleEmail(toEmail, subject, text);
    }
    
    public void sendPaymentSuccessEmail(String toEmail, String username, Long orderId, Double amount, String paymentMethod) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping payment success email.");
            return;
        }
        
        String subject = "Payment Successful - Order #" + orderId;
        String text = "Dear " + username + ",\n\n" +
                     "Your payment has been processed successfully.\n\n" +
                     "💰 Payment Details:\n" +
                     "Order ID: #" + orderId + "\n" +
                     "Amount: ₹" + String.format("%.2f", amount) + "\n" +
                     "Payment Method: " + paymentMethod + "\n" +
                     "Date: " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")) + "\n\n" +
                     "Your order is now being processed.\n" +
                     "Track your order: " + baseUrl + "/orders/" + orderId + "\n\n" +
                     "JavaKart Team";
        
        sendSimpleEmail(toEmail, subject, text);
    }
    
    public void sendAdminAlert(String subject, String message) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping admin alert.");
            return;
        }
        
        // This would send to admin email (configured separately)
        String adminEmail = "admin@javakart.com";
        sendSimpleEmail(adminEmail, "[ADMIN ALERT] " + subject, message);
    }
    
    public void sendNewsletter(String toEmail, String subject, String content) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping newsletter.");
            return;
        }
        
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true); // true for HTML content
            
            mailSender.send(mimeMessage);
            logger.info("Newsletter sent to: {}", toEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send newsletter email: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send newsletter email", e);
        }
    }
    
    private void sendSimpleEmail(String toEmail, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("noreply@javakart.com");
            
            mailSender.send(message);
            logger.info("Email sent to: {}, Subject: {}", toEmail, subject);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
            // Don't throw exception for email failures, just log
        }
    }
    
    public void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        if (!emailEnabled) {
            logger.warn("Email notifications disabled. Skipping HTML email.");
            return;
        }
        
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom("noreply@javakart.com");
            
            mailSender.send(mimeMessage);
            logger.info("HTML email sent to: {}, Subject: {}", toEmail, subject);
        } catch (MessagingException e) {
            logger.error("Failed to send HTML email: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send HTML email", e);
        }
    }
    
    public boolean isEmailEnabled() {
        return emailEnabled;
    }
}