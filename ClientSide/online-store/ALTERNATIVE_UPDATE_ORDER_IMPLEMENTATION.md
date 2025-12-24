# Alternative Implementation: Full Order Update

If your backend expects `PUT /api/Orders/{id}` with the **full order object** (as shown in your example payload), here's how to modify the code:

## Option 1: Update adminService.ts to send full order

Replace the `updateOrderStatus` method in `src/services/adminService.ts`:

```typescript
/**
 * Update order status (Admin only)
 * Fetches current order and updates with new status
 */
updateOrderStatus: async (orderId: number, status: number): Promise<Order> => {
  try {
    // First, get the current order to preserve all fields
    const currentOrderResponse = await apiClient.get(`/orders/${orderId}`);
    const currentOrder = currentOrderResponse.data;
    
    // Update the order with new status
    const updatedOrder = {
      orderID: currentOrder.orderID,
      customerID: currentOrder.customerID,
      orderDate: currentOrder.orderDate,
      totalAmount: currentOrder.totalAmount,
      status: status
    };
    
    const response = await apiClient.put(`/Orders/${orderId}`, updatedOrder);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update order status:', {
      orderId,
      status,
      error: error.response?.data || error.message
    });
    throw error;
  }
},
```

**Note the capital 'O' in `/Orders/`** - this matches your example endpoint.

## Option 2: Create a separate method for full order updates

Keep the existing method and add a new one:

```typescript
/**
 * Update order status (Admin only) - Simple status update
 */
updateOrderStatus: async (orderId: number, status: number): Promise<Order> => {
  const response = await apiClient.put(`/orders/${orderId}/status`, { status });
  return response.data;
},

/**
 * Update complete order (Admin only) - Full order update
 */
updateOrder: async (orderId: number, orderData: Partial<Order>): Promise<Order> => {
  const response = await apiClient.put(`/Orders/${orderId}`, orderData);
  return response.data;
},

/**
 * Update order status by sending full order object (Admin only)
 */
updateOrderStatusFull: async (orderId: number, status: number): Promise<Order> => {
  try {
    // Get current order
    const currentOrderResponse = await apiClient.get(`/orders/${orderId}`);
    const currentOrder = currentOrderResponse.data;
    
    // Send full order with updated status
    const response = await apiClient.put(`/Orders/${orderId}`, {
      ...currentOrder,
      status: status
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Failed to update order:', error);
    throw error;
  }
},
```

Then update `AdminOrderDetailsPage.tsx`:

```typescript
const handleUpdateOrderStatus = async () => {
  if (!order) return;
  try {
    setUpdating(true);
    // Use the full update method instead
    await adminService.updateOrderStatusFull(order.orderID, newStatus);
    setOrder({ ...order, status: newStatus });
    setEditingStatus(false);
    alert('Order status updated successfully!');
  } catch (error) {
    console.error('Error updating order status:', error);
    alert('Failed to update order status');
  } finally {
    setUpdating(false);
  }
};
```

## Option 3: Most Robust - Try both approaches

Add fallback logic:

```typescript
/**
 * Update order status with fallback (Admin only)
 */
updateOrderStatus: async (orderId: number, status: number): Promise<Order> => {
  try {
    // Try the simple status-only endpoint first
    const response = await apiClient.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error: any) {
    // If that fails, try the full order update approach
    console.log('Status-only update failed, trying full order update...');
    
    try {
      const currentOrderResponse = await apiClient.get(`/orders/${orderId}`);
      const currentOrder = currentOrderResponse.data;
      
      const updatedOrder = {
        orderID: currentOrder.orderID,
        customerID: currentOrder.customerID,
        orderDate: currentOrder.orderDate,
        totalAmount: currentOrder.totalAmount,
        status: status
      };
      
      const response = await apiClient.put(`/Orders/${orderId}`, updatedOrder);
      return response.data;
    } catch (fullUpdateError: any) {
      console.error('Both update methods failed:', {
        statusOnlyError: error.response?.data,
        fullUpdateError: fullUpdateError.response?.data
      });
      throw fullUpdateError;
    }
  }
},
```

## Which Option to Choose?

1. **Option 1** - If you know your backend only accepts full order updates
2. **Option 2** - If you want to keep both approaches available
3. **Option 3** - If you're unsure and want automatic fallback

## Testing the Changes

After making the changes:

1. Clear browser cache (Ctrl + F5)
2. Restart dev server: `npm run dev`
3. Open DevTools Network tab
4. Try updating an order status
5. Check the request payload matches what backend expects

## Expected Request

The request should look like:

```http
PUT https://localhost:7248/api/Orders/1
Content-Type: application/json
Authorization: Bearer {your-token}

{
  "orderID": 1,
  "customerID": 5,
  "orderDate": "2025-01-20T10:30:00Z",
  "totalAmount": 1599.98,
  "status": 2
}
```

## Important Notes

- **Case sensitivity**: `/Orders/` vs `/orders/` - APIs are often case-sensitive
- **Date format**: Ensure dates are in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
- **Status values**: Verify status enum values match between frontend and backend
- **Required fields**: Make sure all required fields are included in the payload
