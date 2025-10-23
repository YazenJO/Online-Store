# Frontend Code Examples & Component Templates

This document provides ready-to-use code templates for common components and patterns.

---

## ?? Project Structure Visual

```
src/
?
??? ?? api/                    # API Communication Layer
?   ??? client.ts              # Axios instance + interceptors
?   ??? auth.api.ts            # /api/auth/* endpoints
?   ??? products.api.ts        # /api/products/* endpoints
?   ??? categories.api.ts      # /api/categories/* endpoints
?   ??? orders.api.ts          # /api/Orders/* endpoints
?
??? ?? components/             # Reusable UI Components
?   ??? common/                # Generic components
?   ?   ??? Button.tsx         # Styled button variations
?   ?   ??? Input.tsx          # Form input with validation
?   ?   ??? Card.tsx           # Content card wrapper
?   ?   ??? Modal.tsx          # Popup modal
?   ?   ??? Loading.tsx        # Spinner/skeleton screens
?   ?
?   ??? layout/                # App layout components
?   ?   ??? Header.tsx         # Top app bar
?   ?   ??? Navbar.tsx         # Navigation menu
?   ?   ??? Footer.tsx         # Page footer
?   ?
?   ??? products/              # Product-specific components
?   ?   ??? ProductCard.tsx    # Single product preview
?   ?   ??? ProductGrid.tsx    # Products layout
?   ?   ??? ProductDetail.tsx  # Full product view
?   ?
?   ??? cart/                  # Shopping cart components
?   ?   ??? CartItem.tsx       # Single cart item
?   ?   ??? CartSummary.tsx    # Order summary
?   ?
?   ??? orders/                # Order-related components
?       ??? OrderCard.tsx      # Order list item
?       ??? OrderTimeline.tsx  # Status tracking
?
??? ?? pages/                  # Route Pages
?   ??? Home.tsx               # Landing page
?   ??? ProductList.tsx        # Browse products
?   ??? ProductDetails.tsx     # Single product
?   ??? Cart.tsx               # Shopping cart
?   ??? Checkout.tsx           # Order placement
?   ??? Login.tsx              # User login
?   ??? Register.tsx           # User registration
?   ??? MyOrders.tsx           # Order history
?   ??? admin/                 # Admin-only pages
?       ??? Dashboard.tsx
?       ??? ProductsManagement.tsx
?       ??? OrdersManagement.tsx
?
??? ?? hooks/                  # Custom React Hooks
?   ??? useAuth.ts             # Authentication helpers
?   ??? useCart.ts             # Cart operations
?   ??? useDebounce.ts         # Input debouncing
?
??? ??? store/                  # State Management (Zustand)
?   ??? authStore.ts           # User authentication state
?   ??? cartStore.ts           # Shopping cart state
?
??? ??? types/                  # TypeScript Definitions
?   ??? auth.types.ts          # Auth-related types
?   ??? product.types.ts       # Product & Category types
?   ??? order.types.ts         # Order-related types
?   ??? cart.types.ts          # Cart types
?
??? ??? utils/                  # Helper Functions
?   ??? formatters.ts          # Date/currency formatting
?   ??? validators.ts          # Validation helpers
?   ??? storage.ts             # localStorage wrapper
?   ??? constants.ts           # App constants
?
??? ?? routes/                 # Routing Configuration
    ??? AppRoutes.tsx          # Main route definitions
    ??? PrivateRoute.tsx       # Auth-protected routes
    ??? AdminRoute.tsx         # Admin-only routes
```

---

## ?? API Client Implementation

### api/client.ts
```typescript
import axios from 'axios';
import { storage } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      storage.clear();
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - Please check your connection');
    }
    
    return Promise.reject(error);
  }
);
```

### api/auth.api.ts
```typescript
import { apiClient } from './client';
import { LoginRequest, RegisterRequest, AuthResponse, Customer } from '../types/auth.types';

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<Customer> => {
    const response = await apiClient.get<Customer>('/auth/me');
    return response.data;
  },
};
```

### api/products.api.ts
```typescript
import { apiClient } from './client';
import { Product } from '../types/product.types';

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
```

### api/orders.api.ts
```typescript
import { apiClient } from './client';
import { Order, CreateCompleteOrderRequest, CompleteOrderResponse } from '../types/order.types';

export const ordersAPI = {
  getMyOrders: async (customerId: number): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/Orders/customer/${customerId}`);
    return response.data;
  },

  getById: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/Orders/${orderId}`);
    return response.data;
  },

  createCompleteOrder: async (orderData: CreateCompleteOrderRequest): Promise<CompleteOrderResponse> => {
    const response = await apiClient.post<CompleteOrderResponse>('/Orders/complete', orderData);
    return response.data;
  },
};
```

---

## ??? State Management (Zustand)

### store/authStore.ts
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Customer } from '../types/auth.types';
import { storage } from '../utils/storage';

