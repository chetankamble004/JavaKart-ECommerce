package com.javakart.service;

import com.javakart.dto.DashboardStatsDTO;
import com.javakart.repository.OrderRepository;
import com.javakart.repository.ProductRepository;
import com.javakart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AnalyticsServiceImpl implements AnalyticsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Override
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // Basic counts
        stats.setTotalUsers(userRepository.count());
        stats.setTotalOrders(orderRepository.count());
        stats.setTotalProducts(productRepository.count());
        
        // Total revenue - handle Optional properly
        BigDecimal totalRevenue = orderRepository.getTotalRevenue()
                .orElse(BigDecimal.ZERO);
        stats.setTotalRevenue(totalRevenue);
        
        // Order status counts
        stats.setPendingOrders(orderRepository.countByOrderStatus("PENDING"));
        stats.setDeliveredOrders(orderRepository.countByOrderStatus("DELIVERED"));
        
        // Low stock products (less than 10)
        Long lowStockCount = productRepository.countByStockQuantityLessThan(10);
        stats.setLowStockProducts(lowStockCount != null ? lowStockCount : 0L);
        
        // Chart data
        stats.setRevenueChart(getRevenueChartData());
        stats.setOrderChart(getOrderChartData());
        stats.setUserChart(getUserChartData());
        
        return stats;
    }
    
    @Override
    public Map<String, Object> getSalesAnalytics(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Get daily sales data
        List<Object[]> dailySales = orderRepository.getDailySalesBetweenDates(startDate, endDate);
        Map<String, BigDecimal> salesMap = new HashMap<>();
        
        for (Object[] row : dailySales) {
            if (row[0] != null && row[1] != null) {
                String date = row[0].toString();
                BigDecimal amount = (BigDecimal) row[1];
                salesMap.put(date, amount);
            }
        }
        
        analytics.put("dailySales", salesMap);
        
        // Get top selling products
        List<Object[]> topProducts = orderRepository.getTopSellingProducts();
        analytics.put("topProducts", topProducts);
        
        // Get sales by category
        List<Object[]> salesByCategory = orderRepository.getSalesByCategory();
        analytics.put("salesByCategory", salesByCategory);
        
        return analytics;
    }
    
    @Override
    public Map<String, Object> getUserAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Get user counts
        analytics.put("totalUsers", userRepository.count());
        analytics.put("activeUsers", userRepository.count());
        
        return analytics;
    }
    
    @Override
    public Map<String, Object> getProductAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Product counts
        analytics.put("totalProducts", productRepository.count());
        
        // Stock status
        Long outOfStock = productRepository.countByStockQuantity(0);
        Long lowStock = productRepository.countByStockQuantityLessThan(10);
        Long inStock = productRepository.count() - (outOfStock + lowStock);
        
        analytics.put("outOfStock", outOfStock != null ? outOfStock : 0);
        analytics.put("lowStock", lowStock != null ? lowStock : 0);
        analytics.put("inStock", inStock);
        
        return analytics;
    }
    
    private Map<String, Object> getRevenueChartData() {
        // Last 7 days revenue
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);
        
        return getSalesAnalytics(startDate, endDate);
    }
    
    private Map<String, Object> getOrderChartData() {
        Map<String, Object> chartData = new HashMap<>();
        
        // Order status distribution
        Map<String, Long> orderStatus = new HashMap<>();
        orderStatus.put("PENDING", orderRepository.countByOrderStatus("PENDING"));
        orderStatus.put("PROCESSING", orderRepository.countByOrderStatus("PROCESSING"));
        orderStatus.put("SHIPPED", orderRepository.countByOrderStatus("SHIPPED"));
        orderStatus.put("DELIVERED", orderRepository.countByOrderStatus("DELIVERED"));
        orderStatus.put("CANCELLED", orderRepository.countByOrderStatus("CANCELLED"));
        
        chartData.put("orderStatus", orderStatus);
        
        return chartData;
    }
    
    private Map<String, Object> getUserChartData() {
        Map<String, Object> chartData = new HashMap<>();
        
        // Simple user count
        chartData.put("totalUsers", userRepository.count());
        
        return chartData;
    }
}