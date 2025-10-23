# ?? Online Store API

A complete RESTful API for an e-commerce platform built with **ASP.NET Core 9** and **.NET 9**, featuring JWT authentication, role-based authorization, and comprehensive order management.

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=flat&logo=dotnet)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-13.0-239120?style=flat&logo=c-sharp)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-9.0-512BD4?style=flat&logo=.net)](https://dotnet.microsoft.com/apps/aspnet)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-CC2927?style=flat&logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ?? Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Order Management](#-order-management)
- [Configuration](#-configuration)
- [Frontend Integration](#-frontend-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## ? Features

### ?? **Authentication & Security**
- JWT Bearer token authentication
- BCrypt password hashing
- Role-based authorization (Customer/Admin)
- Secure user registration and login

### ??? **E-Commerce Core**
- Product catalog with categories
- Product images support
- Advanced product search and filtering
- Shopping cart management
- Complete order processing
- Payment tracking
- Shipping management
- Product reviews and ratings

### ?? **Order Management**
- Single-transaction order creation
- Automatic stock management
- Order status tracking (6 states)
- Shipping status tracking (6 states)
- Order history
- Automatic rollback on failures

### ?? **User Management**
- Customer profiles
- Order history per customer
- Admin dashboard capabilities
- Customer reviews

### ?? **API Features**
- RESTful API design
- Swagger/OpenAPI documentation
- Comprehensive error handling
- CORS support
- Response caching
- Input validation

---

## ??? Architecture

The project follows a **3-tier architecture** with clear separation of concerns:

```
???????????????????????????????????????
?         API Layer (Web API)         ?
?  Controllers, DTOs, Middleware      ?
???????????????????????????????????????
               ?
???????????????????????????????????????
?   Business Logic Layer (BLL)        ?
?  Business Rules, Validation         ?
???????????????????????????????????????
               ?
???????????????????????????????????????
?   Data Access Layer (DAL)           ?
?  Database Operations, Stored Procs  ?
???????????????????????????????????????
               ?
???????????????????????????????????????
?         SQL Server Database         ?
???????????????????????????????????????
```

### **Design Patterns Used**
- Repository Pattern
- DTO (Data Transfer Object) Pattern
- Dependency Injection
- Service Layer Pattern
- Factory Pattern

---

## ??? Tech Stack

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

## ?? Getting Started

### **Prerequisites**

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server 2019+](https://www.microsoft.com/sql-server/sql-server-downloads) or SQL Server Express
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/YazenJO/Online-Store.git
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
- API Base URL: `https://localhost:5001/api`
- Swagger UI: `https://localhost:5001/swagger`

---

## ?? API Documentation

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

## ?? Project Structure

```
Online-Store/
??? ServerSide/
?   ??? My Online Store/              # API Project (Web API)
?   ?   ??? Controllers/              # API Controllers
?   ?   ??? DTOs/                     # Data Transfer Objects
?   ?   ??? Services/                 # JWT, Password Hashing
?   ?   ??? Docs/                     # Complete Documentation
?   ?   ??? Program.cs                # Application entry point
?   ?   ??? appsettings.json          # Configuration
?   ?
?   ??? OnlineStore.BLL/              # Business Logic Layer
?   ?   ??? Customer.cs
?   ?   ??? Product.cs
?   ?   ??? Order.cs
?   ?   ??? OrderItem.cs
?   ?   ??? Payment.cs
?   ?   ??? Shipping.cs
?   ?   ??? Category.cs
?   ?   ??? Review.cs
?   ?   ??? Image.cs
?   ?
?   ??? OnlineStore.DAL/              # Data Access Layer
?   ?   ??? CustomerData.cs
?   ?   ??? ProductData.cs
?   ?   ??? OrderData.cs
?   ?   ??? OrderItemData.cs
?   ?   ??? PaymentData.cs
?   ?   ??? ShippingData.cs
?   ?   ??? CategoryData.cs
?   ?   ??? ReviewData.cs
?   ?   ??? ImageData.cs
?   ?   ??? OnlineStoreDALLSettings.cs
?   ?
?   ??? OnlineStore.Models/           # DTOs & Models
?       ??? CustomerDTO.cs
?       ??? ProductDTO.cs
?       ??? OrderDTO.cs
?       ??? OrderItemDTO.cs
?       ??? PaymentDTO.cs
?       ??? ShippingDTO.cs
?       ??? CategoryDTO.cs
?       ??? ReviewDTO.cs
?       ??? ImageDTO.cs
?
??? README.md                         # This file
```

---

## ??? Database Schema

### **Core Tables**

```
Customers
??? CustomerID (PK)
??? Name
??? Email
??? Phone
??? Address
??? Username (Unique)
??? Password (Hashed)
??? Role (Customer/Admin)

Products
??? ProductID (PK)
??? ProductName
??? Description
??? Price
??? QuantityInStock
??? CategoryID (FK)

Categories
??? CategoryID (PK)
??? CategoryName

Orders
??? OrderID (PK)
??? CustomerID (FK)
??? OrderDate
??? TotalAmount
??? Status (1-6)

OrderItems (Composite Key)
??? OrderID (PK, FK)
??? ProductID (PK, FK)
??? Quantity
??? Price
??? TotalPrice

Payments
??? PaymentID (PK)
??? OrderID (FK)
??? Amount
??? PaymentMethod
??? TransactionDate

Shipping
??? ShippingID (PK)
??? OrderID (FK)
??? CarrierName
??? TrackingNumber
??? ShippingStatus (1-6)
??? EstimatedDeliveryDate
??? ActualDeliveryDate

Reviews
??? ReviewID (PK)
??? ProductID (FK)
??? CustomerID (FK)
??? ReviewText
??? Rating (decimal)
??? ReviewDate

ProductImages
??? ImageID (PK)
??? ProductID (FK)
??? ImageURL
??? ImageOrder
```

### **Database Scripts**
- Full schema and stored procedures: [`Docs/Database_StoredProcedures.sql`](ServerSide/My%20Online%20Store/Docs/Database_StoredProcedures.sql)

---

## ?? Authentication & Authorization

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

### **Example: Register & Login**

```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    password: "SecurePass123"
  })
});
const { customer, token } = await response.json();
localStorage.setItem('token', token);

// Use token in subsequent requests
const ordersResponse = await fetch('/api/Orders/customer/1', {
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
});
```

---

## ?? Order Management

### **Complete Order Flow**

The API provides a **single-transaction order creation** endpoint that handles:

1. ? Order validation
2. ? Order creation
3. ? Order items creation
4. ? Payment processing
5. ? Shipping setup
6. ? Stock updates
7. ? Automatic rollback on any failure

### **Create Complete Order**

```javascript
POST /api/Orders/complete

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

## ?? Configuration

### **appsettings.json**

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

## ?? Frontend Integration

This API is designed to work with any frontend framework. Complete frontend documentation is provided:

### **Available Documentation**
- ?? [**Complete Frontend Developer Guide**](ServerSide/My%20Online%20Store/Docs/FRONTEND_DEVELOPER_GUIDE.md) - 100+ pages
- ? [**API Quick Reference**](ServerSide/My%20Online%20Store/Docs/FRONTEND_API_QUICK_REFERENCE.md) - Bookmark this!
- ? [**Implementation Checklist**](ServerSide/My%20Online%20Store/Docs/FRONTEND_IMPLEMENTATION_CHECKLIST.md) - Step-by-step
- ?? [**Code Templates**](ServerSide/My%20Online%20Store/Docs/FRONTEND_CODE_TEMPLATES.md) - Ready-to-use code
- ??? [**Documentation Index**](ServerSide/My%20Online%20Store/Docs/FRONTEND_DOCUMENTATION_INDEX.md) - Navigation guide

### **Recommended Frontend Stack**
- **React 18+** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls

### **Example: Fetch Products**

```javascript
// JavaScript/TypeScript
const response = await fetch('https://api.yourstore.com/api/products');
const products = await response.json();

// Each product includes:
// - productID, productName, description, price, quantityInStock
// - category: { categoryID, categoryName }
// - images: [{ imageID, imageURL, productID, imageOrder }]
```

---

## ?? Testing

### **Run Tests**
```bash
dotnet test
```

### **Manual Testing with Swagger**
1. Run the application
2. Navigate to `https://localhost:5001/swagger`
3. Test endpoints interactively
4. Copy cURL commands for integration

### **Postman Collection**
A Postman collection is available in `Docs/` for easy API testing.

---

## ?? Contributing

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

## ?? License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ????? Author

**Yazen Al-Obeidat**

- GitHub: [@YazenJO](https://github.com/YazenJO)
- Repository: [Online-Store](https://github.com/YazenJO/Online-Store)

---

## ?? Acknowledgments

- Built with [ASP.NET Core 9](https://dotnet.microsoft.com/)
- Authentication powered by [JWT](https://jwt.io/)
- Password hashing using [BCrypt.Net](https://github.com/BcryptNet/bcrypt.net)
- Inspired by modern e-commerce platforms

---

## ?? Project Status

? **Completed Features:**
- Complete REST API implementation
- JWT authentication & authorization
- Password hashing with BCrypt
- Complete order management system
- Product catalog with images
- Review system
- Comprehensive documentation

?? **Planned Features:**
- Unit tests
- Integration tests
- Docker support
- CI/CD pipeline
- Email notifications
- Admin dashboard frontend
- Customer frontend application

---

## ?? Support

If you have any questions or need help:

1. Check the [Documentation](ServerSide/My%20Online%20Store/Docs/)
2. Open an [Issue](https://github.com/YazenJO/Online-Store/issues)
3. Contact via [GitHub](https://github.com/YazenJO)

---

## ? Star This Repository

If you find this project useful, please give it a star! ?

---

<div align="center">

**Made with ?? using ASP.NET Core 9**

[? Back to Top](#-online-store-api)

</div>
