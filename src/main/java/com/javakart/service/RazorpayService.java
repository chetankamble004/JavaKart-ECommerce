package com.javakart.service;

import com.javakart.dto.PaymentDTO;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RazorpayService {
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    /**
     * Create a Razorpay order
     */
    public PaymentDTO createRazorpayOrder(PaymentDTO paymentDTO) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", paymentDTO.getAmount().multiply(BigDecimal.valueOf(100)).intValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_rcptid_" + paymentDTO.getOrderId());
        orderRequest.put("payment_capture", 1);
        
        Order order = razorpay.orders.create(orderRequest);
        
        PaymentDTO response = new PaymentDTO();
        response.setOrderId(paymentDTO.getOrderId());
        response.setAmount(paymentDTO.getAmount());
        response.setPaymentMethod("RAZORPAY");
        response.setPaymentStatus("CREATED");
        response.setTransactionId(order.get("id"));
        
        // Create Map<String, String> for additionalInfo
        Map<String, String> additionalInfo = new HashMap<>();
        additionalInfo.put("razorpayKey", razorpayKeyId);
        additionalInfo.put("razorpayOrderId", order.get("id").toString());
        additionalInfo.put("razorpayAmount", order.get("amount").toString());
        additionalInfo.put("razorpayCurrency", order.get("currency").toString());
        
        response.setAdditionalInfo(additionalInfo);
        
        return response;
    }
    
    /**
     * Verify Razorpay payment signature
     */
    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            String generatedSignature = generateHmacSHA256(payload, razorpayKeySecret);
            return generatedSignature.equals(razorpaySignature);
        } catch (Exception e) {
            System.err.println("Payment verification failed: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Generate HMAC SHA256 signature
     */
    private String generateHmacSHA256(String data, String secret) throws Exception {
        javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
        javax.crypto.spec.SecretKeySpec secretKeySpec = 
            new javax.crypto.spec.SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
    
    /**
     * Get payment details from Razorpay
     */
    public Payment getPaymentDetails(String paymentId) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        return razorpay.payments.fetch(paymentId);
    }
    
    /**
     * Get payment details as Map<String, String>
     */
    public Map<String, String> getPaymentDetailsAsMap(String paymentId) throws RazorpayException {
        Payment payment = getPaymentDetails(paymentId);
        return convertJsonObjectToStringMap(payment.toJson());
    }
    
    /**
     * Refund a payment
     */
    public Refund refundPayment(String paymentId, BigDecimal amount) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        
        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue());
        
        return razorpay.payments.refund(paymentId, refundRequest);
    }
    
    /**
     * Refund payment and return as Map<String, String>
     */
    public Map<String, String> refundPaymentAsMap(String paymentId, BigDecimal amount) throws RazorpayException {
        Refund refund = refundPayment(paymentId, amount);
        return convertJsonObjectToStringMap(refund.toJson());
    }
    
    /**
     * Get all payments for an order
     */
    public List<Payment> getOrderPayments(String orderId) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        
        // This returns List<Payment>
        return razorpay.orders.fetchPayments(orderId);
    }
    
    /**
     * Get order payments as JSONArray
     */
    public JSONArray getOrderPaymentsAsJsonArray(String orderId) throws RazorpayException {
        List<Payment> payments = getOrderPayments(orderId);
        JSONArray jsonArray = new JSONArray();
        
        for (Payment payment : payments) {
            jsonArray.put(payment.toJson());
        }
        return jsonArray;
    }
    
    /**
     * Check order status
     */
    public String checkOrderStatus(String orderId) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        Order order = razorpay.orders.fetch(orderId);
        return order.get("status");
    }
    
    /**
     * Fetch order details
     */
    public Order getOrderDetails(String orderId) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        return razorpay.orders.fetch(orderId);
    }
    
    /**
     * Capture payment (for manual capture)
     */
    public Payment capturePayment(String paymentId, BigDecimal amount) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        
        JSONObject captureRequest = new JSONObject();
        captureRequest.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue());
        
        return razorpay.payments.capture(paymentId, captureRequest);
    }
    
    /**
     * FIXED: Get refunds for a payment
     */
    public List<Refund> getPaymentRefunds(String paymentId) throws RazorpayException {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            // First get the payment details
            Payment payment = razorpay.payments.fetch(paymentId);
            
            // Check if payment has refunds in its JSON
            JSONObject paymentJson = payment.toJson();
            if (paymentJson.has("refunds") && !paymentJson.isNull("refunds")) {
                JSONArray refundsArray = paymentJson.getJSONArray("refunds");
                List<Refund> refunds = new ArrayList<>();
                
                for (int i = 0; i < refundsArray.length(); i++) {
                    JSONObject refundJson = refundsArray.getJSONObject(i);
                    Refund refund = new Refund(refundJson);
                    refunds.add(refund);
                }
                return refunds;
            }
            
            return new ArrayList<>(); // Return empty list if no refunds
        } catch (Exception e) {
            throw new RazorpayException("Failed to get refunds: " + e.getMessage());
        }
    }
    
    /**
     * Alternative: Get refunds using direct API call
     */
    public JSONArray getRefundsUsingApi(String paymentId) throws RazorpayException {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            // Create request for refunds
            JSONObject request = new JSONObject();
            String url = "/payments/" + paymentId + "/refunds";
            
            // This would require direct API call, not available in SDK
            // For now, return empty array
            return new JSONArray();
        } catch (Exception e) {
            throw new RazorpayException("Failed to get refunds via API: " + e.getMessage());
        }
    }
    
    /**
     * Get all refunds (alternative implementation)
     */
    public List<Map<String, String>> getAllRefunds(String paymentId) throws RazorpayException {
        List<Refund> refunds = getPaymentRefunds(paymentId);
        List<Map<String, String>> result = new ArrayList<>();
        
        for (Refund refund : refunds) {
            result.add(convertJsonObjectToStringMap(refund.toJson()));
        }
        return result;
    }
    
    /**
     * Check if payment has any refunds
     */
    public boolean hasRefunds(String paymentId) throws RazorpayException {
        List<Refund> refunds = getPaymentRefunds(paymentId);
        return !refunds.isEmpty();
    }
    
    /**
     * Get total refunded amount
     */
    public BigDecimal getTotalRefundedAmount(String paymentId) throws RazorpayException {
        List<Refund> refunds = getPaymentRefunds(paymentId);
        BigDecimal total = BigDecimal.ZERO;
        
        for (Refund refund : refunds) {
            JSONObject refundJson = refund.toJson();
            if (refundJson.has("amount")) {
                int amountPaise = refundJson.getInt("amount");
                total = total.add(BigDecimal.valueOf(amountPaise).divide(BigDecimal.valueOf(100)));
            }
        }
        return total;
    }
    
    /**
     * Utility: Convert JSONObject to Map<String, String>
     */
    private Map<String, String> convertJsonObjectToStringMap(JSONObject jsonObject) {
        Map<String, String> map = new HashMap<>();
        
        if (jsonObject == null) {
            return map;
        }
        
        for (String key : jsonObject.keySet()) {
            Object value = jsonObject.get(key);
            map.put(key, value != null ? value.toString() : "");
        }
        return map;
    }
    
    /**
     * Utility: Convert Payment object to Map<String, String>
     */
    public Map<String, String> paymentToMap(Payment payment) {
        return convertJsonObjectToStringMap(payment.toJson());
    }
    
    /**
     * Utility: Convert Refund object to Map<String, String>
     */
    public Map<String, String> refundToMap(Refund refund) {
        return convertJsonObjectToStringMap(refund.toJson());
    }
    
    /**
     * Utility: Convert Order object to Map<String, String>
     */
    public Map<String, String> orderToMap(Order order) {
        return convertJsonObjectToStringMap(order.toJson());
    }
    
    /**
     * Get payment status with details
     */
    public Map<String, Object> getPaymentStatusDetails(String paymentId) throws RazorpayException {
        Payment payment = getPaymentDetails(paymentId);
        JSONObject json = payment.toJson();
        
        Map<String, Object> statusDetails = new HashMap<>();
        statusDetails.put("status", json.optString("status", "UNKNOWN"));
        statusDetails.put("amount", json.optInt("amount", 0));
        statusDetails.put("currency", json.optString("currency", "INR"));
        statusDetails.put("created_at", json.optLong("created_at", 0));
        statusDetails.put("captured", json.optBoolean("captured", false));
        
        // Check for refunds
        List<Refund> refunds = getPaymentRefunds(paymentId);
        statusDetails.put("has_refunds", !refunds.isEmpty());
        statusDetails.put("refund_count", refunds.size());
        
        return statusDetails;
    }
    
    /**
     * Validate payment before processing
     */
    public boolean validatePayment(String paymentId) throws RazorpayException {
        try {
            Payment payment = getPaymentDetails(paymentId);
            JSONObject json = payment.toJson();
            
            String status = json.optString("status", "");
            boolean captured = json.optBoolean("captured", false);
            
            // Payment should be captured and successful
            return "captured".equalsIgnoreCase(status) && captured;
        } catch (Exception e) {
            return false;
        }
    }
}