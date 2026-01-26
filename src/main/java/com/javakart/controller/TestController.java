package com.javakart.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "JavaKart Backend");
        response.put("message", "Backend is running successfully!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("version", "1.0.0");
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "HEALTHY");
        response.put("database", "MySQL Connected");
        response.put("springBoot", "3.1.5");
        response.put("java", "17");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
    
    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody Map<String, Object> data) {
        data.put("serverTime", java.time.LocalDateTime.now().toString());
        data.put("received", true);
        return data;
    }
}