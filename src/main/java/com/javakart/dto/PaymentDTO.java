package com.javakart.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

public class PaymentDTO {
    private Long paymentId;
    private Long orderId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
    private LocalDateTime paymentDate;
    
    // Map for additional information (Razorpay keys, etc.)
    private Map<String, String> additionalInfo;
    
    // Constructors
    public PaymentDTO() {
        this.additionalInfo = new HashMap<>();
    }
    
    public PaymentDTO(Long paymentId, Long orderId, BigDecimal amount, String paymentMethod, 
                     String paymentStatus, String transactionId, LocalDateTime paymentDate) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
        this.paymentDate = paymentDate;
        this.additionalInfo = new HashMap<>();
    }
    
    // ========== MANUAL GETTERS & SETTERS ==========
    
    // paymentId
    public Long getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }
    
    // orderId
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    // amount
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    // paymentMethod
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    // paymentStatus
    public String getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    // transactionId
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    // paymentDate
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    // additionalInfo
    public Map<String, String> getAdditionalInfo() {
        return additionalInfo;
    }
    
    public void setAdditionalInfo(Map<String, String> additionalInfo) {
        this.additionalInfo = additionalInfo;
    }
    
    // ========== HELPER METHODS ==========
    
    /**
     * Add single key-value pair to additionalInfo
     */
    public void addAdditionalInfo(String key, String value) {
        if (this.additionalInfo == null) {
            this.additionalInfo = new HashMap<>();
        }
        this.additionalInfo.put(key, value);
    }
    
    /**
     * Get value from additionalInfo by key
     */
    public String getAdditionalInfo(String key) {
        if (this.additionalInfo == null) {
            return null;
        }
        return this.additionalInfo.get(key);
    }
    
    /**
     * Check if additionalInfo contains key
     */
    public boolean hasAdditionalInfo(String key) {
        if (this.additionalInfo == null) {
            return false;
        }
        return this.additionalInfo.containsKey(key);
    }
    
    /**
     * Remove key from additionalInfo
     */
    public void removeAdditionalInfo(String key) {
        if (this.additionalInfo != null) {
            this.additionalInfo.remove(key);
        }
    }
    
    /**
     * Clear all additionalInfo
     */
    public void clearAdditionalInfo() {
        if (this.additionalInfo != null) {
            this.additionalInfo.clear();
        }
    }
    
    /**
     * Check if additionalInfo is empty
     */
    public boolean isAdditionalInfoEmpty() {
        return this.additionalInfo == null || this.additionalInfo.isEmpty();
    }
    
    // ========== UTILITY METHODS ==========
    
    /**
     * Convert to string representation
     */
    @Override
    public String toString() {
        return "PaymentDTO{" +
                "paymentId=" + paymentId +
                ", orderId=" + orderId +
                ", amount=" + amount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", transactionId='" + transactionId + '\'' +
                ", paymentDate=" + paymentDate +
                ", additionalInfo=" + additionalInfo +
                '}';
    }
    
    /**
     * Check if payment is successful
     */
    public boolean isPaymentSuccessful() {
        return "SUCCESS".equalsIgnoreCase(paymentStatus) || 
               "COMPLETED".equalsIgnoreCase(paymentStatus) ||
               "CAPTURED".equalsIgnoreCase(paymentStatus);
    }
    
    /**
     * Check if payment is pending
     */
    public boolean isPaymentPending() {
        return "PENDING".equalsIgnoreCase(paymentStatus) || 
               "CREATED".equalsIgnoreCase(paymentStatus);
    }
    
    /**
     * Check if payment failed
     */
    public boolean isPaymentFailed() {
        return "FAILED".equalsIgnoreCase(paymentStatus) || 
               "CANCELLED".equalsIgnoreCase(paymentStatus);
    }
    
    /**
     * Get Razorpay order ID from additionalInfo
     */
    public String getRazorpayOrderId() {
        return getAdditionalInfo("razorpayOrderId");
    }
    
    /**
     * Get Razorpay key from additionalInfo
     */
    public String getRazorpayKey() {
        return getAdditionalInfo("razorpayKey");
    }
    
    /**
     * Set Razorpay order ID
     */
    public void setRazorpayOrderId(String orderId) {
        addAdditionalInfo("razorpayOrderId", orderId);
    }
    
    /**
     * Set Razorpay key
     */
    public void setRazorpayKey(String key) {
        addAdditionalInfo("razorpayKey", key);
    }
    
    /**
     * Get amount as integer (paise for Razorpay)
     */
    public Integer getAmountInPaise() {
        if (amount == null) {
            return 0;
        }
        return amount.multiply(BigDecimal.valueOf(100)).intValue();
    }
    
    /**
     * Set amount from paise
     */
    public void setAmountFromPaise(Integer paise) {
        if (paise == null) {
            this.amount = BigDecimal.ZERO;
        } else {
            this.amount = BigDecimal.valueOf(paise).divide(BigDecimal.valueOf(100));
        }
    }
    
    /**
     * Convert to JSON-like Map
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("paymentId", paymentId);
        map.put("orderId", orderId);
        map.put("amount", amount);
        map.put("paymentMethod", paymentMethod);
        map.put("paymentStatus", paymentStatus);
        map.put("transactionId", transactionId);
        map.put("paymentDate", paymentDate != null ? paymentDate.toString() : null);
        map.put("additionalInfo", additionalInfo);
        return map;
    }
    
    /**
     * Create PaymentDTO from Map
     */
    public static PaymentDTO fromMap(Map<String, Object> map) {
        PaymentDTO dto = new PaymentDTO();
        
        if (map.containsKey("paymentId")) {
            dto.setPaymentId(((Number) map.get("paymentId")).longValue());
        }
        if (map.containsKey("orderId")) {
            dto.setOrderId(((Number) map.get("orderId")).longValue());
        }
        if (map.containsKey("amount")) {
            Object amountObj = map.get("amount");
            if (amountObj instanceof BigDecimal) {
                dto.setAmount((BigDecimal) amountObj);
            } else if (amountObj instanceof Number) {
                dto.setAmount(BigDecimal.valueOf(((Number) amountObj).doubleValue()));
            }
        }
        if (map.containsKey("paymentMethod")) {
            dto.setPaymentMethod((String) map.get("paymentMethod"));
        }
        if (map.containsKey("paymentStatus")) {
            dto.setPaymentStatus((String) map.get("paymentStatus"));
        }
        if (map.containsKey("transactionId")) {
            dto.setTransactionId((String) map.get("transactionId"));
        }
        if (map.containsKey("paymentDate")) {
            dto.setPaymentDate(LocalDateTime.parse((String) map.get("paymentDate")));
        }
        if (map.containsKey("additionalInfo")) {
            Object infoObj = map.get("additionalInfo");
            if (infoObj instanceof Map) {
                Map<String, String> infoMap = new HashMap<>();
                Map<?, ?> rawMap = (Map<?, ?>) infoObj;
                for (Map.Entry<?, ?> entry : rawMap.entrySet()) {
                    infoMap.put(entry.getKey().toString(), entry.getValue().toString());
                }
                dto.setAdditionalInfo(infoMap);
            }
        }
        
        return dto;
    }
}