package com.javakart.service;

import com.javakart.dto.LoginDTO;
import com.javakart.dto.UserDTO;
import com.javakart.entity.Cart;
import com.javakart.entity.User;
import com.javakart.exception.UserNotFoundException;
import com.javakart.repository.CartRepository;
import com.javakart.repository.UserRepository;
import com.javakart.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired(required = false) // TEMPORARY: Make it optional
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private EmailService emailService;
    
    @Override
    public UserDTO registerUser(UserDTO userDTO) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setMobile(userDTO.getMobile());
        user.setFullName(userDTO.getFullName());
        
        // Create cart for user
        Cart cart = new Cart();
        cart.setUser(user);
        user.setCart(cart);
        
        User savedUser = userRepository.save(user);
        cartRepository.save(cart);
        
        // Send welcome email
        try {
            emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getFullName());
        } catch (Exception e) {
            System.err.println("Failed to send registration email: " + e.getMessage());
        }
        
        // Return DTO
        return convertToDTO(savedUser);
    }
    
    @Override
    public UserDTO loginUser(LoginDTO loginDTO) {
        try {
            // SIMPLIFIED LOGIN - Without AuthenticationManager for now
            User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
            
            // Manual password check
            if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid password");
            }
            
            // Create simple authentication
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(),
                null,
                List.of(() -> "ROLE_" + user.getRole().name())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            UserDTO userDTO = convertToDTO(user);
            
            // Generate JWT token manually
            String token = jwtUtil.generateToken(
                new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    authentication.getAuthorities()
                )
            );
            
            userDTO.setToken(token);
            return userDTO;
            
        } catch (Exception e) {
            throw new RuntimeException("Invalid username or password: " + e.getMessage());
        }
    }
    
    @Override
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return convertToDTO(user);
    }
    
    @Override
    public UserDTO updateUser(Long userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        // Update allowed fields only
        if (userDTO.getMobile() != null && !userDTO.getMobile().isEmpty()) {
            user.setMobile(userDTO.getMobile());
        }
        
        if (userDTO.getFullName() != null && !userDTO.getFullName().isEmpty()) {
            user.setFullName(userDTO.getFullName());
        }
        
        // Password update (if provided)
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }
    
    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        userRepository.delete(user);
    }
    
    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
    
    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public UserDTO blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        user.setIsActive(false);
        User blockedUser = userRepository.save(user);
        return convertToDTO(blockedUser);
    }
    
    @Override
    public UserDTO unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        user.setIsActive(true);
        User unblockedUser = userRepository.save(user);
        return convertToDTO(unblockedUser);
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setMobile(user.getMobile());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole().name());
        dto.setPassword(""); // Don't expose password
        return dto;
    }
}