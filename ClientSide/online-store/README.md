# 🛒 Online Store - Full Stack Platform

A complete full-stack online store platform featuring a modern React frontend with TypeScript and a robust ASP.NET Core 9 backend API, with JWT authentication, role-based authorization, and comprehensive order management.

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=flat&logo=dotnet)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-13.0-239120?style=flat&logo=c-sharp)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-CC2927?style=flat&logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Frontend Application](#-frontend-application)
- [Backend API](#-backend-api)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Order Management](#-order-management)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎨 **Modern Frontend Application**
- **React 19** with **TypeScript** for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS 4** with custom animations for beautiful UI
- **shadcn/ui** components for consistent design
- **React Router** for seamless navigation
- **Framer Motion** for smooth animations
- **Axios** for API integration
- **React Hook Form** with Zod validation
- **Context API** for state management (Auth & Cart)
- Fully responsive design for all devices
- Dark mode support with next-themes
- Real-time cart management
- Interactive product catalog with search and filters
- Comprehensive admin dashboard

### 🔐 **Authentication & Security**
- JWT Bearer token authentication
- BCrypt password hashing
- Role-based authorization (Customer/Admin)
- Secure user registration and login
- Protected routes and admin-only pages
- Persistent authentication state
- Automatic token refresh

### 🛍️ **Online Store Core**
- Product catalog with categories
- Product images support
- Advanced product search and filtering
- Shopping cart management
- Complete order processing
- Payment tracking
- Shipping management
- Product reviews and ratings

### 📦 **Order Management**
- Single-transaction order creation
- Automatic stock management
- Order status tracking (6 states)
- Shipping status tracking (6 states)
- Order history
- Automatic rollback on failures

### 👥 **User Management**
- Customer profiles
- Order history per customer
- Admin dashboard capabilities
- Customer reviews
- Customer management (Admin)

### 🎨 **API Features**
- RESTful API design
- Swagger/OpenAPI documentation
- Comprehensive error handling
- CORS support
- Response caching
- Input validation

---

## 🏗️ Architecture

The project follows a **full-stack architecture** with clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React Components (Pages, Layouts, UI)             │   │
│  │  - Public Pages (Home, Products, About)            │   │
│  │  - Protected Pages (Cart, Checkout, Orders)        │   │
│  │  - Admin Pages (Dashboard, Management)             │   │
│  └───────────────────┬─────────────────────────────────┘   │
│  ┌───────────────────▼─────────────────────────────────┐   │
│  │  Context Providers (Auth, Cart)                     │   │
│  └───────────────────┬─────────────────────────────────┘   │
│  ┌───────────────────▼─────────────────────────────────┐   │
│  │  Services Layer (API Integration)                   │   │
│  │  - Axios Client with Interceptors                   │   │
│  │  - Auth, Product, Order Services                    │   │
│  └───────────────────┬─────────────────────────────────┘   │
└────────────────────┬─┴──────────────────────────────────────┘
                     │
                     │ HTTPS/REST API
                     │ JWT Authentication
                     │
┌────────────────────▼───────────────────────────────────────┐
│              BACKEND (ASP.NET Core 9 API)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Layer (Controllers, DTOs, Middleware)          │   │
│  └───────────────────┬─────────────────────────────────┘   │
│  ┌───────────────────▼─────────────────────────────────┐   │
│  │  Business Logic Layer (BLL)                         │   │
│  │  Business Rules, Validation                         │   │
│  └───────────────────┬─────────────────────────────────┘   │
│  ┌───────────────────▼─────────────────────────────────┐   │
│  │  Data Access Layer (DAL)                            │   │
│  │  Database Operations, Stored Procedures            │   │
│  └───────────────────┬─────────────────────────────────┘   │
└────────────────────┬─┴──────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│              SQL Server Database                           │
└────────────────────────────────────────────────────────────┘
```

### **Design Patterns Used**
- **Frontend:**
  - Component-based architecture
  - Context API for state management
  - Custom hooks for reusable logic
  - Service layer for API calls
  - Protected routes pattern
  - Container/Presentational pattern

- **Backend:**
  - Repository Pattern
  - DTO (Data Transfer Object) Pattern
  - Dependency Injection
  - Service Layer Pattern
  - Factory Pattern

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19.1
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 6.3
- **Styling:** 
  - Tailwind CSS 4.1
  - Radix UI (shadcn/ui components)
  - Framer Motion for animations
- **Routing:** React Router DOM 7.6
- **HTTP Client:** Axios 1.12
- **Form Management:** React Hook Form 7.56
- **Validation:** Zod 3.24
- **Charts:** Recharts 2.15
- **Icons:** Lucide React
- **State Management:** React Context API
- **Notifications:** Sonner (Toast notifications)
- **Package Manager:** pnpm 10.4

### **Backend**
- **Framework:** ASP.NET Core 9.0
- **Language:** C# 13.0
- **Database:** SQL Server 2019+
- **ORM:** ADO.NET (Direct SQL + Stored Procedures)

### **Security**
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** BCrypt.Net
- **Authorization:** Role-based (Claims)

### **API Documentation**
- Swagger/OpenAPI
- Custom API documentation (Markdown)

### **Additional Libraries**
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `Microsoft.IdentityModel.Tokens`
- `BCrypt.Net-Next`
- `System.Data.SqlClient`

---

## 🚀 Getting Started

### **Prerequisites**

- [Node.js 18+](https://nodejs.org/) (for frontend)
- [pnpm](https://pnpm.io/) (recommended) or npm
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) (for backend)
- [SQL Server 2019+](https://www.microsoft.com/sql-server/sql-server-downloads) or SQL Server Express
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

---

### **Frontend Setup**

1. **Clone the repository**
```bash
git clone https://github.com/YazenJO/Online-Store.git
cd Online-Store/ClientSide/online-store
```

2. **Install dependencies**
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `ClientSide/online-store` directory:
```env
VITE_API_BASE_URL=https://localhost:7248/api
```

4. **Start the development server**
```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

5. **Access the application**
- Frontend: `http://localhost:5173`
- The app will automatically connect to the backend API

6. **Build for production**
```bash
# Using pnpm
pnpm build

# Or using npm
npm run build
```

---

### **Backend Setup**

1. **Navigate to backend directory**
```bash
cd Online-Store/ServerSide
```

2. **Set up the database**
```sql
-- Create the database
CREATE DATABASE OnlineStoreDB;
GO

-- Run the database setup script
-- Execute: ServerSide/My Online Store/Docs/Database_StoredProcedures.sql
```

3. **Configure connection string**

Edit `appsettings.json` in the `My Online Store` project:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=OnlineStoreDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!!!",
    "Issuer": "OnlineStoreAPI",
    "Audience": "OnlineStoreClient"
  }
}
```

4. **Restore NuGet packages**
```bash
dotnet restore
```

5. **Build the solution**
```bash
dotnet build
```

6. **Run the application**
```bash
cd "My Online Store"
dotnet run
```

7. **Access the API**
- API Base URL: `https://localhost:7248/api`
- Swagger UI: `https://localhost:7248/swagger`

