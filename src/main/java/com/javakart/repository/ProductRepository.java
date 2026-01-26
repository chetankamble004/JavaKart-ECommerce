package com.javakart.repository;

import com.javakart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory_CategoryId(Long categoryId);
    List<Product> findByProductNameContainingIgnoreCase(String name);
    
    Long countByStockQuantityLessThan(Integer quantity);
    
    // Fixed: Use Long instead of Optional<Long>
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity = :quantity")
    Long countByStockQuantity(@Param("quantity") Integer quantity);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity > :quantity")
    Long countByStockQuantityGreaterThan(@Param("quantity") Integer quantity);
    
    @Query("SELECT c.categoryName, COUNT(p) " +
           "FROM Product p " +
           "LEFT JOIN p.category c " +
           "GROUP BY c.categoryId, c.categoryName")
    List<Object[]> getProductsByCategory();
    
    @Query("SELECT p FROM Product p WHERE p.rating IS NOT NULL ORDER BY p.rating DESC")
    List<Product> findTopRatedProducts();
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity < 10")
    List<Product> findLowStockProducts();
}