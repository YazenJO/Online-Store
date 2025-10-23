# GetOrdersByCustomerID - Implementation Guide

## ? What Was Implemented

### 1. **BLL Layer (Order.cs)**
Added a new static method to retrieve orders for a specific customer:

```csharp
public static DataTable GetOrdersByCustomerID(int customerID)
    => OrderData.GetOrdersByCustomerID(customerID);
```

### 2. **API Layer (OrderController.cs)**
Added a new endpoint with proper authorization:

```csharp
[Authorize]
[HttpGet("customer/{customerId}", Name = "GetOrdersByCustomerID")]
public ActionResult<IEnumerable<OrderDTO>> GetOrdersByCustomerID(int customerId)
```

---

## ?? Authorization Rules

| User Role | Access |
|-----------|---------|
| **Customer** | ? Can view their own orders only |
| **Admin** | ? Can view any customer's orders |
| **Unauthenticated** | ? Access denied (401 Unauthorized) |

---

## ?? Endpoint Details

### Request
```
GET /api/Orders/customer/{customerId}
Authorization: Bearer <jwt-token>
```

### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `customerId` | int | Path | Yes | The ID of the customer whose orders to retrieve |

### Response Codes
| Status Code | Description |
|-------------|-------------|
| 200 OK | Orders retrieved successfully |
| 400 Bad Request | Invalid customer ID |
| 401 Unauthorized | No authentication token provided |
| 403 Forbidden | User trying to access another customer's orders |
| 404 Not Found | (Not used - returns empty array instead) |

---

## ?? Testing Examples

### Test Case 1: Customer Views Their Own Orders

**Login as Customer:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "customer": {
    "customerID": 5,
    "name": "John Doe",
    "username": "johndoe",
    "role": "Customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Get Orders (Authorized):**
```http
GET /api/Orders/customer/5
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
[
  {
    "orderID": 1,
    "customerID": 5,
    "orderDate": "2025-01-15T10:30:00",
    "totalAmount": 299.99,
    "status": 1
  },
  {
    "orderID": 3,
    "customerID": 5,
    "orderDate": "2025-01-20T14:20:00",
    "totalAmount": 150.50,
    "status": 2
  }
]
```

---

### Test Case 2: Customer Tries to View Another Customer's Orders

**Request:**
```http
GET /api/Orders/customer/10
Authorization: Bearer <customer-token-for-id-5>
```

**Response (403 Forbidden):**
```
(Empty response with 403 status code)
```

---

### Test Case 3: Admin Views Any Customer's Orders

**Login as Admin:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Get Any Customer's Orders:**
```http
GET /api/Orders/customer/10
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
[
  {
    "orderID": 15,
    "customerID": 10,
    "orderDate": "2025-01-18T09:15:00",
    "totalAmount": 599.99,
    "status": 1
  }
]
```

---

### Test Case 4: Customer Has No Orders

**Request:**
```http
GET /api/Orders/customer/5
Authorization: Bearer <valid-customer-token>
```

**Response (200 OK):**
```json
[]
```

**Note:** Returns an empty array, not a 404 error.

---

### Test Case 5: Invalid Customer ID

**Request:**
```http
GET /api/Orders/customer/0
Authorization: Bearer <valid-token>
```

**Response (400 Bad Request):**
```json
{
  "message": "Invalid customer ID 0"
}
```

---

### Test Case 6: No Authentication Token

**Request:**
```http
GET /api/Orders/customer/5
```

**Response (401 Unauthorized):**
```
(Empty response with 401 status code)
```

---

## ?? Integration with Frontend

### React/JavaScript Example

```javascript
// Get customer's own orders
async function getMyOrders(customerId, token) {
    const response = await fetch(
        `http://localhost:5000/api/Orders/customer/${customerId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (response.status === 403) {
        throw new Error('You can only view your own orders');
    }

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    return await response.json();
}

// Usage
try {
    const orders = await getMyOrders(currentUser.customerID, authToken);
    console.log('My orders:', orders);
} catch (error) {
    console.error('Error:', error.message);
}
```

### Angular Example

```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class OrderService {
    private apiUrl = 'http://localhost:5000/api/Orders';

    constructor(private http: HttpClient) {}

    getCustomerOrders(customerId: number, token: string): Observable<OrderDTO[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<OrderDTO[]>(
            `${this.apiUrl}/customer/${customerId}`,
            { headers }
        );
    }
}
```

---

## ?? Use Cases

### For Customers:
1. **Order History**: View all their past and current orders
2. **Track Orders**: Check status of orders in progress
3. **Reorder**: View previous orders to reorder items

### For Admins:
1. **Customer Support**: View a customer's order history when helping them
2. **Order Management**: Review all orders for a specific customer
3. **Reporting**: Generate reports for specific customers

---

## ?? Database Query Behind the Scenes

The endpoint uses the stored procedure `SP_GetOrdersByCustomerID`:

```sql
-- This is what happens in the database
EXEC SP_GetOrdersByCustomerID @CustomerID = 5
```

**Returns:**
```
OrderID | CustomerID | OrderDate           | TotalAmount | Status
--------|------------|---------------------|-------------|-------
1       | 5          | 2025-01-15 10:30:00 | 299.99      | 1
3       | 5          | 2025-01-20 14:20:00 | 150.50      | 2
```

---

## ??? Security Features

? **Authentication Required** - Must be logged in to access
? **Ownership Validation** - Customers can only access their own data
? **Admin Override** - Admins can access any customer's orders
? **Input Validation** - Customer ID must be valid
? **JWT Token Validation** - Token must be valid and not expired

---

## ?? Related Endpoints

| Endpoint | Purpose | Authorization |
|----------|---------|---------------|
| `GET /api/Orders/All` | Get all orders | Admin only |
| `GET /api/Orders/{id}` | Get single order | Owner or Admin |
| `GET /api/Orders/customer/{customerId}` | Get customer's orders | Owner or Admin |
| `POST /api/Orders` | Create new order | Authenticated |

---

## ?? Troubleshooting

### Issue: Getting 403 Forbidden
**Cause:** Trying to access another customer's orders
**Solution:** Make sure the customerId in the URL matches your logged-in customer ID

### Issue: Getting 401 Unauthorized
**Cause:** Not sending the authentication token
**Solution:** Include the `Authorization: Bearer <token>` header

### Issue: Getting empty array but expected orders
**Cause:** Customer has no orders OR wrong customer ID
**Solution:** 
1. Verify the customer ID is correct
2. Check if orders exist in the database for that customer
3. Ensure you're logged in as the correct user

---

## ? Summary

- **BLL Method Added**: `Order.GetOrdersByCustomerID(int customerID)`
- **API Endpoint**: `GET /api/Orders/customer/{customerId}`
- **Authorization**: Customer (own orders) + Admin (all orders)
- **Returns**: Array of OrderDTO objects
- **Build Status**: ? Successful

**The implementation is complete and ready to use!** ??
