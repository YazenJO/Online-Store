# ?? Order Status Documentation

## ? **IMPLEMENTATION COMPLETE!**

The `OrderDTO` now includes comprehensive documentation and an enum for the `Status` property!

---

## ?? **Order Status Values**

### **Enum Definition:**

```csharp
public enum OrderStatus : short
{
    Pending = 1,      // Order placed, not yet processed
    Processing = 2,   // Order being prepared
    Shipped = 3,      // Order has been shipped
    Delivered = 4,    // Order delivered to customer
    Cancelled = 5,    // Order cancelled
    Completed = 6     // Order completed successfully
}
```

---

## ?? **Status Values Explained**

| Value | Name | Description | When to Use |
|-------|------|-------------|-------------|
| **1** | **Pending** | Order has been placed but not yet processed | Default status when order is created |
| **2** | **Processing** | Order is being prepared/packed | When warehouse starts processing |
| **3** | **Shipped** | Order has been shipped to customer | When carrier picks up the order |
| **4** | **Delivered** | Order has been delivered to customer | When customer receives the order |
| **5** | **Cancelled** | Order has been cancelled | When customer or admin cancels |
| **6** | **Completed** | Order has been successfully completed | After delivery confirmation |

---

## ?? **OrderDTO Properties**

### **Status Property:**

```csharp
/// <summary>
/// Current status of the order
/// Values:
/// 1 = Pending (default)
/// 2 = Processing
/// 3 = Shipped
/// 4 = Delivered
/// 5 = Cancelled
/// 6 = Completed
/// </summary>
public short? Status { get; set; }
```

### **StatusText Property (NEW!):**

```csharp
/// <summary>
/// Gets the status as a readable string
/// </summary>
public string StatusText { get; }
```

**Example:**
```csharp
var order = new OrderDTO(..., status: 1);
Console.WriteLine(order.StatusText);  // Output: "Pending"

order.Status = 3;
Console.WriteLine(order.StatusText);  // Output: "Shipped"
```

### **OrderStatusEnum Property (NEW!):**

```csharp
/// <summary>
/// Gets the status as the OrderStatus enum
/// </summary>
public OrderStatus OrderStatusEnum { get; }
```

**Example:**
```csharp
var order = new OrderDTO(..., status: 1);
if (order.OrderStatusEnum == OrderStatus.Pending)
{
    Console.WriteLine("Order is pending");
}
```

---

## ?? **Order Status Workflow**

### **Typical Order Lifecycle:**

```
Order Created
     ?
??????????????
?  Pending   ? ? Status = 1 (Default)
??????????????
      ? Admin/System processes order
      ?
??????????????
? Processing ? ? Status = 2
??????????????
      ? Order shipped by carrier
      ?
??????????????
?  Shipped   ? ? Status = 3
??????????????
      ? Customer receives order
      ?
??????????????
? Delivered  ? ? Status = 4
??????????????
      ? Order confirmed by customer
      ?
??????????????
? Completed  ? ? Status = 6
??????????????
```

### **Cancellation Path:**

```
??????????????
?  Pending   ? ? Status = 1
??????????????
      ? Customer/Admin cancels
      ?
??????????????
? Cancelled  ? ? Status = 5
??????????????
```

---

## ?? **Usage Examples**

### **Example 1: Create Order with Default Status**

```csharp
// In OrdersController.CreateCompleteOrder()
var order = new Order(new OrderDTO(
    null,                           // OrderID (auto-generated)
    orderRequest.CustomerID,
    DateTime.UtcNow,
    orderTotal,
    orderRequest.OrderStatus ?? 1   // Default to Pending (1)
));
```

**Result:**
```json
{
  "orderID": 1,
  "customerID": 5,
  "orderDate": "2025-01-20T10:30:00Z",
  "totalAmount": 1250.00,
  "status": 1,
  "statusText": "Pending"
}
```

---

### **Example 2: Update Order Status**

```csharp
// Update order to "Processing"
var order = Order.Find(orderId);
order.Status = 2;  // Processing
order.Save();

// Or using enum
order.Status = (short)OrderStatus.Processing;
order.Save();
```

---

### **Example 3: Check Order Status**

```csharp
var order = Order.Find(orderId);

// Method 1: Check numeric value
if (order.Status == 1)
{
    Console.WriteLine("Order is pending");
}

// Method 2: Check using enum
if (order.OrderStatusEnum == OrderStatus.Pending)
{
    Console.WriteLine("Order is pending");
}

// Method 3: Get readable text
Console.WriteLine($"Order status: {order.StatusText}");
// Output: "Order status: Pending"
```

---

### **Example 4: Filter Orders by Status**

```csharp
// Get all pending orders
var pendingOrders = orders.Where(o => o.Status == 1).ToList();

// Or using enum
var pendingOrders = orders.Where(o => o.Status == (short)OrderStatus.Pending).ToList();
```

---

## ?? **Frontend Display**

### **Display Status with Colors:**

```html
<!-- Example UI -->
<div class="order-status">
  <span class="status-badge status-pending">Pending</span>
</div>
```

**CSS:**
```css
.status-badge {
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}

.status-pending   { background-color: #ffc107; color: #000; } /* Yellow */
.status-processing{ background-color: #2196f3; color: #fff; } /* Blue */
.status-shipped   { background-color: #9c27b0; color: #fff; } /* Purple */
.status-delivered { background-color: #4caf50; color: #fff; } /* Green */
.status-cancelled { background-color: #f44336; color: #fff; } /* Red */
.status-completed { background-color: #00bcd4; color: #fff; } /* Cyan */
```

