package com.javakart.controller;

import com.javakart.service.SMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test/sms")
public class SMSTestController {
    
    @Autowired
    private SMSService smsService;
    
    @PostMapping("/send")
    public String sendTestSMS(@RequestParam String phoneNumber, @RequestParam String message) {
        smsService.sendSMS(phoneNumber, message);
        return "SMS sent successfully!";
    }
    
    @PostMapping("/otp")
    public String sendOTP(@RequestParam String phoneNumber) {
        String otp = String.format("%06d", (int)(Math.random() * 1000000));
        smsService.sendOTP(phoneNumber, otp);
        return "OTP sent: " + otp;
    }
}