---

## 🎨 Frontend Application

### **Key Features**

#### **Public Pages**
- **Home Page**: Featured products, hero section, categories showcase
- **Products Page**: Browse all products with search and category filters
- **Product Details**: Detailed product view with images, reviews, and add to cart
- **About Page**: Company information
- **Contact Page**: Contact form and information
- **FAQ Page**: Frequently asked questions
- **Shipping Page**: Shipping policies and information

#### **Customer Pages** (Authentication Required)
- **Cart Page**: View and manage cart items
- **Checkout Page**: Complete order with payment and shipping details
- **Orders Page**: View order history
- **Order Details**: Track specific order status

#### **Admin Pages** (Admin Role Required)
- **Admin Dashboard**: Overview with statistics and charts
- **Products Management**: Add, edit, delete products
- **Orders Management**: View and manage all orders
- **Customers Management**: View and manage customers
- **Order Details**: Detailed order view with status updates

### **Component Structure**

```
src/
├── components/
│   ├── cart/              # Cart-related components
│   ├── checkout/          # Checkout flow components
│   ├── common/            # Reusable components (CountUp, etc.)
│   ├── layout/            # Header, Footer
│   ├── order/             # Order-related components
│   ├── product/           # Product card and related components
│   ├── routes/            # Route guards (Protected, Admin)
│   └── ui/                # shadcn/ui components (40+ components)
│
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── CartContext.tsx    # Shopping cart state
│
├── pages/                 # Page components
│   ├── admin/             # Admin-only pages
│   └── *.tsx              # Public and protected pages
│
├── services/              # API integration
│   ├── api.ts             # Axios configuration
│   ├── authService.ts     # Authentication API calls
│   ├── productService.ts  # Product API calls
│   ├── orderService.ts    # Order API calls
│   └── adminService.ts    # Admin API calls
│
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared types and interfaces
│
└── utils/                 # Utility functions
    └── animations.ts      # Animation configurations
```

