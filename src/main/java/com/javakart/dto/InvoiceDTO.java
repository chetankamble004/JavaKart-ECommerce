package com.javakart.dto;

import java.time.LocalDateTime;

public class InvoiceDTO {
    private Long invoiceId;
    private Long orderId;
    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private String filePath;
    private Boolean isGenerated;
    
    // Constructors
    public InvoiceDTO() {}
    
    public InvoiceDTO(Long invoiceId, Long orderId, String invoiceNumber, 
                      LocalDateTime invoiceDate, String filePath, Boolean isGenerated) {
        this.invoiceId = invoiceId;
        this.orderId = orderId;
        this.invoiceNumber = invoiceNumber;
        this.invoiceDate = invoiceDate;
        this.filePath = filePath;
        this.isGenerated = isGenerated;
    }
    
    // Getters and Setters
    public Long getInvoiceId() {
        return invoiceId;
    }
    
    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }
    
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public String getInvoiceNumber() {
        return invoiceNumber;
    }
    
    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }
    
    public LocalDateTime getInvoiceDate() {
        return invoiceDate;
    }
    
    public void setInvoiceDate(LocalDateTime invoiceDate) {
        this.invoiceDate = invoiceDate;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public Boolean getIsGenerated() {
        return isGenerated;
    }
    
    public void setIsGenerated(Boolean isGenerated) {
        this.isGenerated = isGenerated;
    }
}