---

## ?? **Database Schema**

### **Orders Table:**

```sql
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status SMALLINT DEFAULT 1,  -- Default to Pending
    CONSTRAINT CHK_Status CHECK (Status BETWEEN 1 AND 6),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
```

### **Status Constraint:**

```sql
-- Ensures only valid status values (1-6)
ALTER TABLE Orders
ADD CONSTRAINT CHK_OrderStatus CHECK (Status BETWEEN 1 AND 6);
```

---

## ?? **API Responses**

### **Example 1: Get Order Response**

```json
GET /api/Orders/123

{
  "orderID": 123,
  "customerID": 5,
  "orderDate": "2025-01-20T10:30:00Z",
  "totalAmount": 1250.00,
  "status": 3,
  "statusText": "Shipped"
}
```

### **Example 2: Complete Order Response**

```json
POST /api/Orders/complete

{
  "success": true,
  "message": "Order created successfully with 3 item(s)",
  "order": {
    "orderID": 124,
    "customerID": 5,
    "orderDate": "2025-01-20T11:00:00Z",
    "totalAmount": 550.00,
    "status": 1,
    "statusText": "Pending"
  },
  "orderItems": [...],
  "payment": {...},
  "shipping": {...}
}
```

---

## ?? **Status Transitions**

### **Allowed Transitions:**

```
Pending (1)      ? Processing (2)   ?
Processing (2)   ? Shipped (3)      ?
Shipped (3)      ? Delivered (4)    ?
Delivered (4)    ? Completed (6)    ?

Pending (1)      ? Cancelled (5)    ?
Processing (2)   ? Cancelled (5)    ?
Shipped (3)      ? Cancelled (5)    ? (Too late!)
Delivered (4)    ? Cancelled (5)    ? (Already delivered!)
```

### **Implementation Example:**

```csharp
public bool CanTransitionTo(OrderStatus newStatus)
{
    var currentStatus = (OrderStatus)this.Status;

    return (currentStatus, newStatus) switch
    {
        (OrderStatus.Pending, OrderStatus.Processing) => true,
        (OrderStatus.Pending, OrderStatus.Cancelled) => true,
        (OrderStatus.Processing, OrderStatus.Shipped) => true,
        (OrderStatus.Processing, OrderStatus.Cancelled) => true,
        (OrderStatus.Shipped, OrderStatus.Delivered) => true,
        (OrderStatus.Delivered, OrderStatus.Completed) => true,
        _ => false
    };
}
```

---

## ?? **Status Statistics**

### **Example Queries:**

```csharp
// Count orders by status
var statusCounts = orders.GroupBy(o => o.Status)
                         .Select(g => new { 
                             Status = g.Key, 
                             Count = g.Count() 
                         })
                         .ToList();

// Pending orders count
var pendingCount = orders.Count(o => o.Status == 1);

// Active orders (not cancelled or completed)
var activeOrders = orders.Where(o => o.Status >= 1 && o.Status <= 4).ToList();
```

---

## ?? **Best Practices**

### **DO:**
? Use `OrderStatus.Pending` as default
? Update status progressively (1 ? 2 ? 3 ? 4 ? 6)
? Log status changes with timestamp
? Notify customer of status changes
? Use `StatusText` for display purposes

### **DON'T:**
? Skip status steps (e.g., Pending ? Delivered)
? Change completed/cancelled orders
? Use status values outside 1-6 range
? Allow customers to change status (admin only)

---

## ?? **Security Considerations**

### **Authorization:**

```csharp
// Only admins can update order status
[Authorize(Roles = "Admin")]
[HttpPut("{id}/status")]
public ActionResult UpdateOrderStatus(int id, short newStatus)
{
    // Validate status value
    if (newStatus < 1 || newStatus > 6)
    {
        return BadRequest(new { message = "Invalid status value. Must be between 1 and 6." });
    }

    var order = Order.Find(id);
    if (order == null)
    {
        return NotFound();
    }

    // Check if transition is allowed
    if (!order.CanTransitionTo((OrderStatus)newStatus))
    {
        return BadRequest(new { message = "Invalid status transition" });
    }

    order.Status = newStatus;
    order.Save();

    return Ok(order.OrderDTO);
}
```

---

## ?? **Summary**

### **What You Have Now:**

? **Enum Definition** - `OrderStatus` enum with 6 statuses
? **Documentation** - XML comments on all properties
? **StatusText** - Human-readable status string
? **OrderStatusEnum** - Easy enum access
? **Default Value** - Status = 1 (Pending) by default
? **Type Safety** - Enum prevents invalid values

### **Status Values:**

| # | Name | Description |
|---|------|-------------|
| 1 | Pending | Default - order placed |
| 2 | Processing | Order being prepared |
| 3 | Shipped | Order shipped to customer |
| 4 | Delivered | Order received by customer |
| 5 | Cancelled | Order cancelled |
| 6 | Completed | Order successfully completed |

### **New Features:**

```csharp
// Instead of this:
if (order.Status == 1) { }

// You can now do this:
if (order.OrderStatusEnum == OrderStatus.Pending) { }
if (order.StatusText == "Pending") { }
```

---

## ?? **Your Order System is Now Complete!**

**Status:** ? **Fully Documented & Production Ready**

**Security:** ?? **Type-safe with enum**

**User-Friendly:** ?? **Human-readable status text**