### **State Management**

#### **AuthContext**
- User authentication state
- Login/Logout functionality
- JWT token management
- User role and permissions

#### **CartContext**
- Shopping cart items
- Add/Remove/Update cart items
- Cart total calculation
- Persistent cart (localStorage)

### **Routing**

The application uses **React Router v7** with protected routes:

- **Public Routes**: Accessible to everyone
- **Protected Routes**: Require authentication
- **Admin Routes**: Require admin role

Example route protection:
```tsx
<Route
  path="/admin/products"
  element={
    <AdminRoute>
      <AdminProductsManagement />
    </AdminRoute>
  }
/>
```

---

## 🔌 Backend API

---

## 📚 API Documentation

### **Quick Reference**

| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| **Authentication** | 3 | No/Yes |
| **Products** | 8 | Partial |
| **Categories** | 6 | Partial |
| **Orders** | 8 | Yes |
| **Customers** | 6 | Yes |
| **Payments** | 6 | Yes |
| **Shipping** | 6 | Yes |
| **Reviews** | 5 | Partial |
| **Product Images** | 5 | Partial |

**Total Endpoints:** 60+

### **Key Endpoints**

#### Authentication
```http
POST /api/auth/register  # Register new user
POST /api/auth/login     # Login and get JWT token
GET  /api/auth/me        # Get current user info
```

#### Products
```http
GET  /api/products                      # Get all products (with images & category)
GET  /api/products/{id}                 # Get product by ID
GET  /api/products/search?q={query}     # Search products
GET  /api/products/category/{categoryId} # Filter by category
```

#### Orders
```http
POST /api/Orders/complete               # Create complete order (recommended)
GET  /api/Orders/customer/{customerId}  # Get customer's orders
GET  /api/Orders/{id}                   # Get order by ID
```

#### Reviews
```http
GET  /api/products/{productId}/reviews  # Get product reviews
POST /api/reviews                       # Submit review
PUT  /api/reviews/{id}                  # Update review
DELETE /api/reviews/{id}                # Delete review
```

### **Detailed Documentation**
- **API Endpoints Reference:** [`Docs/API_ENDPOINTS_REFERENCE.md`](ServerSide/My%20Online%20Store/Docs/API_ENDPOINTS_REFERENCE.md)
- **Frontend Developer Guide:** [`Docs/FRONTEND_DEVELOPER_GUIDE.md`](ServerSide/My%20Online%20Store/Docs/FRONTEND_DEVELOPER_GUIDE.md)
- **Quick Reference:** [`Docs/FRONTEND_API_QUICK_REFERENCE.md`](ServerSide/My%20Online%20Store/Docs/FRONTEND_API_QUICK_REFERENCE.md)

---

---

## 📁 Project Structure

### **Full Repository Structure**

