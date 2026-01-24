package com.javakart.controller;

import com.javakart.entity.Address;
import com.javakart.entity.User;
import com.javakart.repository.AddressRepository;
import com.javakart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    
    @Autowired
    private AddressRepository addressRepository;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses() {
        User currentUser = userService.getCurrentUser();
        List<Address> addresses = addressRepository.findByUser_UserId(currentUser.getUserId());
        return ResponseEntity.ok(addresses);
    }
    
    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address) {
        User currentUser = userService.getCurrentUser();
        address.setUser(currentUser);
        
        // If this is the first address, set it as default
        List<Address> existingAddresses = addressRepository.findByUser_UserId(currentUser.getUserId());
        if (existingAddresses.isEmpty()) {
            address.setIsDefault(true);
        }
        
        Address savedAddress = addressRepository.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAddress);
    }
    
    @PutMapping("/{addressId}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long addressId, @RequestBody Address address) {
        User currentUser = userService.getCurrentUser();
        Address existingAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // Check if address belongs to current user
        if (!existingAddress.getUser().getUserId().equals(currentUser.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        address.setAddressId(addressId);
        address.setUser(currentUser);
        Address updatedAddress = addressRepository.save(address);
        return ResponseEntity.ok(updatedAddress);
    }
    
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        User currentUser = userService.getCurrentUser();
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // Check if address belongs to current user
        if (!address.getUser().getUserId().equals(currentUser.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        addressRepository.delete(address);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{addressId}/default")
    public ResponseEntity<Address> setDefaultAddress(@PathVariable Long addressId) {
        User currentUser = userService.getCurrentUser();
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // Check if address belongs to current user
        if (!address.getUser().getUserId().equals(currentUser.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Set all addresses to non-default
        List<Address> userAddresses = addressRepository.findByUser_UserId(currentUser.getUserId());
        for (Address addr : userAddresses) {
            addr.setIsDefault(false);
        }
        
        // Set the selected address as default
        address.setIsDefault(true);
        addressRepository.saveAll(userAddresses);
        
        return ResponseEntity.ok(address);
    }
}