# ?? API Quick Reference Card

## Base URL
```
https://localhost:5001/api
```

---

## ?? Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | None | Register new user |
| `POST` | `/auth/login` | None | Login user |
| `GET` | `/auth/me` | Token | Get current user |

---

## ?? Customers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/customers` | Admin | Get all customers |
| `GET` | `/customers/{id}` | Token | Get customer |
| `POST` | `/customers` | Admin | Create customer |
| `PUT` | `/customers/{id}` | Token | Update customer |
| `DELETE` | `/customers/{id}` | Admin | Delete customer |
| `GET` | `/customers/Exists/{id}` | Token | Check exists |

---

## ?? Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/products` | None | Get all products |
| `GET` | `/products/{id}` | None | Get product |
| `POST` | `/products` | Admin | Create product |
| `PUT` | `/products/{id}` | Admin | Update product |
| `DELETE` | `/products/{id}` | Admin | Delete product |
| `GET` | `/products/Exists/{id}` | None | Check exists |

---

## ?? Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/categories` | None | Get all categories |
| `GET` | `/categories/{id}` | None | Get category |
| `POST` | `/categories` | Admin | Create category |
| `PUT` | `/categories/{id}` | Admin | Update category |
| `DELETE` | `/categories/{id}` | Admin | Delete category |

---

## ?? Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/orders/All` | Admin | Get all orders |
| `GET` | `/orders/{id}` | Token | Get order |
| `GET` | `/orders/customer/{id}` | Token | Get customer orders |
| `POST` | `/orders/complete` ? | Token | **Create complete order** |
| `POST` | `/orders` | Token | Create simple order |
| `PUT` | `/orders/{id}` | Admin | Update order |
| `DELETE` | `/orders/{id}` | Admin | Delete order |
| `GET` | `/orders/Exists/{id}` | Token | Check exists |

---

## ?? Order Items

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/orderitems/order/{orderId}` | Token | Get items by order |
| `GET` | `/orderitems/{orderId}/{productId}` | Token | Get specific item |
| `POST` | `/orderitems` | Token | Create item |
| `PUT` | `/orderitems/{orderId}/{productId}` | Token | Update item |
| `DELETE` | `/orderitems/{orderId}/{productId}` | Token | Delete item |
| `DELETE` | `/orderitems/order/{orderId}` | Token | Delete all items |

---

## ?? Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/payments` | Admin | Get all payments |
| `GET` | `/payments/{id}` | Token | Get payment |
| `GET` | `/payments/order/{orderId}` | Token | Get by order |
| `POST` | `/payments` | Token | Create payment |
| `PUT` | `/payments/{id}` | Admin | Update payment |
| `DELETE` | `/payments/{id}` | Admin | Delete payment |

---

## ?? Shipping

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/shippings` | Admin | Get all shippings |
| `GET` | `/shippings/{id}` | Token | Get shipping |
| `GET` | `/shippings/order/{orderId}` | Token | Get by order |
| `POST` | `/shippings` | Token | Create shipping |
| `PUT` | `/shippings/{id}` | Admin | Update shipping |
| `DELETE` | `/shippings/{id}` | Admin | Delete shipping |

---

## ?? Authorization

### Headers
```javascript
{
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
  'Content-Type': 'application/json'
}
```

### Roles
- **None**: Public access
- **Token**: Authenticated user
- **Admin**: Administrator only

---

## ?? Order Status

| Value | Status | Icon |
|-------|--------|------|
| 1 | Pending | ? |
| 2 | Processing | ?? |
| 3 | Shipped | ?? |
| 4 | Delivered | ? |
| 5 | Cancelled | ? |
| 6 | Completed | ?? |

---

## ?? Common Patterns

### Login & Store Token
```javascript
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { token } = await res.json();
localStorage.setItem('token', token);
```

### Fetch with Auth
```javascript
const token = localStorage.getItem('token');
const res = await fetch('/api/orders/customer/5', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const orders = await res.json();
```

### Create Order
```javascript
await fetch('/api/orders/complete', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerID: 5,
    items: [{ productID: 1, quantity: 2 }],
    paymentMethod: "CreditCard",
    shippingAddress: "123 Main St",
    carrierName: "FedEx"
  })
});
```

---

## ? Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## ?? Top 10 Endpoints

1. `POST /api/auth/login`
2. `POST /api/auth/register`
3. `GET /api/products`
4. `GET /api/products/{id}`
5. `POST /api/orders/complete` ?
6. `GET /api/orders/customer/{id}`
7. `GET /api/orderitems/order/{id}`
8. `GET /api/auth/me`
9. `GET /api/categories`
10. `PUT /api/customers/{id}`

---

**Total:** 46 Endpoints | **Public:** 6 | **Protected:** 40
