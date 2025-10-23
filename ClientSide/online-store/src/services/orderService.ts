import apiClient from './api';
import { Order, CreateOrderRequest, CompleteOrderResponse, OrderItem, Shipping, OrderStatus } from '../types';

export const orderService = {
  // Create a complete order with items, payment, and shipping (RECOMMENDED)
  createCompleteOrder: async (orderData: CreateOrderRequest): Promise<CompleteOrderResponse> => {
    const response = await apiClient.post('/orders/complete', orderData);
    return response.data;
  },

  // Get all orders for a customer
  getCustomerOrders: async (customerId: number): Promise<Order[]> => {
    const response = await apiClient.get(`/orders/customer/${customerId}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get order items by order ID
  getOrderItems: async (orderId: number): Promise<OrderItem[]> => {
    const response = await apiClient.get(`/orderitems/order/${orderId}`);
    return response.data;
  },

  // Get shipping information by order ID
  getOrderShipping: async (orderId: number): Promise<Shipping> => {
    const response = await apiClient.get(`/shippings/order/${orderId}`);
    return response.data;
  },

  // Check if order exists
  checkOrderExists: async (orderId: number): Promise<boolean> => {
    const response = await apiClient.get(`/orders/Exists/${orderId}`);
    return response.data;
  },

  // Get all orders (Admin only)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/All');
    return response.data;
  },

  // Update order status (Customer can cancel, Admin can change any status)
  updateOrderStatus: async (orderId: number, status: OrderStatus): Promise<void> => {
    await apiClient.put(`/orders/${orderId}/status`, { status });
  },
};