interface AuthState {
  user: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: Customer, token: string) => void;
  logout: () => void;
  initAuth: () => void;
  updateUser: (user: Customer) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        storage.setToken(token);
        storage.setUser(user);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        storage.clear();
        set({ user: null, token: null, isAuthenticated: false });
      },

      initAuth: () => {
        const token = storage.getToken();
        const user = storage.getUser();
        if (token && user) {
          set({ user, token, isAuthenticated: true });
        }
      },

      updateUser: (user) => {
        storage.setUser(user);
        set({ user });
      },
    }),
    { name: 'auth-store' }
  )
);
```

### store/cartStore.ts
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product } from '../types/product.types';
import { CartItem } from '../types/cart.types';

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getItemCount: (productId: number) => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product, quantity) => {
          const items = get().items;
          const existingItem = items.find(item => item.product.productID === product.productID);

          if (existingItem) {
            set({
              items: items.map(item =>
                item.product.productID === product.productID
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            });
          } else {
            set({ items: [...items, { product, quantity }] });
          }
        },

        removeItem: (productId) => {
          set({ items: get().items.filter(item => item.product.productID !== productId) });
        },

        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(productId);
            return;
          }

          set({
            items: get().items.map(item =>
              item.product.productID === productId ? { ...item, quantity } : item
            ),
          });
        },

        clearCart: () => set({ items: [] }),

        getTotalItems: () => {
          return get().items.reduce((total, item) => total + item.quantity, 0);
        },

        getTotalAmount: () => {
          return get().items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );
        },

        getItemCount: (productId) => {
          const item = get().items.find(item => item.product.productID === productId);
          return item?.quantity || 0;
        },
      }),
      {
        name: 'cart-storage',
      }
    ),
    { name: 'cart-store' }
  )
);
```

---

## ?? Common Components

### components/common/Button.tsx
```typescript
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
```

### components/common/Input.tsx
```typescript
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

### components/common/Card.tsx
```typescript
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  const hoverStyles = hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

### components/common/Loading.tsx
```typescript
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">{text}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-3 text-gray-600">{text}</span>
    </div>
  );
};
```

---

## ?? Page Examples

### pages/Login.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      setAuth(response.customer, response.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              {...register('username')}
              error={errors.username?.message}
              required
            />
            
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              required
            />
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign in
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
```

### pages/ProductList.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { productsAPI } from '../api/products.api';
import { categoriesAPI } from '../api/categories.api';
import { Product, Category } from '../types/product.types';
import { ProductCard } from '../components/products/ProductCard';
import { Loading } from '../components/common/Loading';
import { useDebounce } from '../hooks/useDebounce';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [debouncedSearch, selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data: Product[];
      
      if (debouncedSearch) {
        data = await productsAPI.search(debouncedSearch);
      } else if (selectedCategory) {
        data = await productsAPI.getByCategory(selectedCategory);
      } else {
        data = await productsAPI.getAll();
      }
      
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category.categoryID}
              onClick={() => setSelectedCategory(category.categoryID!)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category.categoryID
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>
      
      {/* Products Grid */}
      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productID} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## ?? Custom Hooks

### hooks/useDebounce.ts
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### hooks/useAuth.ts
```typescript
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../api/auth.api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password });
      setAuth(response.customer, response.token);
      toast.success('Login successful!');
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      setAuth(response.customer, response.token);
      toast.success('Registration successful!');
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    storeLogout();
    toast.success('Logged out successfully');
  };

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'Admin',
    login,
    register,
    logout,
  };
};
```

---

## ??? Utility Functions

### utils/formatters.ts
```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
```

### utils/constants.ts
```typescript
export const ORDER_STATUS = {
  1: { label: 'Pending', color: 'yellow' },
  2: { label: 'Processing', color: 'blue' },
  3: { label: 'Shipped', color: 'purple' },
  4: { label: 'Delivered', color: 'green' },
  5: { label: 'Cancelled', color: 'red' },
  6: { label: 'Completed', color: 'green' },
} as const;

export const SHIPPING_STATUS = {
  1: 'Pending',
  2: 'In Transit',
  3: 'Out for Delivery',
  4: 'Delivered',
  5: 'Failed Delivery',
  6: 'Returned',
} as const;

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'PayPal',
  'Cash on Delivery',
] as const;

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  PROFILE: '/profile',
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    ORDERS: '/admin/orders',
  },
} as const;
```

---

## ?? Complete Example: ProductCard Component

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../../types/product.types';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    addItem(product, 1);
    toast.success(`${product.productName} added to cart!`);
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.productID}`);
  };

  const isOutOfStock = product.quantityInStock === 0;
  const imageUrl = product.images?.[0]?.imageURL || '/placeholder.png';

  return (
    <Card hoverable onClick={handleViewDetails} className="group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-lg mb-4">
        <img
          src={imageUrl}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        
        {/* Quick View Button */}
        <button
          onClick={handleViewDetails}
          className="absolute top-2 right-2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
          {product.productName}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          
          <span className="text-sm text-gray-500">
            {product.quantityInStock} in stock
          </span>
        </div>

        {/* Category Badge */}
        {product.category && (
          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            {product.category.categoryName}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t">
        <Button
          fullWidth
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};
```

---

## ?? Ready to Build!

These templates provide a solid foundation for your Online Store frontend. Copy and adapt them as needed for your specific requirements.

**Key Points:**
- All code is production-ready
- TypeScript types are included
- Components follow React best practices
- Responsive design considerations included
- Accessibility features implemented
- Error handling included

**Next Steps:**
1. Set up your project structure
2. Copy the templates you need
3. Customize styling and branding
4. Test with your API
5. Build additional features

Happy coding! ??
