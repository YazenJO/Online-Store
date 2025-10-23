# ?? Online Store API - Complete Endpoint Reference

**Base URL:** `https://localhost:5001/api` or `https://yourdomain.com/api`  
**API Version:** 1.0  
**Last Updated:** January 2025  
**Framework:** ASP.NET Core 9 (.NET 9)

---

## ?? Table of Contents

1. [Authentication](#authentication)
2. [Customers](#customers)
3. [Products](#products)
4. [Categories](#categories)
5. [Orders](#orders)
6. [Order Items](#order-items)
7. [Payments](#payments)
8. [Shipping](#shipping)
9. [Product Images](#product-images)
10. [Reviews](#reviews)
11. [Authorization Matrix](#authorization-matrix)
12. [Status Codes](#status-codes)

---

## ?? Authentication

### Register
```http
POST /api/auth/register
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

**Response:** `201 Created`
```json
{
  "customer": {
    "customerID": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "1234567890",
    "address": "123 Main St",
    "password": null,
    "role": "Customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- Password must be at least 6 characters
- Username must be unique
- Name, email, username, and password are required

---

### Login
```http
POST /api/auth/login
```

**Request:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "customer": {
    "customerID": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "1234567890",
    "address": "123 Main St",
    "password": null,
    "role": "Customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing username or password
- `401` - Invalid credentials

---

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "customerID": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "phone": "1234567890",
  "address": "123 Main St",
  "password": null,
  "role": "Customer"
}
```

**Error Responses:**
- `401` - Invalid or missing token
- `404` - Customer not found

---

## ?? Customers

### Get All Customers
```http
GET /api/Customers/All
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "customerID": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "1234567890",
    "address": "123 Main St",
    "password": "hashedPassword",
    "role": "Customer"
  }
]
```

---

### Get Customer by ID
```http
GET /api/Customers/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "customerID": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "phone": "1234567890",
  "address": "123 Main St",
  "password": "hashedPassword",
  "role": "Customer"
}
```

---

### Create Customer
```http
POST /api/Customers
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "username": "janesmith",
  "password": "SecurePass456",
  "phone": "0987654321",
  "address": "456 Oak Ave",
  "role": "Customer"
}
```

---

### Update Customer
```http
PUT /api/Customers/{id}
Authorization: Bearer {token}
```

**Request:**
```json
{
  "customerID": 1,
  "name": "John Updated",
  "email": "john.updated@example.com",
  "username": "johndoe",
  "password": "NewPassword123",
  "phone": "1112223333",
  "address": "789 New St",
  "role": "Customer"
}
```

---

### Delete Customer
```http
DELETE /api/Customers/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
"Customer with ID 1 has been deleted."
```

---

### Check Customer Exists
```http
GET /api/Customers/Exists/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
true
```

---

## ?? Products

### Get All Products (Enhanced with Category & Images)
```http
GET /api/products
```

**Response:** `200 OK`
```json
[
  {
    "productID": 1,
    "productName": "Laptop",
    "description": "High-performance laptop",
    "price": 1299.99,
    "quantityInStock": 50,
    "categoryID": 1,
    "category": {
      "categoryID": 1,
      "categoryName": "Electronics"
    },
    "images": [
      {
        "imageID": 1,
        "imageURL": "https://example.com/laptop1.jpg",
        "productID": 1,
        "imageOrder": 1
      },
      {
        "imageID": 2,
        "imageURL": "https://example.com/laptop2.jpg",
        "productID": 1,
        "imageOrder": 2
      }
    ]
  }
]
```

**Note:** This endpoint returns enriched product data including category information and associated images.

---

### Get Product by ID (Enhanced with Category & Images)
```http
GET /api/products/{id}
```

**Response:** `200 OK`
```json
{
  "productID": 1,
  "productName": "Laptop",
  "description": "High-performance laptop",
  "price": 1299.99,
  "quantityInStock": 50,
  "categoryID": 1,
  "category": {
    "categoryID": 1,
    "categoryName": "Electronics"
  },
  "images": [
    {
      "imageID": 1,
      "imageURL": "https://example.com/laptop1.jpg",
      "productID": 1,
      "imageOrder": 1
    }
  ]
}
```

**Error Responses:**
- `400` - Invalid ID
- `404` - Product not found

---

### Get Products by Category ? **NEW**
```http
GET /api/products/category/{categoryId}
```

**Response:** `200 OK`
```json
[
  {
    "productID": 1,
    "productName": "Laptop",
    "description": "High-performance laptop",
    "price": 1299.99,
    "quantityInStock": 50,
    "categoryID": 1,
    "category": {
      "categoryID": 1,
      "categoryName": "Electronics"
    },
    "images": [...]
  }
]
```

**Note:** Returns empty array `[]` if no products found in category (not 404).

---

### Search Products ? **NEW**
```http
GET /api/products/search?q={query}
```

**Example:** `GET /api/products/search?q=laptop`

**Response:** `200 OK`
```json
[
  {
    "productID": 1,
    "productName": "Laptop",
    "description": "High-performance laptop",
    "price": 1299.99,
    "quantityInStock": 50,
    "categoryID": 1,
    "category": {
      "categoryID": 1,
      "categoryName": "Electronics"
    },
    "images": [...]
  }
]
```

**Note:** 
- Searches in product name and description
- Returns empty array `[]` if no matches found
- If query is empty, returns all products

---

## ?? Categories

### Get All Categories
```http
GET /api/categories
```

**Response:** `200 OK`
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

**Error Responses:**
- `404` - No categories found

---

### Get Category by ID
```http
GET /api/categories/{id}
```

**Response:** `200 OK`
```json
{
  "categoryID": 1,
  "categoryName": "Electronics"
}
```

**Error Responses:**
- `400` - Invalid ID
- `404` - Category not found

---

### Create Category
```http
POST /api/categories
Authorization: Bearer {token}
```

**Request:**
```json
{
  "categoryName": "Furniture"
}
```

**Response:** `201 Created`
```json
{
  "categoryID": 3,
  "categoryName": "Furniture"
}
```

---

### Update Category
```http
PUT /api/categories/{id}
Authorization: Bearer {token}
```

**Request:**
```json
{
  "categoryID": 1,
  "categoryName": "Electronics & Accessories"
}
```

---

### Delete Category
```http
DELETE /api/categories/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Category with ID 1 has been deleted"
}
```

---

### Check Category Exists
```http
GET /api/categories/exists/{id}
```

**Note:** Route is lowercase `exists` not `Exists`

**Response:** `200 OK`
```json
true
```

---

## ?? Orders

### Get All Orders (Admin Only)
```http
GET /api/Orders/All
Authorization: Bearer {admin-token}
```

**Response:** `200 OK`
```json
[
  {
    "orderID": 1,
    "customerID": 5,
    "orderDate": "2025-01-20T10:30:00Z",
    "totalAmount": 1599.98,
    "status": 1,
    "statusText": "Pending",
    "orderStatusEnum": "Pending"
  }
]
```

**Authorization:** Admin role required

---

### Get Order by ID
```http
GET /api/Orders/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "orderID": 1,
  "customerID": 5,
  "orderDate": "2025-01-20T10:30:00Z",
  "totalAmount": 1599.98,
  "status": 1,
  "statusText": "Pending",
  "orderStatusEnum": "Pending"
}
```

**Authorization:** 
- Customers can only view their own orders
- Admins can view any order

**Error Responses:**
- `400` - Invalid ID
- `403` - Forbidden (trying to access another customer's order)
- `404` - Order not found

---

### Get Orders by Customer ID
```http
GET /api/Orders/customer/{customerId}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "orderID": 1,
    "customerID": 5,
    "orderDate": "2025-01-20T10:30:00Z",
    "totalAmount": 1599.98,
    "status": 1,
    "statusText": "Pending"
  }
]
```

**Authorization:**
- Customers can only view their own orders (customerId must match token)
- Admins can view any customer's orders

**Note:** Returns empty array `[]` if no orders found (not 404).

---

### Create Complete Order ? **RECOMMENDED**
```http
POST /api/Orders/complete
Authorization: Bearer {token}
```

**Request:**
```json
{
  "customerID": 5,
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
  "shippingAddress": "123 Main St, City, State 12345",
  "carrierName": "FedEx",
  "estimatedDeliveryDate": "2025-01-27T00:00:00Z",
  "orderStatus": 1
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Order created successfully with 2 item(s)",
  "order": {
    "orderID": 1,
    "customerID": 5,
    "orderDate": "2025-01-20T10:30:00Z",
    "totalAmount": 159.97,
    "status": 1,
    "statusText": "Pending"
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
    "transactionDate": "2025-01-20T10:30:00Z"
  },
  "shipping": {
    "shippingID": 1,
    "orderID": 1,
    "carrierName": "FedEx",
    "trackingNumber": "TRACK-20250120-123456",
    "shippingStatus": 1,
    "estimatedDeliveryDate": "2025-01-27T00:00:00Z",
    "actualDeliveryDate": null
  }
}
```

**Features:**
- Creates order, order items, payment, and shipping in a single transaction
- Automatically calculates total amount from products
- Validates product stock availability
- Updates product stock automatically
- Generates tracking number
- Automatic rollback on any failure

**Validation:**
- Customer must exist
- All products must exist and have sufficient stock
- Payment method, shipping address, and carrier name are required
- Quantities must be positive

**Authorization:**
- Customers can only create orders for themselves
- Admins can create orders for any customer

**Error Responses:**
- `400` - Validation errors (invalid data, insufficient stock)
- `403` - Forbidden (trying to create order for another customer)
- `500` - Transaction failed (automatic rollback performed)

---

### Create Order (Simple - Legacy)
```http
POST /api/Orders
Authorization: Bearer {token}
```

**Request:**
```json
{
  "customerID": 5,
  "orderDate": "2025-01-20T10:30:00Z",
  "totalAmount": 1599.98,
  "status": 1
}
```

**Note:** This only creates the order record. You must manually create order items, payment, and shipping separately. Use `/api/Orders/complete` instead.

---

### Update Order (Admin Only)
```http
PUT /api/Orders/{id}
Authorization: Bearer {admin-token}
```

**Request:**
```json
{
  "orderID": 1,
  "customerID": 5,
  "orderDate": "2025-01-20T10:30:00Z",
  "totalAmount": 1599.98,
  "status": 2
}
```

**Validation:**
- Status must be between 1 (Pending) and 6 (Completed)

**Authorization:** Admin role required

---

### Delete Order (Admin Only)
```http
DELETE /api/Orders/{id}
Authorization: Bearer {admin-token}
```

**Response:** `200 OK`
```json
"Order with ID 1 has been deleted."
```

**Authorization:** Admin role required

---

### Check Order Exists
```http
GET /api/Orders/Exists/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
true
```

---

## ?? Order Items

**Note:** Order items are typically created automatically via `/api/Orders/complete`. These endpoints are available for manual management if needed.

### Get Order Items by Order ID
```http
GET /api/orderitems/order/{orderId}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "orderID": 1,
    "productID": 1,
    "quantity": 2,
    "price": 1299.99,
    "totalPrice": 2599.98
  }
]
```

---

### Get Specific Order Item
```http
GET /api/orderitems/{orderId}/{productId}
Authorization: Bearer {token}
```

---

### Create Order Item
```http
POST /api/orderitems
Authorization: Bearer {token}
```

**Request:**
```json
{
  "orderID": 1,
  "productID": 5,
  "quantity": 3,
  "price": 49.99,
  "totalPrice": 149.97
}
```

---

### Update Order Item
```http
PUT /api/orderitems/{orderId}/{productId}
Authorization: Bearer {token}
```

---

### Delete Order Item
```http
DELETE /api/orderitems/{orderId}/{productId}
Authorization: Bearer {token}
```

---

### Delete All Items in Order
```http
DELETE /api/orderitems/order/{orderId}
Authorization: Bearer {token}
```

---

## ?? Payments

### Get All Payments
```http
GET /api/Payments/All
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "paymentID": 1,
    "orderID": 1,
    "amount": 1599.98,
    "paymentMethod": "Credit Card",
    "transactionDate": "2025-01-20T10:30:00Z"
  }
]
```

---

### Get Payment by ID
```http
GET /api/Payments/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "paymentID": 1,
  "orderID": 1,
  "amount": 1599.98,
  "paymentMethod": "Credit Card",
  "transactionDate": "2025-01-20T10:30:00Z"
}
```

---

### Create Payment
```http
POST /api/Payments
Authorization: Bearer {token}
```

**Request:**
```json
{
  "orderID": 1,
  "amount": 1599.98,
  "paymentMethod": "PayPal",
  "transactionDate": "2025-01-20T10:30:00Z"
}
```

---

### Update Payment
```http
PUT /api/Payments/{id}
Authorization: Bearer {token}
```

---

### Delete Payment
```http
DELETE /api/Payments/{id}
Authorization: Bearer {token}
```

---

### Check Payment Exists
```http
GET /api/Payments/Exists/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
true
```

---

## ?? Shipping

### Get All Shippings
```http
GET /api/Shippings/All
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "shippingID": 1,
    "orderID": 1,
    "carrierName": "FedEx",
    "trackingNumber": "TRACK-20250120-123456",
    "shippingStatus": 1,
    "estimatedDeliveryDate": "2025-01-27T00:00:00Z",
    "actualDeliveryDate": null
  }
]
```

---

### Get Shipping by ID
```http
GET /api/Shippings/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "shippingID": 1,
  "orderID": 1,
  "carrierName": "FedEx",
  "trackingNumber": "TRACK-20250120-123456",
  "shippingStatus": 1,
  "estimatedDeliveryDate": "2025-01-27T00:00:00Z",
  "actualDeliveryDate": null
}
```

---

### Create Shipping
```http
POST /api/Shippings
Authorization: Bearer {token}
```

**Request:**
```json
{
  "orderID": 1,
  "carrierName": "UPS",
  "trackingNumber": "1Z999AA10123456789",
  "shippingStatus": 1,
  "estimatedDeliveryDate": "2025-01-27T00:00:00Z"
}
```

---

### Update Shipping
```http
PUT /api/Shippings/{id}
Authorization: Bearer {token}
```

---

### Delete Shipping
```http
DELETE /api/Shippings/{id}
Authorization: Bearer {token}
```

---

### Check Shipping Exists
```http
GET /api/Shippings/Exists/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
true
```

---

## ??? Product Images

### Get All Product Images
```http
GET /api/images/All
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "imageID": 1,
    "imageURL": "https://example.com/laptop1.jpg",
    "productID": 1,
    "imageOrder": 1
  },
  {
    "imageID": 2,
    "imageURL": "https://example.com/laptop2.jpg",
    "productID": 1,
    "imageOrder": 2
  }
]
```

---

### Get Image by ID
```http
GET /api/images/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "imageID": 1,
  "imageURL": "https://example.com/laptop1.jpg",
  "productID": 1,
  "imageOrder": 1
}
```

**Error Responses:**
- `400` - Invalid ID
- `404` - Image not found

---

### Create Product Image
```http
POST /api/images
Authorization: Bearer {token}
```

**Request:**
```json
{
  "imageURL": "https://example.com/laptop3.jpg",
  "productID": 1,
  "imageOrder": 3
}
```

**Response:** `201 Created`
```json
{
  "imageID": 3,
  "imageURL": "https://example.com/laptop3.jpg",
  "productID": 1,
  "imageOrder": 3
}
```

**Validation:**
- imageURL is required
- productID must be valid (> 0)
- imageOrder is optional (can be null)

---

### Update Product Image
```http
PUT /api/images/{id}
Authorization: Bearer {token}
```

**Request:**
```json
{
  "imageID": 1,
  "imageURL": "https://example.com/laptop1_updated.jpg",
  "productID": 1,
  "imageOrder": 1
}
```

---

### Delete Product Image
```http
DELETE /api/images/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
"Image with ID 1 has been deleted."
```

---

## ? Reviews

### Get All Reviews for a Product
```http
GET /api/products/{productId}/reviews
```

**Example:** `GET /api/products/1/reviews`

**Response:** `200 OK`
```json
[
  {
    "reviewID": 1,
    "productID": 1,
    "customerID": 5,
    "reviewText": "Great laptop! Very fast and reliable.",
    "rating": 5.0,
    "reviewDate": "2025-01-15T14:30:00Z",
    "customer": {
      "customerID": 5,
      "name": "John Doe"
    }
  },
  {
    "reviewID": 2,
    "productID": 1,
    "customerID": 8,
    "reviewText": "Good value for money.",
    "rating": 4.5,
    "reviewDate": "2025-01-18T09:15:00Z",
    "customer": {
      "customerID": 8,
      "name": "Jane Smith"
    }
  }
]
```

**Note:** Returns empty array `[]` if no reviews found (not 404).

---

### Get Review by ID
```http
GET /api/reviews/{id}
```

**Response:** `200 OK`
```json
{
  "reviewID": 1,
  "productID": 1,
  "customerID": 5,
  "reviewText": "Great laptop! Very fast and reliable.",
  "rating": 5.0,
  "reviewDate": "2025-01-15T14:30:00Z",
  "customer": {
    "customerID": 5,
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `400` - Invalid ID
- `404` - Review not found

---

### Create Review
```http
POST /api/reviews
Authorization: Bearer {token}
```

**Request:**
```json
{
  "productID": 1,
  "customerID": 5,
  "reviewText": "Excellent product!",
  "rating": 5.0
}
```

**Response:** `201 Created`
```json
{
  "reviewID": 3,
  "productID": 1,
  "customerID": 5,
  "reviewText": "Excellent product!",
  "rating": 5.0,
  "reviewDate": "2025-01-20T10:30:00Z",
  "customer": {
    "customerID": 5,
    "name": "John Doe"
  }
}
```

**Authorization:** 
- Requires authentication
- Customer can only create reviews for themselves (customerID must match token)

**Validation:**
- productID and customerID must be valid
- reviewText and rating are required

**Error Responses:**
- `400` - Invalid review data
- `401` - Not authenticated
- `403` - Forbidden (trying to create review for another customer)

---

### Update Review
```http
PUT /api/reviews/{id}
Authorization: Bearer {token}
```

**Request:**
```json
{
  "reviewText": "Updated review text",
  "rating": 4.5
}
```

**Response:** `200 OK`
```json
{
  "reviewID": 1,
  "productID": 1,
  "customerID": 5,
  "reviewText": "Updated review text",
  "rating": 4.5,
  "reviewDate": "2025-01-15T14:30:00Z",
  "customer": {
    "customerID": 5,
    "name": "John Doe"
  }
}
```

**Authorization:**
- Requires authentication
- Customer can only update their own reviews

**Note:** ProductID and CustomerID cannot be changed after creation.

**Error Responses:**
- `400` - Invalid data
- `401` - Not authenticated
- `403` - Forbidden (trying to update another customer's review)
- `404` - Review not found

---

### Delete Review
```http
DELETE /api/reviews/{id}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Review with ID 1 has been deleted"
}
```

**Authorization:**
- Requires authentication
- Customer can only delete their own reviews

**Error Responses:**
- `400` - Invalid ID
- `401` - Not authenticated
- `403` - Forbidden (trying to delete another customer's review)
- `404` - Review not found

---

## ?? Authorization Matrix

### Public Endpoints (No Authentication Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login |
| `/api/products` | GET | Get all products |
| `/api/products/{id}` | GET | Get product by ID |
| `/api/products/category/{categoryId}` | GET | Get products by category |
| `/api/products/search?q={query}` | GET | Search products |
| `/api/categories` | GET | Get all categories |
| `/api/categories/{id}` | GET | Get category by ID |
| `/api/products/{productId}/reviews` | GET | Get product reviews |
| `/api/reviews/{id}` | GET | Get review by ID |

### Customer Endpoints (Requires Authentication)

| Endpoint | Method | Authorization Rule |
|----------|--------|-------------------|
| `/api/auth/me` | GET | Own profile only |
| `/api/Customers/{id}` | GET | Own profile only |
| `/api/Customers/{id}` | PUT | Own profile only |
| `/api/Orders/customer/{customerId}` | GET | Own orders only |
| `/api/Orders/{id}` | GET | Own orders only |
| `/api/Orders/complete` | POST | Own orders only |
| `/api/Orders` | POST | Own orders only |
| `/api/reviews` | POST | Must match customerID in token |
| `/api/reviews/{id}` | PUT | Own reviews only |
| `/api/reviews/{id}` | DELETE | Own reviews only |

### Admin Only Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/Orders/All` | GET | View all orders |
| `/api/Orders/{id}` | PUT | Update any order |
| `/api/Orders/{id}` | DELETE | Delete any order |
| `/api/Customers/All` | GET | View all customers |
| `/api/Customers` | POST | Create customer |
| `/api/Customers/{id}` | DELETE | Delete customer |

### Authorization Headers
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles
- **Customer**: Regular user (default for new registrations)
- **Admin**: Administrator with elevated permissions

---

## ?? Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Invalid data, validation errors |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Valid token but insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `500` | Internal Server Error | Server-side error |

---

## ?? Order Status Values

| Value | Name | Description |
|-------|------|-------------|
| `1` | Pending | Order placed but not yet processed (default) |
| `2` | Processing | Order is being prepared/processed |
| `3` | Shipped | Order has been shipped to customer |
| `4` | Delivered | Order has been delivered to customer |
| `5` | Cancelled | Order has been cancelled |
| `6` | Completed | Order has been completed successfully |

**Usage in API:**
```json
{
  "status": 3,
  "statusText": "Shipped",
  "orderStatusEnum": "Shipped"
}
```

---

## ?? Shipping Status Values

| Value | Name | Description |
|-------|------|-------------|
| `1` | Pending | Awaiting shipment |
| `2` | In Transit | Package is on the way |
| `3` | Out for Delivery | Package is out for delivery |
| `4` | Delivered | Package has been delivered |
| `5` | Failed Delivery | Delivery attempt failed |
| `6` | Returned | Package has been returned |

---

## ?? Quick Start for Frontend

### 1. User Registration
```javascript
const response = await fetch('https://api.yourstore.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    password: "SecurePass123",
    phone: "1234567890",
    address: "123 Main St"
  })
});
const { customer, token } = await response.json();
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(customer));
```

### 2. User Login
```javascript
const response = await fetch('https://api.yourstore.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: "johndoe",
    password: "SecurePass123"
  })
});
const { customer, token } = await response.json();
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(customer));
```

### 3. Fetch Products (with Category & Images)
```javascript
const response = await fetch('https://api.yourstore.com/api/products');
const products = await response.json();

// Each product now includes:
// - category: { categoryID, categoryName }
// - images: [{ imageID, imageURL, productID, imageOrder }]
```

### 4. Search Products
```javascript
const searchQuery = "laptop";
const response = await fetch(`https://api.yourstore.com/api/products/search?q=${encodeURIComponent(searchQuery)}`);
const products = await response.json();
```

### 5. Filter by Category
```javascript
const categoryId = 1;
const response = await fetch(`https://api.yourstore.com/api/products/category/${categoryId}`);
const products = await response.json();
```

### 6. Create Complete Order (Recommended)
```javascript
const token = localStorage.getItem('token');
const response = await fetch('https://api.yourstore.com/api/Orders/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    customerID: 5,
    items: [
      { productID: 1, quantity: 2 },
      { productID: 3, quantity: 1 }
    ],
    paymentMethod: "Credit Card",
    shippingAddress: "123 Main St, City, State 12345",
    carrierName: "FedEx",
    estimatedDeliveryDate: "2025-01-27T00:00:00Z"
  })
});
const orderResult = await response.json();
// orderResult includes: order, orderItems, payment, shipping
```

### 7. Get User's Orders
```javascript
const token = localStorage.getItem('token');
const customerId = 5;
const response = await fetch(`https://api.yourstore.com/api/Orders/customer/${customerId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const orders = await response.json();
```

### 8. Get Product Reviews
```javascript
const productId = 1;
const response = await fetch(`https://api.yourstore.com/api/products/${productId}/reviews`);
const reviews = await response.json();
```

### 9. Submit Review
```javascript
const token = localStorage.getItem('token');
const response = await fetch('https://api.yourstore.com/api/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productID: 1,
    customerID: 5,
    reviewText: "Great product!",
    rating: 5.0
  })
});
const review = await response.json();
```

---

## ?? API Summary

**Total Endpoints:** 60+

### By Category:
- **Authentication:** 3 endpoints
- **Customers:** 6 endpoints
- **Products:** 8 endpoints (includes search & category filter)
- **Categories:** 6 endpoints
- **Orders:** 8 endpoints
- **Order Items:** 6 endpoints
- **Payments:** 6 endpoints
- **Shipping:** 6 endpoints
- **Product Images:** 5 endpoints
- **Reviews:** 5 endpoints

### Most Used Endpoints:
1. `POST /api/auth/register` - Register new user
2. `POST /api/auth/login` - User login
3. `GET /api/products` - Get all products (with category & images)
4. `GET /api/products/search?q={query}` - Search products
5. `POST /api/Orders/complete` - Create complete order ? **RECOMMENDED**
6. `GET /api/Orders/customer/{customerId}` - Get user's orders
7. `GET /api/products/{productId}/reviews` - Get product reviews
8. `POST /api/reviews` - Submit review

---

## ?? Related Documentation

- **Frontend Developer Guide:** `FRONTEND_DEVELOPER_GUIDE.md`
- **Frontend API Quick Reference:** `FRONTEND_API_QUICK_REFERENCE.md`
- **Order Process Guide:** `ORDER_PROCESS_COMPLETE_GUIDE.md`
- **Authorization Guide:** `ROLE_AUTHORIZATION_GUIDE.md`

---

**Last Updated:** January 2025  
**API Version:** 1.0  
**Framework:** ASP.NET Core 9 (.NET 9)  
**Authentication:** JWT Bearer Token
