package com.javakart.repository;

import com.javakart.entity.Order;
import com.javakart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUser_UserId(Long userId);
    
    Long countByOrderStatus(String status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE DATE(o.orderDate) >= :startDate AND DATE(o.orderDate) <= :endDate")
    Long countOrdersBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus = 'DELIVERED'")
    Optional<BigDecimal> getTotalRevenue();
    
    @Query("SELECT DATE(o.orderDate), SUM(o.totalAmount) FROM Order o " +
           "WHERE DATE(o.orderDate) >= :startDate AND DATE(o.orderDate) <= :endDate " +
           "AND o.orderStatus = 'DELIVERED' " +
           "GROUP BY DATE(o.orderDate)")
    List<Object[]> getDailySalesBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT DATE(o.orderDate), COUNT(o) FROM Order o " +
           "WHERE DATE(o.orderDate) >= :startDate AND DATE(o.orderDate) <= :endDate " +
           "GROUP BY DATE(o.orderDate)")
    List<Object[]> getDailyOrderCount(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p.productName, SUM(oi.quantity) as totalSold " +
           "FROM OrderItem oi " +
           "JOIN oi.product p " +
           "JOIN oi.order o " +
           "WHERE o.orderStatus = 'DELIVERED' " +
           "GROUP BY p.productId, p.productName " +
           "ORDER BY totalSold DESC")
    List<Object[]> getTopSellingProducts();
    
    @Query("SELECT c.categoryName, COUNT(oi) as totalSold " +
           "FROM OrderItem oi " +
           "JOIN oi.product p " +
           "LEFT JOIN p.category c " +
           "JOIN oi.order o " +
           "WHERE o.orderStatus = 'DELIVERED' " +
           "GROUP BY c.categoryId, c.categoryName")
    List<Object[]> getSalesByCategory();
    
    @Query("SELECT COUNT(oi) FROM OrderItem oi " +
           "JOIN oi.order o " +
           "WHERE o.user.userId = :userId AND oi.product.productId = :productId " +
           "AND o.orderStatus = 'DELIVERED'")
    Long hasUserPurchasedProduct(@Param("userId") Long userId, @Param("productId") Long productId);
    
    // For low stock queries
    @Query("SELECT o FROM Order o WHERE o.orderStatus = :status")
    List<Order> findByStatus(@Param("status") String status);
}