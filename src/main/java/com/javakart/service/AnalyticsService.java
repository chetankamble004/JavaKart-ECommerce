package com.javakart.service;

import com.javakart.dto.DashboardStatsDTO;
import java.time.LocalDate;
import java.util.Map;

public interface AnalyticsService {
    DashboardStatsDTO getDashboardStats();
    Map<String, Object> getSalesAnalytics(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getUserAnalytics();
    Map<String, Object> getProductAnalytics();
}