package com.javakart.dto;

public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private String mobile;
    private String fullName;
    private String password;
    private String token;
    private String role;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(Long userId, String username, String email, String mobile, 
                   String fullName, String password, String token, String role) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.mobile = mobile;
        this.fullName = fullName;
        this.password = password;
        this.token = token;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMobile() {
        return mobile;
    }
    
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}