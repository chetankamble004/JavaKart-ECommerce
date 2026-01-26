package com.javakart.repository;

import com.javakart.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_ProductId(Long productId);
    List<Review> findByUser_UserId(Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId")
    Optional<Double> findAverageRatingByProductId(@Param("productId") Long productId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.productId = :productId")
    Long countByProductId(@Param("productId") Long productId);
    
    Optional<Review> findByProduct_ProductIdAndUser_UserId(Long productId, Long userId);
}