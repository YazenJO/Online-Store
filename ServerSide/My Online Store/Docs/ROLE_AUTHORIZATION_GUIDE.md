# Role-Based Authorization Implementation Guide

## Overview
This guide explains how to implement and use role-based authorization in your Online Store API.

## ?? What Was Implemented

### 1. **Database Changes**
- Added `Role` column to `Customers` table (NVARCHAR(20), default: 'Customer')
- Updated all stored procedures to handle the Role field

### 2. **Code Changes**
- **CustomerDTO**: Added `Role` property
- **Customer (BLL)**: Added `Role` property and updated CustomerDTO mapping
- **CustomerData (DAL)**: Updated all methods to read/write Role from database
- **JwtService**: Modified to include Role claim in JWT tokens
- **AuthController**: Updated Login and Register to generate tokens with roles
- **OrderController**: Added role-based authorization attributes

---

## ?? Setup Steps

### Step 1: Run SQL Script
Execute the `ROLE_BASED_AUTHORIZATION_SETUP.sql` file on your database. This will:
- Add the Role column
- Update all stored procedures
- Create a default admin user

### Step 2: Restart Your Application
The code changes are already applied. Just restart your API application.

---

## ?? Available Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Customer** | Default role for new registrations | Can view/create their own orders only |
| **Admin** | Administrative role | Full access to all endpoints |

---

## ?? How to Use

### Test Admin Access

1. **Login as Admin**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

2. **Copy the JWT token from the response**

3. **Use Swagger Authorize Button**
   - Click the ?? **Authorize** button
   - Paste your token
   - Click **Authorize**
   - Click **Close**

4. **Test Admin-Only Endpoints**
```http
GET /api/Orders/All          ? Only Admin can access
PUT /api/Orders/{id}         ? Only Admin can access
DELETE /api/Orders/{id}      ? Only Admin can access
```

### Test Customer Access

1. **Register a New Customer**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```
> **Note**: New registrations automatically get "Customer" role

2. **Login and Get Token**

3. **Test Customer Endpoints**
```http
GET /api/auth/me              ? ? Customer can access
POST /api/Orders              ? ? Customer can create their own orders
GET /api/Orders/{id}          ? ? Customer can view their own orders only
GET /api/Orders/All           ? ? 403 Forbidden - Admin only
```

---

## ??? Authorization Rules

### OrderController Endpoints

| Endpoint | Method | Customer | Admin |
|----------|--------|----------|-------|
| `/api/Orders/All` | GET | ? | ? |
| `/api/Orders/{id}` | GET | ? (own orders only) | ? (all orders) |
| `/api/Orders` | POST | ? (for themselves only) | ? |
| `/api/Orders/{id}` | PUT | ? | ? |
| `/api/Orders/{id}` | DELETE | ? | ? |
| `/api/Orders/Exists/{id}` | GET | ? | ? |

---

## ?? How Role-Based Authorization Works

### 1. **Registration**
When a user registers, they automatically get the "Customer" role:
```csharp
var newCustomer = new Customer(new CustomerDTO(
    // ...other fields
    "Customer"  // Default role
));
```

### 2. **Login**
When a user logs in, the JWT token includes their role:
```csharp
var token = _jwtService.GenerateToken(
    customer.CustomerID.Value, 
    customer.Username, 
    customer.Role  // Role is embedded in the token
);
```

### 3. **Authorization**
The API checks roles using attributes:

```csharp
[Authorize(Roles = "Admin")]  // Only admins
public ActionResult GetAllOrders() { ... }

[Authorize]  // Any authenticated user
public ActionResult GetOrderById(int id) 
{
    // Additional check for ownership
    var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
    if (userRole != "Admin" && order.CustomerID != currentUserId)
    {
        return Forbid();  // User can only view their own orders
    }
    // ...
}
```

---

## ?? How to Add Authorization to Other Controllers

### Example: Protect Product Management

```csharp
[ApiController]
[Route("api/Products")]
public class ProductsController : ControllerBase
{
    // Anyone can view products
    [HttpGet]
    public ActionResult<IEnumerable<ProductDTO>> GetAllProducts() { ... }

    // Only Admin can create products
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public ActionResult<ProductDTO> AddProduct(...) { ... }

    // Only Admin can update products
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public ActionResult<ProductDTO> UpdateProduct(...) { ... }

    // Only Admin can delete products
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public ActionResult DeleteProduct(int id) { ... }
}
```

---

## ?? Testing Scenarios

### Scenario 1: Customer tries to view all orders
**Request:**
```http
GET /api/Orders/All
Authorization: Bearer <customer-jwt-token>
```
**Response:** `403 Forbidden`

### Scenario 2: Customer views their own order
**Request:**
```http
GET /api/Orders/5
Authorization: Bearer <customer-jwt-token>
```
**Response:** `200 OK` (if order belongs to them) or `403 Forbidden` (if not)

### Scenario 3: Admin views all orders
**Request:**
```http
GET /api/Orders/All
Authorization: Bearer <admin-jwt-token>
```
**Response:** `200 OK` with all orders

---

## ?? Security Best Practices

1. **Never store plain text passwords** - Consider implementing password hashing (BCrypt, Argon2)
2. **Use HTTPS in production** - Prevents token interception
3. **Set reasonable token expiration** - Currently set to 7 days, consider shorter for production
4. **Validate user input** - Always validate and sanitize user data
5. **Log authorization failures** - Monitor for suspicious activity

---

## ?? Troubleshooting

### Issue: 401 Unauthorized
**Cause:** Token is missing or invalid
**Solution:** 
- Make sure you're sending `Authorization: Bearer <token>` header
- Check if token has expired (7 days)
- Re-login to get a fresh token

### Issue: 403 Forbidden
**Cause:** User doesn't have required role
**Solution:**
- Check user's role in database
- Admin endpoints require "Admin" role
- Some endpoints check ownership (e.g., viewing orders)

### Issue: Can't see Authorize button in Swagger
**Cause:** Swagger not configured for JWT
**Solution:** The `Program.cs` has been updated with JWT configuration. Restart your application.

---

## ?? How to Create More Admins

### Option 1: Update Existing User (SQL)
```sql
UPDATE Customers
SET Role = 'Admin'
WHERE Username = 'username-here';
```

### Option 2: Register and Promote
1. Register a new user normally
2. Run SQL to promote them:
```sql
UPDATE Customers
SET Role = 'Admin'
WHERE CustomerID = <their-id>;
```

---

## ?? Understanding JWT Claims

When you decode the JWT token, you'll see:
```json
{
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "6",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "zozo",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Customer",
  "jti": "6637f17d-729d-41c8-b231-ec81a8fe0abc",
  "exp": 1761582357,
  "iss": "OnlineStoreAPI",
  "aud": "OnlineStoreClient"
}
```

The role claim is automatically checked by `[Authorize(Roles = "Admin")]` attribute.

---

## ?? Summary

You now have a fully functional role-based authorization system! 

- ? Database updated with Role column
- ? All code files updated
- ? JWT tokens include role information
- ? OrderController protected with role-based rules
- ? Swagger UI supports JWT authentication
- ? Default admin user created

**Next Steps:**
1. Run the SQL script
2. Restart your application
3. Test with Swagger UI
4. Apply similar authorization to other controllers as needed

Happy coding! ??