```
Online-Store/
│
├── ClientSide/                    # Frontend Application
│   └── online-store/
│       ├── public/                # Static assets
│       │   └── favicon.ico
│       │
│       ├── src/
│       │   ├── components/        # React components
│       │   │   ├── cart/          # Cart components
│       │   │   ├── checkout/      # Checkout components
│       │   │   ├── common/        # Shared components
│       │   │   ├── layout/        # Header, Footer
│       │   │   ├── order/         # Order components
│       │   │   ├── product/       # Product components
│       │   │   ├── routes/        # Route guards
│       │   │   └── ui/            # shadcn/ui components (40+)
│       │   │
│       │   ├── contexts/          # React Context
│       │   │   ├── AuthContext.tsx
│       │   │   └── CartContext.tsx
│       │   │
│       │   ├── hooks/             # Custom React hooks
│       │   │
│       │   ├── lib/               # Utilities
│       │   │   └── utils.ts
│       │   │
│       │   ├── pages/             # Page components
│       │   │   ├── admin/         # Admin pages
│       │   │   │   ├── AdminDashboard.tsx
│       │   │   │   ├── AdminProductsManagement.tsx
│       │   │   │   ├── AdminOrdersManagement.tsx
│       │   │   │   ├── AdminCustomersManagement.tsx
│       │   │   │   ├── AddProductPage.tsx
│       │   │   │   ├── EditProductPage.tsx
│       │   │   │   ├── EditCustomerPage.tsx
│       │   │   │   └── AdminOrderDetailsPage.tsx
│       │   │   │
│       │   │   ├── HomePage.tsx
│       │   │   ├── ProductsPage.tsx
│       │   │   ├── ProductDetailsPage.tsx
│       │   │   ├── CartPage.tsx
│       │   │   ├── CheckoutPage.tsx
│       │   │   ├── OrdersPage.tsx
│       │   │   ├── OrderDetailsPage.tsx
│       │   │   ├── LoginPage.tsx
│       │   │   ├── RegisterPage.tsx
│       │   │   ├── AboutPage.tsx
│       │   │   ├── ContactPage.tsx
│       │   │   ├── ShippingPage.tsx
│       │   │   └── FAQPage.tsx
│       │   │
│       │   ├── services/          # API integration
│       │   │   ├── api.ts         # Axios client
│       │   │   ├── authService.ts
│       │   │   ├── productService.ts
│       │   │   ├── orderService.ts
│       │   │   └── adminService.ts
│       │   │
│       │   ├── types/             # TypeScript types
│       │   │   └── index.ts
│       │   │
│       │   ├── utils/             # Utilities
│       │   │   └── animations.ts
│       │   │
│       │   ├── App.tsx            # Root component
│       │   ├── App.css
│       │   ├── main.tsx           # Entry point
│       │   └── index.css
│       │
│       ├── components.json        # shadcn/ui config
│       ├── package.json
│       ├── pnpm-lock.yaml
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts
│       ├── eslint.config.js
│       └── README.md              # This file
│
├── ServerSide/                    # Backend API
│   ├── My Online Store/           # API Project (Web API)
│   │   ├── Controllers/           # API Controllers
│   │   ├── DTOs/                  # Data Transfer Objects
│   │   ├── Services/              # JWT, Password Hashing
│   │   ├── Docs/                  # API Documentation
│   │   ├── Program.cs             # Application entry point
│   │   └── appsettings.json       # Configuration
│   │
│   ├── OnlineStore.BLL/           # Business Logic Layer
│   │   ├── Customer.cs
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   ├── OrderItem.cs
│   │   ├── Payment.cs
│   │   ├── Shipping.cs
│   │   ├── Category.cs
│   │   ├── Review.cs
│   │   └── Image.cs
│   │
│   ├── OnlineStore.DAL/           # Data Access Layer
│   │   ├── CustomerData.cs
│   │   ├── ProductData.cs
│   │   ├── OrderData.cs
│   │   ├── OrderItemData.cs
│   │   ├── PaymentData.cs
│   │   ├── ShippingData.cs
│   │   ├── CategoryData.cs
│   │   ├── ReviewData.cs
│   │   ├── ImageData.cs
│   │   └── OnlineStoreDALLSettings.cs
│   │
│   └── OnlineStore.Models/        # DTOs & Models
│       ├── CustomerDTO.cs
│       ├── ProductDTO.cs
│       ├── OrderDTO.cs
│       ├── OrderItemDTO.cs
│       ├── PaymentDTO.cs
│       ├── ShippingDTO.cs
│       ├── CategoryDTO.cs
│       ├── ReviewDTO.cs
│       └── ImageDTO.cs
│
└── README.md                      # Main repository README
```

---

## 🗄️ Database Schema

### **Core Tables**

```
Customers
├── CustomerID (PK)
├── Name
├── Email
├── Phone
├── Address
├── Username (Unique)
├── Password (Hashed)
└── Role (Customer/Admin)

Products
├── ProductID (PK)
├── ProductName
├── Description
├── Price
├── QuantityInStock
└── CategoryID (FK)

Categories
├── CategoryID (PK)
└── CategoryName

Orders
├── OrderID (PK)
├── CustomerID (FK)
├── OrderDate
├── TotalAmount
└── Status (1-6)

OrderItems (Composite Key)
├── OrderID (PK, FK)
├── ProductID (PK, FK)
├── Quantity
├── Price
└── TotalPrice

Payments
├── PaymentID (PK)
├── OrderID (FK)
├── Amount
├── PaymentMethod
└── TransactionDate

Shipping
├── ShippingID (PK)
├── OrderID (FK)
├── CarrierName
├── TrackingNumber
├── ShippingStatus (1-6)
├── EstimatedDeliveryDate
└── ActualDeliveryDate

Reviews
├── ReviewID (PK)
├── ProductID (FK)
├── CustomerID (FK)
├── ReviewText
├── Rating (decimal)
└── ReviewDate

ProductImages
├── ImageID (PK)
├── ProductID (FK)
├── ImageURL
└── ImageOrder
```

