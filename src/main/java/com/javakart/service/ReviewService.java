package com.javakart.service;

import com.javakart.dto.ReviewDTO;
import java.util.List;

public interface ReviewService {
    ReviewDTO addReview(ReviewDTO reviewDTO);
    ReviewDTO updateReview(Long reviewId, ReviewDTO reviewDTO);
    void deleteReview(Long reviewId);
    List<ReviewDTO> getReviewsByProduct(Long productId);
    List<ReviewDTO> getReviewsByUser(Long userId);
    Double getAverageRating(Long productId);
    ReviewDTO getReviewById(Long reviewId);
    Boolean hasUserPurchasedProduct(Long userId, Long productId);
}