package com.javakart.controller;

import com.javakart.dto.LoginDTO;
import com.javakart.dto.UserDTO;
import com.javakart.entity.User;
import com.javakart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserDTO userDTO) {
        UserDTO registeredUser = userService.registerUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }
    
    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody LoginDTO loginDTO) {
        UserDTO loggedInUser = userService.loginUser(loginDTO);
        return ResponseEntity.ok(loggedInUser);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile() {
        User currentUser = userService.getCurrentUser();
        UserDTO user = userService.getUserById(currentUser.getUserId());
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO userDTO) {
        User currentUser = userService.getCurrentUser();
        UserDTO updatedUser = userService.updateUser(currentUser.getUserId(), userDTO);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile() {
        User currentUser = userService.getCurrentUser();
        userService.deleteUser(currentUser.getUserId());
        return ResponseEntity.noContent().build();
    }
}