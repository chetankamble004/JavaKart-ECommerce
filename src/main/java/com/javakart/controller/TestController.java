package com.javakart.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping
    public String test() {
        return "🚀 JavaKart Backend is Running Successfully!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "{\"status\": \"UP\", \"service\": \"JavaKart\"}";
    }
}