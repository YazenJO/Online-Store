# ?? Order Status - Quick Reference

## ?? Status Values

| Value | Name | When |
|-------|------|------|
| **1** | Pending | Order created (default) |
| **2** | Processing | Being prepared |
| **3** | Shipped | Sent to customer |
| **4** | Delivered | Customer received |
| **5** | Cancelled | Order cancelled |
| **6** | Completed | Successfully done |

---

## ?? Quick Code Examples

### **Check Status:**
```csharp
// Numeric check
if (order.Status == 1) { }

// Enum check (better!)
if (order.OrderStatusEnum == OrderStatus.Pending) { }

// Text display
Console.WriteLine(order.StatusText);  // "Pending"
```

### **Create Order:**
```csharp
var order = new OrderDTO(
    null,               // OrderID
    customerId,         // CustomerID
    DateTime.UtcNow,    // OrderDate
    totalAmount,        // TotalAmount
    1                   // Status (Pending)
);
```

### **Update Status:**
```csharp
order.Status = 2;  // Processing
order.Save();

// Or using enum
order.Status = (short)OrderStatus.Processing;
order.Save();
```

---

## ?? Status Flow

```
1. Pending ? 2. Processing ? 3. Shipped ? 4. Delivered ? 6. Completed
   ?
5. Cancelled (if cancelled early)
```

---

## ?? Display Colors

```
Pending    = Yellow
Processing = Blue
Shipped    = Purple
Delivered  = Green
Cancelled  = Red
Completed  = Cyan
```

---

## ? What's New

**Before:**
```csharp
public short? Status { get; set; }  // No documentation
```

**After:**
```csharp
/// <summary>
/// Current status of the order
/// Values: 1=Pending, 2=Processing, 3=Shipped, 4=Delivered, 5=Cancelled, 6=Completed
/// </summary>
public short? Status { get; set; }

public string StatusText { get; }              // "Pending"
public OrderStatus OrderStatusEnum { get; }    // OrderStatus.Pending
```

---

## ?? Usage in API

**Request:**
```json
POST /api/Orders/complete
{
  "orderStatus": 1  // Optional, defaults to 1
}
```

**Response:**
```json
{
  "order": {
    "status": 1,
    "statusText": "Pending"
  }
}
```

---

**Status is now fully documented! ??**
