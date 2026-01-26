package com.javakart.dto;

import java.time.LocalDateTime;

public class ReviewDTO {
    private Long reviewId;
    private Long productId;
    private Long userId;
    private String userName;
    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;
    private Boolean isVerifiedPurchase;
    
    // Constructors
    public ReviewDTO() {}
    
    public ReviewDTO(Long reviewId, Long productId, Long userId, String userName, 
                     Integer rating, String comment, LocalDateTime reviewDate, 
                     Boolean isVerifiedPurchase) {
        this.reviewId = reviewId;
        this.productId = productId;
        this.userId = userId;
        this.userName = userName;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
        this.isVerifiedPurchase = isVerifiedPurchase;
    }
    
    // Getters and Setters
    public Long getReviewId() {
        return reviewId;
    }
    
    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public LocalDateTime getReviewDate() {
        return reviewDate;
    }
    
    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }
    
    public Boolean getIsVerifiedPurchase() {
        return isVerifiedPurchase;
    }
    
    public void setIsVerifiedPurchase(Boolean isVerifiedPurchase) {
        this.isVerifiedPurchase = isVerifiedPurchase;
    }
}