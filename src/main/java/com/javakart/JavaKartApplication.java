package com.javakart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JavaKartApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(JavaKartApplication.class, args);
        System.out.println("✅ JavaKart Backend Started Successfully!");
    }
}