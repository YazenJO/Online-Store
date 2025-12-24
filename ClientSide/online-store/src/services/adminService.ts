import apiClient from './api';
import { Customer, Order, ProductCatalog, ProductCategory } from '../types';

/**
 * Admin Service
 * 
 * Handles all admin-only operations including:
 * - Customer management
 * - Product management
 * - Category management
 * - Order management (all orders)
 */
export const adminService = {
  // ==================== CUSTOMER MANAGEMENT ====================
  
  /**
   * Get all customers (Admin only)
   */
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await apiClient.get('/Customers/All');
    return response.data;
  },

  /**
   * Get customer by ID (Admin only)
   */
  getCustomerById: async (customerId: number): Promise<Customer> => {
    const response = await apiClient.get(`/Customers/${customerId}`);
    return response.data;
  },

  /**
   * Update customer (Admin only)
   */
  updateCustomer: async (customerId: number, customerData: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.put(`/Customers/${customerId}`, customerData);
    return response.data;
  },

  /**
   * Delete customer (Admin only)
   */
  deleteCustomer: async (customerId: number): Promise<void> => {
    await apiClient.delete(`/Customers/${customerId}`);
  },

  // ==================== PRODUCT MANAGEMENT ====================
  
  /**
   * Create new product (Admin only)
   */
  createProduct: async (productData: Omit<ProductCatalog, 'productID'>): Promise<ProductCatalog> => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  /**
   * Update product (Admin only)
   */
  updateProduct: async (productId: number, productData: Partial<ProductCatalog>): Promise<ProductCatalog> => {
    const response = await apiClient.put(`/products/${productId}`, productData);
    return response.data;
  },

  /**
   * Delete product (Admin only)
   */
  deleteProduct: async (productId: number): Promise<void> => {
    await apiClient.delete(`/products/${productId}`);
  },

  // ==================== CATEGORY MANAGEMENT ====================
  
  /**
   * Create new category (Admin only)
   */
  createCategory: async (categoryData: Omit<ProductCategory, 'categoryID'>): Promise<ProductCategory> => {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },

  /**
   * Update category (Admin only)
   */
  updateCategory: async (categoryId: number, categoryData: Partial<ProductCategory>): Promise<ProductCategory> => {
    const response = await apiClient.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  /**
   * Delete category (Admin only)
   */
  deleteCategory: async (categoryId: number): Promise<void> => {
    await apiClient.delete(`/categories/${categoryId}`);
  },

  // ==================== ORDER MANAGEMENT ====================
  
  /**
   * Get all orders (Admin only)
   */
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/All');
    return response.data;
  },

  /**
   * Update order status (Admin only)
   * Uses PUT /Orders/{id} with full order object
   */
  updateOrderStatus: async (orderId: number, status: number): Promise<Order> => {
    try {
      console.log(`Updating order ${orderId} status to ${status}`);
      
      // Get current order first
      const currentOrderResponse = await apiClient.get(`/Orders/${orderId}`);
      const currentOrder = currentOrderResponse.data;
      
      console.log('Current order retrieved:', currentOrder);
      console.log('Current order keys:', Object.keys(currentOrder));
      
      // Remove navigation properties (customer, items, shipping, payment, statusText)
      // Keep only the core data fields
      const { customer, items, shipping, payment, statusText, ...coreOrderData } = currentOrder;
      
      // Prepare updated order object with new status
      const updatedOrder = {
        ...coreOrderData,  // Include all core fields from the current order
        status: status     // Update the status
      };
      
      console.log('Sending update to PUT /Orders/' + orderId + ' with payload:', updatedOrder);
      console.log('Payload keys:', Object.keys(updatedOrder));
      
      // Update order with PUT /Orders/{id}
      const response = await apiClient.put(`/Orders/${orderId}`, updatedOrder);
      
      console.log('✅ Order status updated successfully!', response);
      
      // Backend might return 204 No Content (success but no body)
      // or 200 OK with the updated order
      if (response.status === 204 || !response.data) {
        // If no data returned, return the updated order we sent
        return { ...currentOrder, status: status };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to update order status:', {
        orderId,
        requestedStatus: status,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        errorStatus: error.response?.status,
        requestUrl: error.config?.url,
        requestMethod: error.config?.method
      });
      
      // Log the exact payload that was sent for debugging
      if (error.config?.data) {
        console.error('Request payload that failed:', JSON.parse(error.config.data));
      }
      
      throw error;
    }
  },

  /**
   * Get order statistics (Admin only)
   */
  getOrderStatistics: async (): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  }> => {
    try {
      const orders = await adminService.getAllOrders();
      
      return {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 1).length,
        completedOrders: orders.filter(o => o.status === 6).length,
        cancelledOrders: orders.filter(o => o.status === 5).length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      };
    } catch (error) {
      console.error('Failed to get order statistics:', error);
      throw error;
    }
  },
};
