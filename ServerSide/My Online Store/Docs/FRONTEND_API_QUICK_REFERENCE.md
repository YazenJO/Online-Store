# Frontend API Quick Reference

**Base URL:** `https://localhost:7XXX/api`

---

## ?? Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "username": "johndoe",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

## ??? Products

### Get All Products
```http
GET /api/products
```

### Get Product by ID
```http
GET /api/products/{id}
```

### Get Products by Category
```http
GET /api/products/category/{categoryId}
```

### Search Products
```http
GET /api/products/search?q=wireless
```

---

## ?? Categories

### Get All Categories
```http
GET /api/categories
```

### Get Category by ID
```http
GET /api/categories/{id}
```

---

## ?? Orders

### Get My Orders
```http
GET /api/Orders/customer/{customerId}
Authorization: Bearer {token}
```

### Get Order Details
```http
GET /api/Orders/{id}
Authorization: Bearer {token}
```

### Create Complete Order
```http
POST /api/Orders/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "customerID": 1,
  "items": [
    { "productID": 1, "quantity": 2 },
    { "productID": 3, "quantity": 1 }
  ],
  "paymentMethod": "Credit Card",
  "shippingAddress": "123 Main St, City, State, ZIP",
  "carrierName": "FedEx",
  "estimatedDeliveryDate": "2024-01-22T00:00:00Z"
}
```

---

## ?? Order Status Values

| Status | Value | Description |
|--------|-------|-------------|
| Pending | 1 | Order placed but not processed |
| Processing | 2 | Order being prepared |
| Shipped | 3 | Order shipped to customer |
| Delivered | 4 | Order delivered |
| Cancelled | 5 | Order cancelled |
| Completed | 6 | Order completed successfully |

---

## ?? Shipping Status Values

| Status | Value | Description |
|--------|-------|-------------|
| Pending | 1 | Awaiting shipment |
| In Transit | 2 | On the way |
| Out for Delivery | 3 | Out for delivery |
| Delivered | 4 | Successfully delivered |
| Failed Delivery | 5 | Delivery failed |
| Returned | 6 | Package returned |

---

## ?? User Roles

- **Customer**: Regular user (can place orders, view own orders)
- **Admin**: Administrator (can manage products, view all orders, manage customers)

---

## ?? LocalStorage Keys

```typescript
'auth_token'  // JWT token
'user'        // User object (JSON)
'cart-storage' // Cart items (Zustand persist)
```

---

## ?? Common Response Formats

### Success Response (200 OK)
```json
{
  "data": { ... }
}
```

### Created Response (201 Created)
```json
{
  "data": { ... }
}
```

### Error Response (400/401/403/404/500)
```json
{
  "message": "Error description"
}
```

---

## ??? Axios Setup

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## ?? Example API Calls

### Login
```typescript
const login = async (username: string, password: string) => {
  const response = await apiClient.post('/auth/login', {
    username,
    password
  });
  localStorage.setItem('auth_token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.customer));
  return response.data;
};
```

### Get Products
```typescript
const getProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};
```

### Place Order
```typescript
const placeOrder = async (orderData: CreateCompleteOrderRequest) => {
  const response = await apiClient.post('/Orders/complete', orderData);
  return response.data;
};
```

---

## ?? Key TypeScript Types

```typescript
interface Customer {
  customerID: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string | null;
  role: 'Customer' | 'Admin';
}

interface Product {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantityInStock: number;
  categoryID: number;
  category: Category | null;
  images: ProductImage[];
}

interface Order {
  orderID: number | null;
  customerID: number;
  orderDate: string;
  totalAmount: number;
  status: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}
```

---

## ? Common Utils

### Format Currency
```typescript
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
```

### Format Date
```typescript
import { format } from 'date-fns';

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};
```

### Get Status Badge Color
```typescript
export const getOrderStatusColor = (status: number): string => {
  const colors = {
    1: 'bg-yellow-100 text-yellow-800', // Pending
    2: 'bg-blue-100 text-blue-800',     // Processing
    3: 'bg-purple-100 text-purple-800', // Shipped
    4: 'bg-green-100 text-green-800',   // Delivered
    5: 'bg-red-100 text-red-800',       // Cancelled
    6: 'bg-green-100 text-green-800',   // Completed
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
```

---

## ?? Quick Start Commands

```bash
# Create project
npm create vite@latest online-store -- --template react-ts

# Install dependencies
npm install axios zustand react-router-dom react-hook-form zod
npm install date-fns react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer

# Start development
npm run dev

# Build for production
npm run build
```

---

## ?? Environment Variables

```env
VITE_API_BASE_URL=https://localhost:7000/api
VITE_APP_NAME=Online Store
```

---

## ?? Testing Endpoints

Use Swagger UI: `https://localhost:7XXX/swagger`

Or use cURL:
```bash
# Login
curl -X POST https://localhost:7000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'

# Get Products (no auth required)
curl https://localhost:7000/api/products

# Get My Orders (auth required)
curl https://localhost:7000/api/Orders/customer/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ?? Common Pitfalls

1. **Forgot to add Authorization header** ? 401 Unauthorized
2. **Token expired** ? 401 Unauthorized (auto logout)
3. **CORS issues** ? Check API URL and CORS settings
4. **Product out of stock** ? Check `quantityInStock` before ordering
5. **Wrong customer ID in order** ? Only access own orders (not admin)

---

## ?? Support Resources

- **Full Documentation**: `FRONTEND_DEVELOPER_GUIDE.md`
- **API Swagger**: `https://localhost:7XXX/swagger`
- **Backend Docs**: `API_ENDPOINTS_REFERENCE.md`
