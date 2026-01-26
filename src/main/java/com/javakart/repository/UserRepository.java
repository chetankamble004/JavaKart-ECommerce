package com.javakart.repository;

import com.javakart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    Long countByIsActive(Boolean isActive);
    
    @Query("SELECT MONTH(u.createdAt), YEAR(u.createdAt), COUNT(u) " +
           "FROM User u " +
           "GROUP BY YEAR(u.createdAt), MONTH(u.createdAt) " +
           "ORDER BY YEAR(u.createdAt) DESC, MONTH(u.createdAt) DESC")
    List<Object[]> getUserRegistrationByMonth();
    
    @Query("SELECT MONTH(u.createdAt), YEAR(u.createdAt), COUNT(u) " +
           "FROM User u " +
           "WHERE u.createdAt >= DATEADD(MONTH, -6, CURRENT_DATE) " +
           "GROUP BY YEAR(u.createdAt), MONTH(u.createdAt) " +
           "ORDER BY YEAR(u.createdAt), MONTH(u.createdAt)")
    List<Object[]> getUserRegistrationLast6Months();
    
    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> getUsersByRole();
}