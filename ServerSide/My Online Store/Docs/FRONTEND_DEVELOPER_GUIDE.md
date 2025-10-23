# Online Store - Frontend Developer Documentation

**Version:** 1.0  
**Last Updated:** 2024  
**API Base URL:** `https://localhost:7XXX/api` (replace with actual port)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Design & UI Guidelines](#2-design--ui-guidelines)
3. [Recommended Tech Stack](#3-recommended-tech-stack)
4. [File & Folder Structure](#4-file--folder-structure)
5. [API Documentation](#5-api-documentation)
6. [Data Models & Types](#6-data-models--types)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [State Management Strategy](#8-state-management-strategy)
9. [Routing & Navigation](#9-routing--navigation)
10. [Setup & Installation](#10-setup--installation)
11. [Best Practices & Coding Standards](#11-best-practices--coding-standards)
12. [Error Handling](#12-error-handling)
13. [Testing Requirements](#13-testing-requirements)

---

## 1. Project Overview

### 1.1 Purpose
The **Online Store** is a full-featured e-commerce web application that allows customers to browse products, manage shopping carts, place orders, and track shipments. Administrators can manage products, categories, customers, orders, and inventory.

### 1.2 Goals
- Provide a seamless shopping experience for customers
- Enable secure user authentication and authorization
- Support complete order management workflow (cart ? checkout ? payment ? shipping)
- Allow product browsing with search and category filtering
- Implement role-based access control (Customer/Admin)
- Ensure responsive design for mobile and desktop

### 1.3 Target Users
- **Customers:** Browse products, create accounts, place orders, track shipments
- **Administrators:** Manage products, categories, view all orders, manage customers
- **Guest Users:** Browse products (limited access without registration)

### 1.4 Core Features
- User registration and login with JWT authentication
- Product catalog with categories and images
- Product search and filtering
- Shopping cart management
- Complete order processing (items + payment + shipping)
- Order history and tracking
- Admin dashboard for management
- Responsive design for all devices

---

## 2. Design & UI Guidelines

### 2.1 Layout Structure

#### **Public Pages**
- **Home Page:** Featured products, categories, search bar
- **Product Listing:** Grid/list view with filters
- **Product Detail:** Images carousel, description, add to cart
- **Login/Register:** Forms with validation
- **About/Contact:** Static content pages

#### **Customer Dashboard**
- **My Orders:** Order history with status
- **Profile:** View/edit account information
- **Order Details:** Detailed view of specific order

#### **Admin Dashboard**
- **Products Management:** CRUD operations
- **Categories Management:** CRUD operations
- **Orders Overview:** All orders with filters
- **Customers List:** View all customers

### 2.2 Color Palette (Recommended)

```css
/* Primary Colors */
--primary-color: #3B82F6;        /* Blue - Buttons, Links */
--primary-hover: #2563EB;        /* Darker Blue - Hover states */
--primary-light: #DBEAFE;        /* Light Blue - Backgrounds */

/* Secondary Colors */
--secondary-color: #10B981;      /* Green - Success states */
--secondary-hover: #059669;      /* Darker Green */

/* Neutral Colors */
--text-primary: #1F2937;         /* Dark Gray - Main text */
--text-secondary: #6B7280;       /* Medium Gray - Secondary text */
--border-color: #E5E7EB;         /* Light Gray - Borders */
--background: #F9FAFB;           /* Very Light Gray - Background */
--white: #FFFFFF;

/* Status Colors */
--success: #10B981;              /* Green */
--warning: #F59E0B;              /* Orange */
--error: #EF4444;                /* Red */
--info: #3B82F6;                 /* Blue */
```

### 2.3 Typography

```css
/* Font Family */
font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 2.4 Responsive Breakpoints

```css
/* Mobile First Approach */
--mobile: 0px;           /* Default */
--tablet: 768px;         /* md */
--desktop: 1024px;       /* lg */
--wide: 1280px;          /* xl */
--ultra-wide: 1536px;    /* 2xl */
```

### 2.5 Component Behavior

#### **Buttons**
- Primary: Filled background, white text
- Secondary: Outlined, transparent background
- Disabled: Reduced opacity, no hover effect
- Loading state: Show spinner, disable interaction

#### **Forms**
- Clear labels above inputs
- Validation messages below fields
- Required fields marked with asterisk (*)
- Submit button disabled until valid

#### **Cards**
- Subtle shadow: `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- Hover effect: Slight elevation increase
- Rounded corners: `border-radius: 0.5rem`

#### **Modals**
- Overlay with semi-transparent background
- Centered content
- Close button (X) in top-right
- Close on overlay click or ESC key

#### **Loading States**
- Skeleton screens for initial loads
- Spinner for actions
- Progress bars for multi-step processes

---

## 3. Recommended Tech Stack

### 3.1 Core Framework
**React 18+ with TypeScript**
- Component-based architecture
- Type safety
- Large ecosystem and community

**Alternative:** Vue.js 3 or Angular 15+

### 3.2 UI Library
**Recommended: Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
```

**Alternatives:**
- Material-UI (MUI)
- Ant Design
- Chakra UI

### 3.3 State Management
**Zustand (Recommended for simplicity)**
```bash
npm install zustand
```

**Alternative:** Redux Toolkit, Recoil, or Context API

### 3.4 HTTP Client
**Axios**
```bash
npm install axios
```

### 3.5 Routing
**React Router v6**
```bash
npm install react-router-dom
```

### 3.6 Form Management
**React Hook Form**
```bash
npm install react-hook-form
```

**Validation:** Zod or Yup
```bash
npm install zod
npm install @hookform/resolvers
```

### 3.7 Date Handling
```bash
npm install date-fns
```

### 3.8 Additional Libraries

```bash
# Notifications/Toasts
npm install react-hot-toast

# Icons
npm install lucide-react

# Image carousel
npm install swiper

# Loading states
npm install react-loading-skeleton
```

### 3.9 Development Tools

```bash
# ESLint & Prettier
npm install -D eslint prettier eslint-config-prettier

# TypeScript
npm install -D typescript @types/react @types/react-dom

# Vite (Build Tool)
npm create vite@latest my-online-store -- --template react-ts
```

---

## 4. File & Folder Structure

```
online-store-frontend/
??? public/
?   ??? favicon.ico
?   ??? images/
?       ??? placeholder.png
??? src/
?   ??? api/                      # API client and endpoints
?   ?   ??? client.ts             # Axios instance with interceptors
?   ?   ??? auth.api.ts           # Authentication endpoints
?   ?   ??? products.api.ts       # Products endpoints
?   ?   ??? categories.api.ts     # Categories endpoints
?   ?   ??? orders.api.ts         # Orders endpoints
?   ?   ??? customers.api.ts      # Customers endpoints
?   ?
?   ??? assets/                   # Static assets
?   ?   ??? images/
?   ?   ??? icons/
?   ?   ??? styles/
?   ?       ??? globals.css
?   ?
?   ??? components/               # Reusable components
?   ?   ??? common/
?   ?   ?   ??? Button.tsx
?   ?   ?   ??? Input.tsx
?   ?   ?   ??? Card.tsx
?   ?   ?   ??? Modal.tsx
?   ?   ?   ??? Loading.tsx
?   ?   ?   ??? ErrorMessage.tsx
?   ?   ?
?   ?   ??? layout/
?   ?   ?   ??? Header.tsx
?   ?   ?   ??? Footer.tsx
?   ?   ?   ??? Navbar.tsx
?   ?   ?   ??? Sidebar.tsx
?   ?   ?
?   ?   ??? products/
?   ?   ?   ??? ProductCard.tsx
?   ?   ?   ??? ProductGrid.tsx
?   ?   ?   ??? ProductDetail.tsx
?   ?   ?   ??? ProductFilters.tsx
?   ?   ?
?   ?   ??? cart/
?   ?   ?   ??? CartItem.tsx
?   ?   ?   ??? CartSummary.tsx
?   ?   ?   ??? CartDrawer.tsx
?   ?   ?
?   ?   ??? orders/
?   ?       ??? OrderCard.tsx
?   ?       ??? OrderStatusBadge.tsx
?   ?       ??? OrderTimeline.tsx
?   ?
?   ??? pages/                    # Page components
?   ?   ??? Home.tsx
?   ?   ??? ProductList.tsx
?   ?   ??? ProductDetails.tsx
?   ?   ??? Cart.tsx
?   ?   ??? Checkout.tsx
?   ?   ??? Login.tsx
?   ?   ??? Register.tsx
?   ?   ??? MyOrders.tsx
?   ?   ??? OrderDetails.tsx
?   ?   ??? Profile.tsx
?   ?   ??? admin/
?   ?       ??? Dashboard.tsx
?   ?       ??? ProductsManagement.tsx
?   ?       ??? CategoriesManagement.tsx
?   ?       ??? OrdersManagement.tsx
?   ?
?   ??? hooks/                    # Custom React hooks
?   ?   ??? useAuth.ts
?   ?   ??? useCart.ts
?   ?   ??? useProducts.ts
?   ?   ??? useOrders.ts
?   ?   ??? useDebounce.ts
?   ?
?   ??? store/                    # State management
?   ?   ??? authStore.ts
?   ?   ??? cartStore.ts
?   ?   ??? productsStore.ts
?   ?   ??? ordersStore.ts
?   ?
?   ??? types/                    # TypeScript type definitions
?   ?   ??? auth.types.ts
?   ?   ??? product.types.ts
?   ?   ??? order.types.ts
?   ?   ??? customer.types.ts
?   ?   ??? api.types.ts
?   ?
?   ??? utils/                    # Utility functions
?   ?   ??? formatters.ts         # Date, currency formatting
?   ?   ??? validators.ts         # Form validation helpers
?   ?   ??? storage.ts            # LocalStorage helpers
?   ?   ??? constants.ts          # App constants
?   ?
?   ??? routes/                   # Route configuration
?   ?   ??? AppRoutes.tsx
?   ?   ??? PrivateRoute.tsx
?   ?   ??? AdminRoute.tsx
?   ?
?   ??? App.tsx                   # Root component
?   ??? main.tsx                  # Entry point
?   ??? vite-env.d.ts            # Vite type definitions
?
??? .env.example                  # Environment variables template
??? .eslintrc.json               # ESLint configuration
??? .prettierrc                  # Prettier configuration
??? tsconfig.json                # TypeScript configuration
??? vite.config.ts               # Vite configuration
??? package.json
??? README.md
```

---

## 5. API Documentation

### 5.1 Base Configuration

**Base URL:** `https://localhost:7XXX/api`  
**Content-Type:** `application/json`  
**Authentication:** JWT Bearer Token

### 5.2 Authentication Endpoints

#### **POST /api/auth/login**
Authenticate user and receive JWT token.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "customer": {
    "customerID": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "username": "johndoe",
    "password": null,
    "role": "Customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing username or password
- `401 Unauthorized`: Invalid credentials

---

#### **POST /api/auth/register**
Register a new customer account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "username": "johndoe",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "customer": {
    "customerID": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "username": "johndoe",
    "password": null,
    "role": "Customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- Password must be at least 6 characters
- All fields except phone and address are required
- Username must be unique

**Error Responses:**
- `400 Bad Request`: Validation errors or username exists

---

#### **GET /api/auth/me** ??
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "customerID": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "username": "johndoe",
  "password": null,
  "role": "Customer"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Customer not found

---

### 5.3 Products Endpoints

#### **GET /api/products**
Get all products with category information and images.

**Response (200 OK):**
```json
[
  {
    "productID": 1,
    "productName": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with 2.4GHz connectivity",
    "price": 29.99,
    "quantityInStock": 150,
    "categoryID": 1,
    "category": {
      "categoryID": 1,
      "categoryName": "Electronics"
    },
    "images": [
      {
        "imageID": 1,
        "imageURL": "https://example.com/mouse1.jpg",
        "productID": 1,
        "imageOrder": 1
      }
    ]
  }
]
```

---

#### **GET /api/products/{id}**
Get a single product by ID with details.

**Response (200 OK):**
```json
{
  "productID": 1,
  "productName": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with 2.4GHz connectivity",
  "price": 29.99,
  "quantityInStock": 150,
  "categoryID": 1,
  "category": {
    "categoryID": 1,
    "categoryName": "Electronics"
  },
  "images": [
    {
      "imageID": 1,
      "imageURL": "https://example.com/mouse1.jpg",
      "productID": 1,
      "imageOrder": 1
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Product not found

---

#### **GET /api/products/category/{categoryId}**
Get products by category.

**Response (200 OK):** Array of products (same structure as GET /api/products)

---

#### **GET /api/products/search?q={query}**
Search products by name or description.

**Query Parameters:**
- `q`: Search query string

**Response (200 OK):** Array of products (same structure as GET /api/products)

---

### 5.4 Categories Endpoints

#### **GET /api/categories**
Get all product categories.

**Response (200 OK):**
```json
[
  {
    "categoryID": 1,
    "categoryName": "Electronics"
  },
  {
    "categoryID": 2,
    "categoryName": "Clothing"
  }
]
```

---

#### **GET /api/categories/{id}**
Get a single category by ID.

**Response (200 OK):**
```json
{
  "categoryID": 1,
  "categoryName": "Electronics"
}
```

---

### 5.5 Orders Endpoints

#### **GET /api/Orders/customer/{customerId}** ??
Get all orders for a specific customer.

**Authorization:**
- Customers can only access their own orders
- Admins can access any customer's orders

**Response (200 OK):**
```json
[
  {
    "orderID": 1,
    "customerID": 1,
    "orderDate": "2024-01-15T10:30:00Z",
    "totalAmount": 159.97,
    "status": 3,
    "statusText": "Shipped",
    "orderStatusEnum": "Shipped"
  }
]
```

**Order Status Values:**
- `1`: Pending
- `2`: Processing
- `3`: Shipped
- `4`: Delivered
- `5`: Cancelled
- `6`: Completed

---

#### **GET /api/Orders/{id}** ??
Get a single order by ID.

**Authorization:**
- Customers can only view their own orders
- Admins can view any order

**Response (200 OK):**
```json
{
  "orderID": 1,
  "customerID": 1,
  "orderDate": "2024-01-15T10:30:00Z",
  "totalAmount": 159.97,
  "status": 3
}
```

---

#### **POST /api/Orders/complete** ??
Create a complete order with items, payment, and shipping in a single transaction.

**Request:**
```json
{
  "customerID": 1,
  "items": [
    {
      "productID": 1,
      "quantity": 2
    },
    {
      "productID": 3,
      "quantity": 1
    }
  ],
  "paymentMethod": "Credit Card",
  "shippingAddress": "123 Main St, City, State, ZIP",
  "carrierName": "FedEx",
  "estimatedDeliveryDate": "2024-01-22T00:00:00Z",
  "orderStatus": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully with 2 item(s)",
  "order": {
    "orderID": 1,
    "customerID": 1,
    "orderDate": "2024-01-15T10:30:00Z",
    "totalAmount": 159.97,
    "status": 1
  },
  "orderItems": [
    {
      "orderID": 1,
      "productID": 1,
      "quantity": 2,
      "price": 29.99,
      "totalPrice": 59.98
    },
    {
      "orderID": 1,
      "productID": 3,
      "quantity": 1,
      "price": 99.99,
      "totalPrice": 99.99
    }
  ],
  "payment": {
    "paymentID": 1,
    "orderID": 1,
    "amount": 159.97,
    "paymentMethod": "Credit Card",
    "transactionDate": "2024-01-15T10:30:00Z"
  },
  "shipping": {
    "shippingID": 1,
    "orderID": 1,
    "carrierName": "FedEx",
    "trackingNumber": "TRACK-20240115-123456",
    "shippingStatus": 1,
    "estimatedDeliveryDate": "2024-01-22T00:00:00Z",
    "actualDeliveryDate": null
  }
}
```

**Validation:**
- Customer must exist
- All products must exist and have sufficient stock
- Quantities must be positive
- Payment method, shipping address, and carrier name are required

**Error Responses:**
- `400 Bad Request`: Validation errors
- `403 Forbidden`: Not authorized
- `500 Internal Server Error`: Transaction failed (with automatic rollback)

---

#### **GET /api/Orders/All** ?? (Admin Only)
Get all orders in the system.

**Response (200 OK):** Array of orders

---

### 5.6 Customers Endpoints (Admin Only)

#### **GET /api/Customers/All** ??
Get all customers.

**Response (200 OK):**
```json
[
  {
    "customerID": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "username": "johndoe",
    "password": "hashed_password",
    "role": "Customer"
  }
]
```

---

### 5.7 Payments Endpoints

#### **GET /api/Payments/All**
Get all payments.

**Response (200 OK):**
```json
[
  {
    "paymentID": 1,
    "orderID": 1,
    "amount": 159.97,
    "paymentMethod": "Credit Card",
    "transactionDate": "2024-01-15T10:30:00Z"
  }
]
```

---

### 5.8 Shipping Endpoints

#### **GET /api/Shippings/All**
Get all shipping records.

**Response (200 OK):**
```json
[
  {
    "shippingID": 1,
    "orderID": 1,
    "carrierName": "FedEx",
    "trackingNumber": "TRACK-20240115-123456",
    "shippingStatus": 1,
    "estimatedDeliveryDate": "2024-01-22T00:00:00Z",
    "actualDeliveryDate": null
  }
]
```

**Shipping Status Values:**
- `1`: Pending
- `2`: In Transit
- `3`: Out for Delivery
- `4`: Delivered
- `5`: Failed Delivery
- `6`: Returned

---

## 6. Data Models & Types

### 6.1 TypeScript Type Definitions

Create the following type definitions in your `types/` folder:

#### **types/auth.types.ts**
```typescript
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  username: string;
  password: string;
}

export interface Customer {
  customerID: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string | null;
  role: 'Customer' | 'Admin';
}

export interface AuthResponse {
  customer: Customer;
  token: string;
}
```

#### **types/product.types.ts**
```typescript
export interface Product {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantityInStock: number;
  categoryID: number;
  category: Category | null;
  images: ProductImage[];
}

export interface ProductImage {
  imageID: number;
  imageURL: string;
  productID: number;
  imageOrder: number;
}

export interface Category {
  categoryID: number;
  categoryName: string;
}
```

#### **types/order.types.ts**
```typescript
export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Completed = 6,
}

export interface Order {
  orderID: number | null;
  customerID: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  statusText?: string;
}

export interface OrderItem {
  orderID: number;
  productID: number;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Payment {
  paymentID: number | null;
  orderID: number;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
}

export interface Shipping {
  shippingID: number | null;
  orderID: number;
  carrierName: string;
  trackingNumber: string;
  shippingStatus: number;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string | null;
}

export interface CreateCompleteOrderRequest {
  customerID: number;
  items: {
    productID: number;
    quantity: number;
  }[];
  paymentMethod: string;
  shippingAddress: string;
  carrierName: string;
  estimatedDeliveryDate?: string;
  orderStatus?: number;
}

export interface CompleteOrderResponse {
  success: boolean;
  message: string;
  order: Order;
  orderItems: OrderItem[];
  payment: Payment;
  shipping: Shipping;
}
```

#### **types/cart.types.ts**
```typescript
import { Product } from './product.types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}
```

---

## 7. Authentication & Authorization

### 7.1 JWT Token Structure

The API returns a JWT token on successful login/registration. The token contains:

```json
{
  "sub": "1",                  // Customer ID
  "unique_name": "johndoe",    // Username
  "role": "Customer",          // User role (Customer/Admin)
  "nbf": 1642234567,
  "exp": 1642238167,           // Expiration (1 hour from issue)
  "iat": 1642234567,
  "iss": "OnlineStoreAPI",
  "aud": "OnlineStoreClient"
}
```

### 7.2 Token Storage

**Recommended:** Store token in `localStorage` or `sessionStorage`

```typescript
// utils/storage.ts
export const storage = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  removeToken: () => {
    localStorage.removeItem('auth_token');
  },
  
  setUser: (user: Customer) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: (): Customer | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('user');
  },
  
  clear: () => {
    localStorage.clear();
  }
};
```

### 7.3 Axios Interceptor Setup

```typescript
// api/client.ts
import axios from 'axios';
import { storage } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      storage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 7.4 Protected Routes

```typescript
// routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

```typescript
// routes/AdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
```

---

## 8. State Management Strategy

### 8.1 Using Zustand

#### **store/authStore.ts**
```typescript
import { create } from 'zustand';
import { Customer } from '../types/auth.types';
import { storage } from '../utils/storage';

interface AuthState {
  user: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: Customer, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
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
}));
```

#### **store/cartStore.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product.types';
import { CartItem } from '../types/cart.types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
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
            item.product.productID === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

---

## 9. Routing & Navigation

### 9.1 Route Configuration

```typescript
// routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';

// Pages
import Home from '../pages/Home';
import ProductList from '../pages/ProductList';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyOrders from '../pages/MyOrders';
import OrderDetails from '../pages/OrderDetails';
import Profile from '../pages/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ProductsManagement from '../pages/admin/ProductsManagement';
import CategoriesManagement from '../pages/admin/CategoriesManagement';
import OrdersManagement from '../pages/admin/OrdersManagement';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />
        <Route path="/checkout" element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        } />
        <Route path="/orders" element={
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        } />
        <Route path="/orders/:id" element={
          <PrivateRoute>
            <OrderDetails />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute>
            <ProductsManagement />
          </AdminRoute>
        } />
        <Route path="/admin/categories" element={
          <AdminRoute>
            <CategoriesManagement />
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <OrdersManagement />
          </AdminRoute>
        } />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
```

### 9.2 Navigation Links

```typescript
// Navigation structure
const customerNav = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/orders', label: 'My Orders' },
  { path: '/profile', label: 'Profile' },
];

const adminNav = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/products', label: 'Products' },
  { path: '/admin/categories', label: 'Categories' },
  { path: '/admin/orders', label: 'Orders' },
];
```

---

## 10. Setup & Installation

### 10.1 Prerequisites

- Node.js 18+ and npm/yarn
- Git
- Code editor (VS Code recommended)

### 10.2 Initial Setup

```bash
# Create new React + TypeScript project with Vite
npm create vite@latest online-store-frontend -- --template react-ts

# Navigate to project
cd online-store-frontend

# Install dependencies
npm install

# Install additional packages
npm install axios zustand react-router-dom react-hook-form zod @hookform/resolvers
npm install date-fns react-hot-toast lucide-react

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node

# Initialize Tailwind CSS
npx tailwindcss init -p
```

### 10.3 Environment Variables

Create `.env` file in root:

```env
VITE_API_BASE_URL=https://localhost:7000/api
VITE_APP_NAME=Online Store
```

Create `.env.example` for reference:

```env
VITE_API_BASE_URL=your_api_url_here
VITE_APP_NAME=Online Store
```

### 10.4 Tailwind Configuration

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#DBEAFE',
        },
        secondary: {
          DEFAULT: '#10B981',
          hover: '#059669',
        },
      },
    },
  },
  plugins: [],
}
```

### 10.5 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

### 10.6 Deployment

#### **Build Production Bundle**
```bash
npm run build
```

This creates optimized files in `dist/` folder.

#### **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

#### **Deploy to Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### **Environment Variables for Production**
Set `VITE_API_BASE_URL` to your production API URL.

---

## 11. Best Practices & Coding Standards

### 11.1 Naming Conventions

**Files:**
- Components: PascalCase (`ProductCard.tsx`)
- Utilities: camelCase (`formatters.ts`)
- Types: camelCase with `.types.ts` suffix (`auth.types.ts`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)

**Variables:**
- camelCase for variables and functions
- PascalCase for components and types
- UPPER_SNAKE_CASE for constants

**Example:**
```typescript
// Constants
export const API_BASE_URL = 'https://api.example.com';
export const MAX_CART_ITEMS = 100;

// Functions
const calculateTotal = (items: CartItem[]): number => { ... };

// Components
const ProductCard: React.FC<ProductCardProps> = ({ product }) => { ... };
```

### 11.2 Component Structure

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product.types';
import { Button } from './common/Button';

// 2. Type definitions
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number) => void;
}

// 3. Component
export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // 3a. Hooks
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // 3b. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3c. Handlers
  const handleAddToCart = () => {
    onAddToCart(product.productID, quantity);
  };
  
  // 3d. Render helpers
  const renderPrice = () => {
    return `$${product.price.toFixed(2)}`;
  };
  
  // 3e. JSX
  return (
    <div className="product-card">
      {/* ... */}
    </div>
  );
};
```

### 11.3 Code Formatting

Use Prettier configuration (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 11.4 TypeScript Best Practices

```typescript
// ? DO: Use explicit types for function parameters
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

// ? DO: Use interfaces for object shapes
interface User {
  id: number;
  name: string;
  email: string;
}

// ? DO: Use type guards
function isAdmin(user: Customer): boolean {
  return user.role === 'Admin';
}

// ? DON'T: Use 'any' type
// const data: any = fetchData(); // Bad

// ? DO: Use proper types or 'unknown'
const data: Product[] = await fetchProducts();
```

### 11.5 Performance Optimization

```typescript
// 1. Memoize expensive computations
const totalAmount = useMemo(() => {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}, [cartItems]);

// 2. Memoize components
const ProductCard = React.memo(({ product }) => {
  return <div>{product.name}</div>;
});

// 3. Use lazy loading for routes
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

// 4. Debounce search inputs
const debouncedSearch = useDebounce(searchQuery, 500);
```

### 11.6 Accessibility (A11Y)

```jsx
// Always include alt text for images
<img src={product.imageURL} alt={product.productName} />

// Use semantic HTML
<button type="button" onClick={handleClick}>
  Add to Cart
</button>

// Add ARIA labels when needed
<button aria-label="Close modal" onClick={handleClose}>
  <X />
</button>

// Ensure keyboard navigation
<div 
  role="button" 
  tabIndex={0} 
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

### 11.7 Error Boundaries

```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

---

## 12. Error Handling

### 12.1 API Error Handling

```typescript
// api/auth.api.ts
import { apiClient } from './client';
import { LoginRequest, AuthResponse } from '../types/auth.types';
import toast from 'react-hot-toast';

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    }
  },
};
```

### 12.2 Form Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authAPI.login(data);
      navigate('/');
    } catch (error) {
      // Error is handled in API layer
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### 12.3 Toast Notifications

```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Product added to cart!');

