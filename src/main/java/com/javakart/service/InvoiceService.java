package com.javakart.service;

import com.javakart.dto.InvoiceDTO;
import org.springframework.core.io.Resource;
import java.io.IOException;

public interface InvoiceService {
    InvoiceDTO generateInvoice(Long orderId) throws IOException;
    Resource downloadInvoice(Long invoiceId) throws IOException;
    InvoiceDTO getInvoiceByOrder(Long orderId);
    byte[] generateInvoicePdf(Long orderId) throws IOException;
}