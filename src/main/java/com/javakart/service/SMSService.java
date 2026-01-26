package com.javakart.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SMSService {
    
    private static final Logger logger = LoggerFactory.getLogger(SMSService.class);
    
    @Value("${twilio.account.sid}")
    private String accountSid;
    
    @Value("${twilio.auth.token}")
    private String authToken;
    
    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;
    
    @Value("${app.features.sms-notifications:false}")
    private boolean smsEnabled;
    
    public void sendSMS(String toPhoneNumber, String messageBody) {
        if (!smsEnabled) {
            logger.warn("SMS notifications are disabled. Configure Twilio credentials to enable.");
            return;
        }
        
        // Validate phone number
        if (toPhoneNumber == null || toPhoneNumber.trim().isEmpty()) {
            logger.error("Invalid phone number provided: {}", toPhoneNumber);
            throw new IllegalArgumentException("Phone number cannot be empty");
        }
        
        // Validate message
        if (messageBody == null || messageBody.trim().isEmpty()) {
            logger.error("Empty message body provided");
            throw new IllegalArgumentException("Message body cannot be empty");
        }
        
        try {
            // Initialize Twilio
            Twilio.init(accountSid, authToken);
            
            // Log attempt (mask phone number for privacy)
            String maskedPhone = maskPhoneNumber(toPhoneNumber);
            logger.info("Attempting to send SMS to: {}", maskedPhone);
            
            // Create and send message
            Message message = Message.creator(
                new PhoneNumber(toPhoneNumber),
                new PhoneNumber(fromPhoneNumber),
                messageBody
            ).create();
            
            logger.info("✅ SMS sent successfully! Message SID: {}, To: {}", 
                message.getSid(), maskedPhone);
            
        } catch (com.twilio.exception.ApiException e) {
            logger.error("❌ Twilio API error: {} - {}", e.getCode(), e.getMessage());
            throw new RuntimeException("Failed to send SMS: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("❌ Unexpected error sending SMS: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send SMS", e);
        }
    }
    
    public void sendOrderConfirmationSMS(String phoneNumber, Long orderId, Double amount) {
        String message = "✅ Your JavaKart order #" + orderId + 
                        " has been confirmed. Amount: ₹" + amount + 
                        ". Track your order at javakart.com";
        sendSMS(phoneNumber, message);
    }
    
    public void sendOTP(String phoneNumber, String otp) {
        String message = "🔐 Your JavaKart OTP is: " + otp + 
                        ". Valid for 10 minutes. Do not share with anyone.";
        sendSMS(phoneNumber, message);
    }
    
    public void sendOrderStatusUpdate(String phoneNumber, Long orderId, String status) {
        String message = "📦 Order #" + orderId + " status updated to: " + status + 
                        ". Visit javakart.com/track for details.";
        sendSMS(phoneNumber, message);
    }
    
    public void sendDeliveryUpdate(String phoneNumber, Long orderId, String deliveryDate, String deliveryTime) {
        String message = "🚚 Your order #" + orderId + " will be delivered on " + 
                        deliveryDate + " between " + deliveryTime + 
                        ". Please keep someone available.";
        sendSMS(phoneNumber, message);
    }
    
    public void sendPaymentSuccessSMS(String phoneNumber, Long orderId, Double amount) {
        String message = "💳 Payment successful for order #" + orderId + 
                        ". Amount: ₹" + amount + ". Thank you for shopping with JavaKart!";
        sendSMS(phoneNumber, message);
    }
    
    public void sendPaymentFailedSMS(String phoneNumber, Long orderId, Double amount) {
        String message = "❌ Payment failed for order #" + orderId + 
                        ". Amount: ₹" + amount + 
                        ". Please try again or contact support.";
        sendSMS(phoneNumber, message);
    }
    
    // Test method to verify Twilio setup
    public String testTwilioConnection() {
        if (!smsEnabled) {
            return "⚠️ SMS notifications are disabled. Enable in application.properties";
        }
        
        try {
            Twilio.init(accountSid, authToken);
            return "✅ Twilio initialized successfully! Account SID: " + 
                   maskAccountSid(accountSid);
        } catch (Exception e) {
            return "❌ Twilio initialization failed: " + e.getMessage();
        }
    }
    
    public boolean isSmsEnabled() {
        return smsEnabled;
    }
    
    // Utility methods for privacy
    private String maskPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 4) {
            return "***";
        }
        return phoneNumber.substring(0, phoneNumber.length() - 4) + "****";
    }
    
    private String maskAccountSid(String accountSid) {
        if (accountSid == null || accountSid.length() < 8) {
            return "***";
        }
        return accountSid.substring(0, 8) + "..." + 
               accountSid.substring(accountSid.length() - 4);
    }
}