// Error
toast.error('Failed to add product to cart');

// Loading
const toastId = toast.loading('Processing order...');
// Later...
toast.success('Order placed successfully!', { id: toastId });

// Custom
toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}>
    Custom notification
  </div>
));
```

---

## 13. Testing Requirements

### 13.1 Unit Testing Setup

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom
```

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

### 13.2 Test Examples

```typescript
// ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    productID: 1,
    productName: 'Test Product',
    price: 29.99,
    quantityInStock: 10,
  };

  it('renders product information', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', () => {
    const handleAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);
    
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);
    
    expect(handleAddToCart).toHaveBeenCalledWith(1, 1);
  });
});
```

### 13.3 E2E Testing (Optional)

```bash
# Install Playwright
npm install -D @playwright/test
```

---

## Additional Resources

### API Testing with Swagger
- Access Swagger UI at: `https://localhost:7XXX/swagger`
- Test endpoints directly in browser
- View complete request/response schemas

### CORS Configuration
The API is configured with CORS to allow all origins during development. Ensure your production API URL is whitelisted in production.

### Security Considerations
1. **Never store sensitive data in localStorage** (consider httpOnly cookies for tokens in production)
2. **Validate all user inputs** on both client and server
3. **Implement HTTPS** in production
4. **Use environment variables** for API URLs and keys
5. **Implement rate limiting** for API calls

### Performance Tips
1. Use lazy loading for routes
2. Implement infinite scroll or pagination for product lists
3. Optimize images (use WebP format, lazy loading)
4. Implement caching strategies
5. Use React Query or SWR for data fetching and caching

---

## Conclusion

This documentation provides everything needed to build a production-ready frontend for the Online Store API. Follow the guidelines, use the provided code examples, and maintain consistency throughout the application.

For questions or clarifications, refer to:
- API Swagger documentation
- React documentation: https://react.dev
- TypeScript documentation: https://www.typescriptlang.org/docs
- Tailwind CSS documentation: https://tailwindcss.com/docs

**Happy coding! ??**
