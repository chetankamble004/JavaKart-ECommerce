package com.javakart.service;

import com.javakart.dto.LoginDTO;
import com.javakart.dto.UserDTO;
import com.javakart.entity.User;

public interface UserService {
    UserDTO registerUser(UserDTO userDTO);
    UserDTO loginUser(LoginDTO loginDTO);
    UserDTO getUserById(Long userId);
    UserDTO updateUser(Long userId, UserDTO userDTO);
    void deleteUser(Long userId);
    User getCurrentUser();  // This returns User entity, not UserDTO
}