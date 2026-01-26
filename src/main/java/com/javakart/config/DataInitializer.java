package com.javakart.config;

import com.javakart.entity.User;
import com.javakart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@javakart.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setFullName("System Administrator");
            admin.setMobile("+911234567890");
            admin.setRole(User.Role.ADMIN);
            admin.setIsActive(true);
            
            userRepository.save(admin);
            logger.info("✅ Default admin user created: admin / Admin@123");
        }
        
        // Create default test user if not exists
        if (!userRepository.existsByUsername("testuser")) {
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setEmail("testuser@javakart.com");
            testUser.setPassword(passwordEncoder.encode("Test@123"));
            testUser.setFullName("Test User");
            testUser.setMobile("+919876543210");
            testUser.setRole(User.Role.USER);
            testUser.setIsActive(true);
            
            userRepository.save(testUser);
            logger.info("✅ Default test user created: testuser / Test@123");
        }
        
        logger.info("✅ Data initialization completed");
    }
}