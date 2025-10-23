import apiClient from './api';
import { ProductCatalog, ProductCategory, Review, CreateReviewRequest } from '../types';

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<ProductCatalog[]> => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<ProductCatalog> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get all categories
  getAllCategories: async (): Promise<ProductCategory[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<ProductCategory> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  // Check if product exists
  checkProductExists: async (id: number): Promise<boolean> => {
    const response = await apiClient.get(`/products/Exists/${id}`);
    return response.data;
  },

  // Filter products by category (client-side filtering)
  getProductsByCategory: async (categoryId: number): Promise<ProductCatalog[]> => {
    const allProducts = await productService.getAllProducts();
    return allProducts.filter(product => product.categoryID === categoryId);
  },

  // Search products (client-side search)
  searchProducts: async (query: string): Promise<ProductCatalog[]> => {
    const allProducts = await productService.getAllProducts();
    const searchTerm = query.toLowerCase();
    return allProducts.filter(product => 
      product.productName.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  },

  // Get product reviews (if backend supports it in the future)
  getProductReviews: async (productId: number): Promise<Review[]> => {
    try {
      const response = await apiClient.get(`/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist, return empty array
      console.log('Reviews endpoint not available');
      return [];
    }
  },

  // Create a review (if backend supports it in the future)
  createReview: async (review: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post('/reviews', review);
    return response.data;
  },
};

