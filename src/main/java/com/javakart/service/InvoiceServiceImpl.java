package com.javakart.service;

import com.javakart.dto.InvoiceDTO;
import com.javakart.entity.Invoice;
import com.javakart.entity.Order;
import com.javakart.exception.InvalidOrderException;
import com.javakart.repository.InvoiceRepository;
import com.javakart.repository.OrderRepository;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    private final String INVOICE_DIR = "invoices/";
    
    @Override
    public InvoiceDTO generateInvoice(Long orderId) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new InvalidOrderException("Order not found"));
        
        // Check if invoice already exists
        invoiceRepository.findByOrder_OrderId(orderId)
                .ifPresent(invoice -> {
                    throw new RuntimeException("Invoice already exists for this order");
                });
        
        // Create invoice directory if not exists
        Files.createDirectories(Paths.get(INVOICE_DIR));
        
        // Create invoice entity
        Invoice invoice = new Invoice();
        invoice.setOrder(order);
        invoice.setIsGenerated(false);
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        // Generate invoice file
        byte[] pdfBytes = generateInvoicePdf(orderId);
        String fileName = "invoice_" + savedInvoice.getInvoiceNumber() + ".pdf";
        String filePath = INVOICE_DIR + fileName;
        
        Files.write(Paths.get(filePath), pdfBytes);
        
        // Update invoice with file path
        savedInvoice.setFilePath(filePath);
        savedInvoice.setIsGenerated(true);
        invoiceRepository.save(savedInvoice);
        
        return convertToDTO(savedInvoice);
    }
    
    @Override
    public Resource downloadInvoice(Long invoiceId) throws IOException {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        if (!invoice.getIsGenerated()) {
            throw new RuntimeException("Invoice not generated yet");
        }
        
        Path filePath = Paths.get(invoice.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("Invoice file not found");
        }
    }
    
    @Override
    public InvoiceDTO getInvoiceByOrder(Long orderId) {
        Invoice invoice = invoiceRepository.findByOrder_OrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Invoice not found for this order"));
        return convertToDTO(invoice);
    }
    
    @Override
    public byte[] generateInvoicePdf(Long orderId) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new InvalidOrderException("Order not found"));
        
        // Create a simple Word document as PDF (for demo)
        // In production, use proper PDF library like iText or Apache PDFBox
        try (XWPFDocument document = new XWPFDocument()) {
            XWPFParagraph title = document.createParagraph();
            XWPFRun titleRun = title.createRun();
            titleRun.setText("JAVAKART INVOICE");
            titleRun.setBold(true);
            titleRun.setFontSize(20);
            
            XWPFParagraph details = document.createParagraph();
            details.createRun().setText("Invoice Number: INV-" + orderId);
            details.createRun().addBreak();
            details.createRun().setText("Order Date: " + 
                order.getOrderDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")));
            details.createRun().addBreak();
            details.createRun().setText("Customer: " + order.getUser().getFullName());
            details.createRun().addBreak();
            details.createRun().setText("Email: " + order.getUser().getEmail());
            details.createRun().addBreak();
            details.createRun().setText("Shipping Address: " + order.getShippingAddress());
            
            XWPFParagraph itemsTitle = document.createParagraph();
            itemsTitle.createRun().setText("Order Items:");
            itemsTitle.createRun().setBold(true);
            
            order.getOrderItems().forEach(item -> {
                XWPFParagraph itemPara = document.createParagraph();
                itemPara.createRun().setText(
                    String.format("%s x %d = ₹%.2f", 
                        item.getProduct().getProductName(),
                        item.getQuantity(),
                        item.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())).doubleValue()
                    )
                );
            });
            
            XWPFParagraph total = document.createParagraph();
            total.createRun().setText("Total Amount: ₹" + order.getTotalAmount());
            total.createRun().setBold(true);
            
            XWPFParagraph footer = document.createParagraph();
            footer.createRun().setText("Thank you for shopping with JavaKart!");
            
            // Convert to byte array
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            document.write(baos);
            return baos.toByteArray();
        }
    }
    
    private InvoiceDTO convertToDTO(Invoice invoice) {
        InvoiceDTO dto = new InvoiceDTO();
        dto.setInvoiceId(invoice.getInvoiceId());
        dto.setOrderId(invoice.getOrder().getOrderId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setInvoiceDate(invoice.getInvoiceDate());
        dto.setFilePath(invoice.getFilePath());
        dto.setIsGenerated(invoice.getIsGenerated());
        return dto;
    }
}