package com.javakart.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;
    
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    private String invoiceNumber;
    private LocalDateTime invoiceDate = LocalDateTime.now();
    private String filePath;
    private Boolean isGenerated = false;
    
    // Constructors
    public Invoice() {}
    
    public Invoice(Long invoiceId, Order order, String invoiceNumber, 
                   LocalDateTime invoiceDate, String filePath, Boolean isGenerated) {
        this.invoiceId = invoiceId;
        this.order = order;
        this.invoiceNumber = invoiceNumber;
        this.invoiceDate = invoiceDate;
        this.filePath = filePath;
        this.isGenerated = isGenerated;
    }
    
    @PrePersist
    public void generateInvoiceNumber() {
        this.invoiceNumber = "INV-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
    }
    
    // Getters and Setters
    public Long getInvoiceId() {
        return invoiceId;
    }
    
    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }
    
    public Order getOrder() {
        return order;
    }
    
    public void setOrder(Order order) {
        this.order = order;
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