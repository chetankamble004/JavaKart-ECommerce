package com.javakart.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class FileUploadController {
    
    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    
    @Value("${app.upload-dir:uploads/}")
    private String uploadDir;
    
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};
    
    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check file size
            if (file.getSize() > MAX_FILE_SIZE) {
                response.put("success", false);
                response.put("message", "File size exceeds 10MB limit");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check file extension
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            }
            
            boolean validExtension = false;
            for (String ext : ALLOWED_EXTENSIONS) {
                if (ext.equals(fileExtension)) {
                    validExtension = true;
                    break;
                }
            }
            
            if (!validExtension) {
                response.put("success", false);
                response.put("message", "Allowed file types: " + String.join(", ", ALLOWED_EXTENSIONS));
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);
            
            // Save file
            Files.copy(file.getInputStream(), filePath);
            
            // Create relative URL for frontend
            String fileUrl = "/uploads/" + uniqueFilename;
            
            logger.info("File uploaded successfully: {}", uniqueFilename);
            
            response.put("success", true);
            response.put("message", "File uploaded successfully");
            response.put("filename", uniqueFilename);
            response.put("originalFilename", originalFilename);
            response.put("fileUrl", fileUrl);
            response.put("fileSize", file.getSize());
            response.put("fileType", file.getContentType());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Failed to upload file: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            logger.error("Unexpected error during file upload: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> uploadProductImage(
            @PathVariable Long productId,
            @RequestParam("image") MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // First upload the image
            ResponseEntity<Map<String, Object>> uploadResponse = uploadImage(file);
            
            if (!Boolean.TRUE.equals(uploadResponse.getBody().get("success"))) {
                return uploadResponse;
            }
            
            Map<String, Object> uploadResult = uploadResponse.getBody();
            String imageUrl = (String) uploadResult.get("fileUrl");
            
            // Here you would update the product in database with the image URL
            // Example: productService.updateProductImage(productId, imageUrl);
            
            logger.info("Image uploaded for product ID {}: {}", productId, imageUrl);
            
            response.put("success", true);
            response.put("message", "Product image uploaded successfully");
            response.put("productId", productId);
            response.put("imageUrl", imageUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to upload product image: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Failed to upload product image");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{filename}")
    public ResponseEntity<Map<String, Object>> deleteFile(@PathVariable String filename) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Path filePath = Paths.get(uploadDir, filename);
            
            if (!Files.exists(filePath)) {
                response.put("success", false);
                response.put("message", "File not found: " + filename);
                return ResponseEntity.notFound().build();
            }
            
            Files.delete(filePath);
            logger.info("File deleted: {}", filename);
            
            response.put("success", true);
            response.put("message", "File deleted successfully");
            response.put("filename", filename);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Failed to delete file {}: {}", filename, e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Failed to delete file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/check/{filename}")
    public ResponseEntity<Map<String, Object>> checkFile(@PathVariable String filename) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Path filePath = Paths.get(uploadDir, filename);
            
            if (!Files.exists(filePath)) {
                response.put("exists", false);
                response.put("message", "File not found");
                return ResponseEntity.ok(response);
            }
            
            response.put("exists", true);
            response.put("filename", filename);
            response.put("size", Files.size(filePath));
            response.put("lastModified", Files.getLastModifiedTime(filePath).toString());
            response.put("url", "/uploads/" + filename);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Error checking file {}: {}", filename, e.getMessage(), e);
            response.put("exists", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}