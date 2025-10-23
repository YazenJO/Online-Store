import apiClient from './api';
import { Customer, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<{ customer: Customer; token: string }> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (data: RegisterRequest): Promise<{ customer: Customer; token: string }> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<Customer> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (customerId: number, data: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.put(`/customers/${customerId}`, data);
    return response.data;
  },
};