### **Database Scripts**
- Full schema and stored procedures: [`Docs/Database_StoredProcedures.sql`](ServerSide/My%20Online%20Store/Docs/Database_StoredProcedures.sql)

---

## 🔐 Authentication & Authorization

### **JWT Token Authentication**

1. **Register or Login** to receive a JWT token
2. **Include token** in all protected requests:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **User Roles**

| Role | Permissions |
|------|------------|
| **Customer** | View products, place orders, manage own profile, submit reviews |
| **Admin** | All customer permissions + manage products, view all orders, manage customers |

### **Password Security**
- Passwords are hashed using **BCrypt** (10 rounds)
- Passwords are **never** stored in plain text
- Passwords are **never** returned in API responses

### **Example: Frontend Authentication Flow**

```typescript
// services/authService.ts
import apiClient from './api';

export const login = async (username: string, password: string) => {
  const response = await apiClient.post('/auth/login', {
    username,
    password
  });
  return response.data; // { customer, token }
};

// Usage in LoginPage.tsx
const handleLogin = async (e: FormEvent) => {
  e.preventDefault();
  try {
    const { customer, token } = await authService.login(username, password);
    localStorage.setItem('authToken', token);
    // Update auth context
    navigate('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### **Protected Routes Example**

```typescript
// components/routes/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

---

## 📦 Order Management

### **Complete Order Flow**

The API provides a **single-transaction order creation** endpoint that handles:

1. ✅ Order validation
2. ✅ Order creation
3. ✅ Order items creation
4. ✅ Payment processing
5. ✅ Shipping setup
6. ✅ Stock updates
7. ✅ Automatic rollback on any failure

### **Create Complete Order**

```typescript
// Frontend Example (TypeScript)
import { orderService } from '@/services/orderService';

const handleCheckout = async () => {
  try {
    const orderData = {
      customerID: user.customerID,
      items: cartItems.map(item => ({
        productID: item.productID,
        quantity: item.quantity
      })),
      paymentMethod: "Credit Card",
      shippingAddress: formData.address,
      carrierName: "FedEx",
      estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const order = await orderService.createCompleteOrder(orderData);
    navigate(`/orders/${order.orderID}`);
  } catch (error) {
    console.error('Order creation failed:', error);
  }
};

// API Endpoint
POST /api/Orders/complete

// Request Body
{
  "customerID": 1,
  "items": [
    { "productID": 1, "quantity": 2 },
    { "productID": 3, "quantity": 1 }
  ],
  "paymentMethod": "Credit Card",
  "shippingAddress": "123 Main St, City, State 12345",
  "carrierName": "FedEx",
  "estimatedDeliveryDate": "2025-02-01T00:00:00Z"
}
```

### **Order Status Values**

| Status | Name | Description |
|--------|------|-------------|
| 1 | Pending | Order placed (default) |
| 2 | Processing | Being prepared |
| 3 | Shipped | Sent to customer |
| 4 | Delivered | Customer received |
| 5 | Cancelled | Order cancelled |
| 6 | Completed | Successfully done |

### **Shipping Status Values**

| Status | Name | Description |
|--------|------|-------------|
| 1 | Pending | Awaiting shipment |
| 2 | In Transit | On the way |
| 3 | Out for Delivery | Out for delivery |
| 4 | Delivered | Delivered |
| 5 | Failed Delivery | Delivery failed |
| 6 | Returned | Returned |

---

## ⚙️ Configuration

### **Frontend Configuration**

#### **.env File**
```env
# API Base URL
VITE_API_BASE_URL=https://localhost:7248/api

# Optional: Other environment variables
VITE_APP_NAME=Online Store
VITE_APP_VERSION=1.0.0
```

