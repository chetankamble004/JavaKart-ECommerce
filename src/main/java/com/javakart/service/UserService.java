package com.javakart.service;

import com.javakart.dto.LoginDTO;
import com.javakart.dto.UserDTO;
import com.javakart.entity.User;
import java.util.List;

public interface UserService {
    UserDTO registerUser(UserDTO userDTO);
    UserDTO loginUser(LoginDTO loginDTO);
    UserDTO getUserById(Long userId);
    UserDTO updateUser(Long userId, UserDTO userDTO);
    void deleteUser(Long userId);
    User getCurrentUser();
    
    // New methods for Admin
    List<UserDTO> getAllUsers();
    UserDTO blockUser(Long userId);
    UserDTO unblockUser(Long userId);
}