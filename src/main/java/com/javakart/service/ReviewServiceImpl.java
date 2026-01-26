package com.javakart.service;

import com.javakart.dto.ReviewDTO;
import com.javakart.entity.Product;
import com.javakart.entity.Review;
import com.javakart.entity.User;
import com.javakart.exception.ProductNotFoundException;
import com.javakart.exception.UserNotFoundException;
import com.javakart.repository.OrderRepository;
import com.javakart.repository.ProductRepository;
import com.javakart.repository.ReviewRepository;
import com.javakart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserService userService;
    
    @Override
    public ReviewDTO addReview(ReviewDTO reviewDTO) {
        Product product = productRepository.findById(reviewDTO.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        
        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        // Check if user has purchased this product
        boolean hasPurchased = hasUserPurchasedProduct(user.getUserId(), product.getProductId());
        
        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setReviewDate(LocalDateTime.now());
        review.setIsVerifiedPurchase(hasPurchased);
        
        Review savedReview = reviewRepository.save(review);
        
        // Update product average rating
        updateProductRating(product.getProductId());
        
        return convertToDTO(savedReview);
    }
    
    @Override
    public ReviewDTO updateReview(Long reviewId, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        // Check if review belongs to current user
        User currentUser = userService.getCurrentUser();
        if (!review.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("You can only update your own reviews");
        }
        
        if (reviewDTO.getRating() != null) {
            review.setRating(reviewDTO.getRating());
        }
        
        if (reviewDTO.getComment() != null) {
            review.setComment(reviewDTO.getComment());
        }
        
        Review updatedReview = reviewRepository.save(review);
        
        // Update product average rating
        updateProductRating(review.getProduct().getProductId());
        
        return convertToDTO(updatedReview);
    }
    
    @Override
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        // Check if review belongs to current user
        User currentUser = userService.getCurrentUser();
        if (!review.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        
        Long productId = review.getProduct().getProductId();
        reviewRepository.delete(review);
        
        // Update product average rating
        updateProductRating(productId);
    }
    
    @Override
    public List<ReviewDTO> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ReviewDTO> getReviewsByUser(Long userId) {
        return reviewRepository.findByUser_UserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Double getAverageRating(Long productId) {
        return reviewRepository.findAverageRatingByProductId(productId)
                .orElse(0.0);
    }
    
    @Override
    public ReviewDTO getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return convertToDTO(review);
    }
    
    @Override
    public Boolean hasUserPurchasedProduct(Long userId, Long productId) {
        // Check if user has any order containing this product
        return orderRepository.hasUserPurchasedProduct(userId, productId) > 0;
    }
    
    private void updateProductRating(Long productId) {
        Double averageRating = getAverageRating(productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        product.setRating(averageRating);
        productRepository.save(product);
    }
    
    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setProductId(review.getProduct().getProductId());
        dto.setUserId(review.getUser().getUserId());
        dto.setUserName(review.getUser().getFullName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setReviewDate(review.getReviewDate());
        dto.setIsVerifiedPurchase(review.getIsVerifiedPurchase());
        return dto;
    }
}