#### **Axios Client Configuration** (src/services/api.ts)
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7248/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### **Backend Configuration**

#### **appsettings.json**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=OnlineStoreDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!!!",
    "Issuer": "OnlineStoreAPI",
    "Audience": "OnlineStoreClient"
  }
}
```

### **Environment Variables (Production)**

```bash
# Database
ConnectionStrings__DefaultConnection="Server=...;Database=OnlineStoreDB;..."

# JWT
Jwt__Key="YourProductionSecretKey..."
Jwt__Issuer="OnlineStoreAPI"
Jwt__Audience="OnlineStoreClient"
```

---

## 🧪 Testing

### **Frontend Testing**
```bash
# Run linting
pnpm lint

# Build for production (tests build process)
pnpm build

# Preview production build
pnpm preview
```

### **Backend Testing**
```bash
# Run tests
dotnet test
```

### **Manual Testing with Swagger**
1. Run the backend application
2. Navigate to `https://localhost:7248/swagger`
3. Test endpoints interactively
4. Copy cURL commands for integration

### **Testing the Full Stack**
1. Start the backend API
2. Start the frontend development server
3. Navigate to `http://localhost:5173`
4. Test the complete user flow:
   - Register a new account
   - Browse products
   - Add items to cart
   - Complete checkout
   - View order history

---

## 🎨 UI Components

The frontend uses **shadcn/ui** - a collection of re-usable components built with Radix UI and Tailwind CSS:

### **Available Components**
- **Layout**: Card, Separator, Aspect Ratio, Scroll Area
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider
- **Feedback**: Alert, Alert Dialog, Toast (Sonner), Progress
- **Navigation**: Tabs, Accordion, Navigation Menu, Breadcrumb, Pagination
- **Overlay**: Dialog, Drawer, Popover, Tooltip, Hover Card, Context Menu
- **Data Display**: Table, Avatar, Badge, Calendar, Chart
- **Interactive**: Button, Toggle, Command, Dropdown Menu, Menubar

### **Custom Components**
- **CountUp**: Animated number counter
- **ProductCard**: Product display card
- **CartItem**: Cart item component
- **ProtectedRoute**: Route guard component
- **AdminRoute**: Admin-only route guard

---

## 🚢 Deployment

### **Frontend Deployment**

#### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### **Netlify**
```bash
# Build command
pnpm build

# Publish directory
dist
```

#### **Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Backend Deployment**

#### **Azure App Service**
1. Publish from Visual Studio
2. Configure connection strings in Azure Portal
3. Set environment variables

#### **Docker**
```bash
# Build image
docker build -t online-store-api .

# Run container
docker run -p 5000:80 online-store-api
```

---

## 💡 Development Tips

### **Frontend Best Practices**
- Use TypeScript for type safety
- Follow React hooks best practices
- Utilize Context API for global state
- Implement error boundaries
- Use React.memo for performance optimization
- Lazy load routes for better performance

### **Code Formatting**
```bash
# Format code (if using Prettier)
pnpm format

# Lint code
pnpm lint
```

### **Environment Variables**
- Never commit `.env` files
- Use `.env.example` as template
- Keep sensitive data in environment variables

---

## 📱 Screenshots

### **Customer Interface**
- 🏠 Home Page with featured products
- 🛍️ Product catalog with filters
- 🛒 Shopping cart
- 💳 Checkout process
- 📦 Order tracking

### **Admin Dashboard**
- 📊 Analytics dashboard
- 📦 Product management
- 🎯 Order management
- 👥 Customer management

---

## 🔄 API Integration Example

