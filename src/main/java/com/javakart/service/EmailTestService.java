// EmailTestService.java (temporary test file)
package com.javakart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailTestService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendTestEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("your-email@gmail.com"); // Your email
            message.setSubject("JavaKart Email Test");
            message.setText("Congratulations! Email service is working perfectly! 🎉");
            message.setFrom("javakart.app@gmail.com");
            
            mailSender.send(message);
            System.out.println("✅ Email sent successfully!");
        } catch (Exception e) {
            System.out.println("❌ Email sending failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}