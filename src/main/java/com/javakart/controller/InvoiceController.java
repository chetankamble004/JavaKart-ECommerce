package com.javakart.controller;

import com.javakart.dto.InvoiceDTO;
import com.javakart.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    
    @Autowired
    private InvoiceService invoiceService;
    
    @PostMapping("/order/{orderId}")
    public ResponseEntity<InvoiceDTO> generateInvoice(@PathVariable Long orderId) throws IOException {
        InvoiceDTO invoice = invoiceService.generateInvoice(orderId);
        return ResponseEntity.ok(invoice);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<InvoiceDTO> getInvoiceByOrder(@PathVariable Long orderId) {
        InvoiceDTO invoice = invoiceService.getInvoiceByOrder(orderId);
        return ResponseEntity.ok(invoice);
    }
    
    @GetMapping("/{invoiceId}/download")
    public ResponseEntity<Resource> downloadInvoice(@PathVariable Long invoiceId) throws IOException {
        Resource resource = invoiceService.downloadInvoice(invoiceId);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoice.pdf\"")
                .body(resource);
    }
    
    @GetMapping("/{invoiceId}/preview")
    public ResponseEntity<byte[]> previewInvoice(@PathVariable Long invoiceId) throws IOException {
        byte[] pdfBytes = invoiceService.generateInvoicePdf(invoiceId);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"invoice.pdf\"")
                .body(pdfBytes);
    }
}