### **Fetch Products**
```typescript
// services/productService.ts
import apiClient from './api';
import { Product } from '@/types';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get(`/products/search?q=${query}`);
    return response.data;
  }
};

// Usage in component
import { productService } from '@/services/productService';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Render products...
};
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### **Coding Standards**
- Follow C# coding conventions
- Use meaningful variable and method names
- Add XML comments to public APIs
- Write unit tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Yazen Al-Obeidat**

- GitHub: [@YazenJO](https://github.com/YazenJO)
- Repository: [Online-Store](https://github.com/YazenJO/Online-Store)

---

## 🙏 Acknowledgments

- Built with [ASP.NET Core 9](https://dotnet.microsoft.com/)
- Authentication powered by [JWT](https://jwt.io/)
- Password hashing using [BCrypt.Net](https://github.com/BcryptNet/bcrypt.net)
- Inspired by modern Online Store platforms

---

## 📊 Project Status

✅ **Completed Features:**

**Frontend:**
- ✅ Complete React + TypeScript application
- ✅ Modern UI with Tailwind CSS and shadcn/ui
- ✅ User authentication and authorization
- ✅ Shopping cart functionality
- ✅ Product catalog with search and filters
- ✅ Checkout and order management
- ✅ Admin dashboard with full CRUD operations
- ✅ Responsive design for all devices
- ✅ Protected and admin routes
- ✅ Context-based state management

**Backend:**
- ✅ Complete REST API implementation
- ✅ JWT authentication & authorization
- ✅ Password hashing with BCrypt
- ✅ Complete order management system
- ✅ Product catalog with images
- ✅ Review system
- ✅ Comprehensive documentation

🚧 **Planned Features:**
- Unit tests (Frontend & Backend)
- Integration tests
- E2E testing with Playwright
- Docker compose for easy deployment
- CI/CD pipeline
- Email notifications
- Payment gateway integration (Stripe/PayPal)
- Product image upload functionality
- Real-time order tracking
- Customer wishlist
- Advanced product filters
- Product comparison feature

---

## 🎯 Key Technologies Highlights

### **Frontend Technologies**
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 19.1 |
| TypeScript | Type Safety | 5.9 |
| Vite | Build Tool | 6.3 |
| Tailwind CSS | Styling | 4.1 |
| React Router | Navigation | 7.6 |
| Axios | HTTP Client | 1.12 |
| Framer Motion | Animations | 12.15 |
| shadcn/ui | UI Components | Latest |
| Zod | Schema Validation | 3.24 |
| Recharts | Data Visualization | 2.15 |

### **Backend Technologies**
| Technology | Purpose | Version |
|------------|---------|---------|
| ASP.NET Core | Web Framework | 9.0 |
| C# | Language | 13.0 |
| SQL Server | Database | 2019+ |
| JWT | Authentication | Latest |
| BCrypt | Password Hashing | Latest |
| Swagger | API Documentation | Latest |

---

## 📚 Documentation

### **Backend API Documentation**
Located in `ServerSide/My Online Store/Docs/`:
- 📘 [**API Endpoints Reference**](ServerSide/My%20Online%20Store/Docs/API_ENDPOINTS_REFERENCE.md)
- 📗 [**Frontend Developer Guide**](ServerSide/My%20Online%20Store/Docs/FRONTEND_DEVELOPER_GUIDE.md) - 100+ pages
- ⚡ [**API Quick Reference**](ServerSide/My%20Online%20Store/Docs/FRONTEND_API_QUICK_REFERENCE.md)
- ✅ [**Implementation Checklist**](ServerSide/My%20Online%20Store/Docs/FRONTEND_IMPLEMENTATION_CHECKLIST.md)
- 💻 [**Code Templates**](ServerSide/My%20Online%20Store/Docs/FRONTEND_CODE_TEMPLATES.md)
- 🗺️ [**Documentation Index**](ServerSide/My%20Online%20Store/Docs/FRONTEND_DOCUMENTATION_INDEX.md)
- 🗄️ [**Database Schema & Stored Procedures**](ServerSide/My%20Online%20Store/Docs/Database_StoredProcedures.sql)

### **Frontend Documentation**
- Component documentation through JSDoc comments
- TypeScript type definitions in `src/types/`
- Service layer documentation in `src/services/`

---

## 📞 Support

If you have any questions or need help:

1. Check the [Documentation](ServerSide/My%20Online%20Store/Docs/)
2. Open an [Issue](https://github.com/YazenJO/Online-Store/issues)
3. Contact via [GitHub](https://github.com/YazenJO)

---

## ⭐ Star This Repository

If you find this project useful, please give it a star! ⭐

---

<div align="center">

**Made with ❤️ using React 19, TypeScript, and ASP.NET Core 9**

### 🛠️ Built With
[React](https://react.dev/) • [TypeScript](https://www.typescriptlang.org/) • [Vite](https://vite.dev/) • [Tailwind CSS](https://tailwindcss.com/) • [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) • [SQL Server](https://www.microsoft.com/sql-server)

[⬆ Back to Top](#-online-store---full-stack-platform)

</div>
