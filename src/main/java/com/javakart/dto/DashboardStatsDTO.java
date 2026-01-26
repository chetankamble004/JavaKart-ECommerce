package com.javakart.dto;

import java.math.BigDecimal;

public class DashboardStatsDTO {
    private Long totalUsers;
    private Long totalOrders;
    private Long totalProducts;
    private BigDecimal totalRevenue;
    private Long pendingOrders;
    private Long deliveredOrders;
    private Long lowStockProducts;
    private Object revenueChart;
    private Object orderChart;
    private Object userChart;
    
    // Constructors
    public DashboardStatsDTO() {}
    
    public DashboardStatsDTO(Long totalUsers, Long totalOrders, Long totalProducts, 
                             BigDecimal totalRevenue, Long pendingOrders, Long deliveredOrders, 
                             Long lowStockProducts, Object revenueChart, Object orderChart, 
                             Object userChart) {
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalProducts = totalProducts;
        this.totalRevenue = totalRevenue;
        this.pendingOrders = pendingOrders;
        this.deliveredOrders = deliveredOrders;
        this.lowStockProducts = lowStockProducts;
        this.revenueChart = revenueChart;
        this.orderChart = orderChart;
        this.userChart = userChart;
    }
    
    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }
    
    public Long getTotalOrders() {
        return totalOrders;
    }
    
    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }
    
    public Long getTotalProducts() {
        return totalProducts;
    }
    
    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }
    
    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
    
    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    
    public Long getPendingOrders() {
        return pendingOrders;
    }
    
    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }
    
    public Long getDeliveredOrders() {
        return deliveredOrders;
    }
    
    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }
    
    public Long getLowStockProducts() {
        return lowStockProducts;
    }
    
    public void setLowStockProducts(Long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }
    
    public Object getRevenueChart() {
        return revenueChart;
    }
    
    public void setRevenueChart(Object revenueChart) {
        this.revenueChart = revenueChart;
    }
    
    public Object getOrderChart() {
        return orderChart;
    }
    
    public void setOrderChart(Object orderChart) {
        this.orderChart = orderChart;
    }
    
    public Object getUserChart() {
        return userChart;
    }
    
    public void setUserChart(Object userChart) {
        this.userChart = userChart;
    }
}