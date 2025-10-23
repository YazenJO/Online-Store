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
   */
  updateOrderStatus: async (orderId: number, status: number): Promise<Order> => {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status });
    return response.data;
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
