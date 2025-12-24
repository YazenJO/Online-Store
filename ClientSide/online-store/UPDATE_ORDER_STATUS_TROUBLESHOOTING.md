# Update Order Status Troubleshooting Guide

## Problem
The "Update Order Status" feature on admin dashboard at `http://localhost:5173/admin/orders` is not working when trying to update order status via PUT request to `https://localhost:7248/api/Orders/{id}`.

## Potential Issues & Solutions

### 1. **API Endpoint Mismatch**

**Issue:** The frontend code currently sends:
```
PUT /api/orders/{id}/status
Body: { "status": 2 }
```

But based on your description, the backend might expect:
```
PUT /api/Orders/{id}
Body: { full order object }
```

**Check:**
- Verify what endpoint your backend actually uses
- Check if backend expects partial update (status only) or full order object

**Solution A - If backend expects full order object:**
Update `src/services/adminService.ts`:

```typescript
updateOrderStatus: async (orderId: number, status: number): Promise<Order> => {
  // First, get the current order
  const currentOrder = await apiClient.get(`/orders/${orderId}`);
  
  // Then update it with new status
  const response = await apiClient.put(`/orders/${orderId}`, {
    ...currentOrder.data,
    status: status
  });
  return response.data;
}
```

**Solution B - If backend uses different endpoint:**
Update the endpoint path in `adminService.ts` to match your backend exactly (check capitalization: `/Orders` vs `/orders`).

---

### 2. **CORS (Cross-Origin Resource Sharing) Issues**

**Issue:** Backend may not allow PUT requests from `localhost:5173`

**How to check:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try updating order status
4. Look for error messages like:
   - "CORS policy: No 'Access-Control-Allow-Origin' header"
   - "Method PUT is not allowed by Access-Control-Allow-Methods"

**Backend Fix (ASP.NET Core):**
In your backend `Program.cs` or `Startup.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyMethod()  // Allows GET, POST, PUT, DELETE, etc.
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ...

app.UseCors("AllowFrontend");
```

---

### 3. **SSL/HTTPS Certificate Issues**

**Issue:** Browser blocking HTTPS requests to `localhost:7248` due to self-signed certificate

**How to check:**
- Network tab shows "ERR_CERT_AUTHORITY_INVALID" or similar
- Request is cancelled/blocked before reaching server

**Solutions:**
1. **Accept the certificate in browser** (temporary):
   - Navigate directly to `https://localhost:7248/api/orders`
   - Click "Advanced" → "Proceed to localhost (unsafe)"

2. **Use HTTP instead** (for development):
   Update `.env` or `vite.config.ts`:
   ```env
   VITE_API_BASE_URL=http://localhost:5248/api
   ```

3. **Trust the dev certificate** (recommended):
   ```bash
   dotnet dev-certs https --trust
   ```

---

### 4. **Authentication/Authorization Issues**

**Issue:** JWT token missing, expired, or lacking admin permissions

**How to check:**
- Network tab shows 401 (Unauthorized) or 403 (Forbidden)
- Check Application → Local Storage for `authToken`

**Solution:**
1. Verify token is being sent in request headers:
   ```typescript
   // In api.ts - this is already implemented
   config.headers.Authorization = `Bearer ${token}`;
   ```

2. Check token hasn't expired
3. Verify user has admin role:
   ```typescript
   // Decode JWT token to check role
   const tokenPayload = JSON.parse(atob(token.split('.')[1]));
   console.log('User role:', tokenPayload.role);
   ```

---

### 5. **Request Payload Validation Issues**

**Issue:** Backend validation rejects the request payload

**How to check:**
- Network tab shows 400 (Bad Request)
- Response body contains validation errors

**Common validation issues:**
- **Date format:** Backend expects ISO 8601 format
- **Status enum:** Backend expects different status values
- **Required fields:** Missing required fields in payload

**Solution - Match backend DTO exactly:**

Check what your backend expects. If it expects the full order:

```typescript
// Example payload that matches your description
{
  "orderID": 1,
  "customerID": 5,
  "orderDate": "2025-01-20T10:30:00Z",  // ISO 8601 format
  "totalAmount": 1599.98,
  "status": 2  // Make sure this matches backend enum value
}
```

---

### 6. **Status Enum Value Mismatch**

**Issue:** Frontend status enum values don't match backend

**Frontend enum (current):**
```typescript
export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Completed = 6,
}
```

**Check:** Verify these match your backend enum exactly.

**Backend might use:**
- Different values (0-based vs 1-based)
- Different names
- String values instead of integers

---

### 7. **Network Request Headers**

**Issue:** Missing or incorrect Content-Type header

**Check in DevTools Network tab:**
- Request Headers should include: `Content-Type: application/json`
- This is already set in `api.ts` but verify it's not being overridden

---

## Step-by-Step Debugging Process

### Step 1: Open Browser DevTools
1. Press F12 to open DevTools
2. Go to **Network** tab
3. Keep it open while testing

### Step 2: Attempt Status Update
1. Navigate to admin order details page
2. Try to update order status
3. Watch for the PUT request in Network tab

### Step 3: Inspect the Request
Click on the PUT request and check:
- **Request URL:** Is it correct?
- **Request Method:** Should be PUT
- **Status Code:** 
  - 200/204: Success
  - 400: Bad Request (validation error)
  - 401: Unauthorized (auth issue)
  - 403: Forbidden (permission issue)
  - 404: Not Found (wrong endpoint)
  - 500: Server error (backend crash)
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Payload:** Does it match what backend expects?
- **Response:** What error message does backend return?

### Step 4: Check Console
Look for error messages in the **Console** tab:
- CORS errors
- Network errors
- JavaScript errors

### Step 5: Test Backend Directly
Use a tool like Postman or curl to test the endpoint directly:

```bash
# Test with curl
curl -X PUT https://localhost:7248/api/Orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "orderID": 1,
    "customerID": 5,
    "orderDate": "2025-01-20T10:30:00Z",
    "totalAmount": 1599.98,
    "status": 2
  }'
```

This helps determine if the issue is frontend or backend.

---

## Quick Fixes to Try

### Fix 1: Update adminService to send full order
If backend expects full order object, see the implementation below.

### Fix 2: Change to HTTP instead of HTTPS
Update `src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5248/api';
```

### Fix 3: Add error logging
Update `adminService.ts` to log detailed errors:
```typescript
updateOrderStatus: async (orderId: number, status: number): Promise<Order> => {
  try {
    console.log('Updating order:', { orderId, status });
    const response = await apiClient.put(`/orders/${orderId}/status`, { status });
    console.log('Update successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
}
```

---

## What Information to Gather

To help solve this, please provide:

1. **Error message from browser console**
2. **Network request details:**
   - Request URL
   - Status code
   - Response body
3. **Backend endpoint definition** (C# controller code)
4. **Backend DTO/model for Order**
5. **CORS configuration on backend**

---

## Next Steps

1. Follow the debugging process above
2. Identify which issue you're facing
3. Apply the corresponding fix
4. Test the solution

If you share the specific error message, I can provide a more targeted solution!
