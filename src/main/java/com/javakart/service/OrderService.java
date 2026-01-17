package com.javakart.service;

import com.javakart.dto.OrderDTO;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder();
    OrderDTO getOrderById(Long orderId);
    List<OrderDTO> getOrders();
    OrderDTO updateOrderStatus(Long orderId, String status);
    OrderDTO cancelOrder(Long orderId);
    List<OrderDTO> getOrdersByUser(Long userId);
}