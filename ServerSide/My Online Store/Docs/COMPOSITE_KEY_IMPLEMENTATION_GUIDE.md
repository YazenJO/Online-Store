# ? OrderItems with Composite Primary Key - Implementation Guide

## ?? Key Change: Using Composite Primary Key

### **Database Structure**

```sql
CREATE TABLE OrderItems (
    OrderID INT NOT NULL,          -- Part of composite PK
    ProductID INT NOT NULL,        -- Part of composite PK
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    TotalItemsPrice DECIMAL(10, 2) NOT NULL,
    
    -- Composite Primary Key
    PRIMARY KEY (OrderID, ProductID)
);
```

### **Why Composite Key?**

? **Natural Key**: The combination of `(OrderID, ProductID)` naturally identifies each item
? **Business Logic**: One order can have each product only once (no duplicates)
? **Simpler**: No need for artificial `OrderItemID` identity column
? **Efficient**: Automatic indexing on OrderID for faster queries

---

## ?? Database Structure

```
OrderItems Table:
???????????????????????????????????????????????????????????????
? OrderID  ? ProductID ? Quantity ?  Price  ? TotalItemsPrice ?
?  (PK)    ?   (PK)    ?          ?         ?                 ?
???????????????????????????????????????????????????????????????
?   100    ?    101    ?    2     ? 500.00  ?    1000.00      ?
?   100    ?    205    ?    1     ?  25.00  ?      25.00      ?
?   101    ?    101    ?    1     ? 500.00  ?     500.00      ?
???????????????????????????????????????????????????????????????

Primary Key: (OrderID, ProductID)
```

---

## ?? What Changed

### **1. Database (SQL)**

**Before (Wrong):**
```sql
OrderItemID INT PRIMARY KEY IDENTITY(1,1),  -- ? Artificial key
OrderID INT NOT NULL,
ProductID INT NOT NULL
```

**After (Correct):**
```sql
OrderID INT NOT NULL,     -- ? Part of composite PK
ProductID INT NOT NULL,   -- ? Part of composite PK
PRIMARY KEY (OrderID, ProductID)
```

### **2. OrderItemDTO**

**Before (Wrong):**
```csharp
public class OrderItemDTO
{
    public int? OrderItemID { get; set; }  // ? Removed
    public int OrderID { get; set; }
    public int ProductID { get; set; }
    // ...
}
```

**After (Correct):**
```csharp
public class OrderItemDTO
{
    // Composite Primary Key
    public int OrderID { get; set; }      // ? PK part 1
    public int ProductID { get; set; }    // ? PK part 2
    
    // Item Details
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TotalItemsPrice { get; set; }
}
```

### **3. Data Access Layer**

**Before (Wrong):**
```csharp
public static OrderItemDTO GetOrderItemByID(int? OrderItemID)  // ?
```

**After (Correct):**
```csharp
public static OrderItemDTO GetOrderItemByID(int OrderID, int ProductID)  // ?
```

**Before (Wrong):**
```csharp
public static int AddOrderItem(OrderItemDTO dto)
{
    // Returns OrderItemID  // ?
}
```

**After (Correct):**
```csharp
public static bool AddOrderItem(OrderItemDTO dto)
{
    // Returns true/false  // ?
}
```

### **4. Business Logic Layer**

**Before (Wrong):**
```csharp
public static OrderItem Find(int? OrderItemID)  // ?
```

**After (Correct):**
```csharp
public static OrderItem Find(int OrderID, int ProductID)  // ?
```

### **5. Stored Procedures**

**Before (Wrong):**
```sql
CREATE PROCEDURE SP_AddOrderItem
    @NewOrderItemID INT OUTPUT  -- ? Returns identity
AS
    SET @NewOrderItemID = SCOPE_IDENTITY();
```

**After (Correct):**
```sql
CREATE PROCEDURE SP_AddOrderItem
    -- No OUTPUT parameter  -- ?
AS
    SELECT 1 AS Success;  -- Returns success indicator
```

---

## ?? How to Use

### **1. Create Order Item**

```csharp
var orderItem = new OrderItem(new OrderItemDTO(
    orderID: 100,
    productID: 101,
    quantity: 2,
    price: 500.00m,
    totalItemsPrice: 1000.00m
));

if (orderItem.Save())
{
    Console.WriteLine("Order item created successfully!");
    // No OrderItemID to track - use (OrderID, ProductID) instead
}
```

### **2. Find Order Item**

```csharp
// Find by composite key
var orderItem = OrderItem.Find(orderID: 100, productID: 101);

if (orderItem != null)
{
    Console.WriteLine($"Found item: Order {orderItem.OrderID}, " +
                      $"Product {orderItem.ProductID}, " +
                      $"Qty: {orderItem.Quantity}");
}
```

### **3. Check if Item Exists**

```csharp
bool exists = OrderItem.DoesOrderItemExist(orderID: 100, productID: 101);

if (exists)
{
    Console.WriteLine("This product is already in the order!");
}
```

### **4. Delete Order Item**

```csharp
bool deleted = OrderItem.DeleteOrderItem(orderID: 100, productID: 101);

if (deleted)
{
    Console.WriteLine("Order item removed from order");
}
```

### **5. Get All Items in Order**

```csharp
var items = OrderItem.GetOrderItemsByOrderID(orderID: 100);

foreach (DataRow row in items.Rows)
{
    Console.WriteLine($"Product {row["ProductID"]}: " +
                      $"{row["ProductName"]} x {row["Quantity"]}");
}
```

---

## ?? API Response Example

### **Request:**
```json
POST /api/Orders/complete
{
  "customerID": 5,
  "items": [
    {"productID": 101, "quantity": 2},
    {"productID": 205, "quantity": 1}
  ],
  "paymentMethod": "CreditCard",
  "shippingAddress": "123 Main St",
  "carrierName": "FedEx"
}
```

### **Response:**
```json
{
  "success": true,
  "message": "Order created successfully with 2 item(s)",
  "order": {
    "orderID": 100,
    "customerID": 5,
    "totalAmount": 1025.00
  },
  "orderItems": [
    {
      "orderID": 100,        // ? Part of composite PK
      "productID": 101,      // ? Part of composite PK
      "quantity": 2,
      "price": 500.00,
      "totalItemsPrice": 1000.00
    },
    {
      "orderID": 100,        // ? Part of composite PK
      "productID": 205,      // ? Part of composite PK
      "quantity": 1,
      "price": 25.00,
      "totalItemsPrice": 25.00
    }
  ],
  "payment": {
    "paymentID": 150,
    "orderID": 100,
    "amount": 1025.00
  },
  "shipping": {
    "shippingID": 75,
    "orderID": 100,
    "trackingNumber": "TRACK-20250120-456789"
  }
}
```

**Notice:** No `orderItemID` field! Items are identified by `(orderID, productID)`.

---

## ?? Business Rules

### **? Allowed:**
```
Order 100: Product 101 (Qty: 2)  ?
Order 100: Product 205 (Qty: 1)  ?
Order 101: Product 101 (Qty: 1)  ?  (Different order, same product)
```

### **? Not Allowed:**
```
Order 100: Product 101 (Qty: 2)  ?
Order 100: Product 101 (Qty: 3)  ?  (Duplicate! Same order + product)
```

**Why?** Composite primary key `(OrderID, ProductID)` enforces uniqueness.

**Solution:** If customer wants to order the same product again:
- Update the existing OrderItem quantity
- Or create a new Order

---

## ?? Database Queries

### **Query 1: Get Items in Order**
```sql
SELECT * FROM OrderItems
WHERE OrderID = 100;

-- Result:
OrderID | ProductID | Quantity | Price  | TotalItemsPrice
--------|-----------|----------|--------|----------------
100     | 101       | 2        | 500.00 | 1000.00
100     | 205       | 1        | 25.00  | 25.00
```

### **Query 2: Get Specific Item**
```sql
SELECT * FROM OrderItems
WHERE OrderID = 100 AND ProductID = 101;

-- Result:
OrderID | ProductID | Quantity | Price  | TotalItemsPrice
--------|-----------|----------|--------|----------------
100     | 101       | 2        | 500.00 | 1000.00
```

### **Query 3: Check if Product in Order**
```sql
SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM OrderItems 
        WHERE OrderID = 100 AND ProductID = 101
    ) 
    THEN 1 ELSE 0 
END AS Exists;

-- Result: 1 (true)
```

### **Query 4: Update Item Quantity**
```sql
UPDATE OrderItems
SET Quantity = 5,
    TotalItemsPrice = Price * 5
WHERE OrderID = 100 AND ProductID = 101;
```

### **Query 5: Delete Item from Order**
```sql
DELETE FROM OrderItems
WHERE OrderID = 100 AND ProductID = 101;
```

---

## ?? Advantages of Composite Key

| Aspect | Benefit |
|--------|---------|
| **Simplicity** | No artificial ID needed |
| **Clarity** | Primary key has business meaning |
| **Performance** | Automatic composite index |
| **Data Integrity** | Prevents duplicate items in same order |
| **Natural Queries** | Easy to query by OrderID or ProductID |

---

## ??? Migration from Old Structure

If you had the old structure with `OrderItemID`, here's how to migrate:

### **Step 1: Backup Data**
```sql
-- Backup existing data
SELECT * INTO OrderItems_Backup FROM OrderItems;
```

### **Step 2: Drop Old Table**
```sql
DROP TABLE OrderItems;
```

### **Step 3: Create New Table**
```sql
-- Execute: ORDERITEMS_DATABASE_SETUP.sql
```

### **Step 4: Restore Data (if needed)**
```sql
INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price, TotalItemsPrice)
SELECT OrderID, ProductID, Quantity, Price, TotalItemsPrice
FROM OrderItems_Backup;
```

---

## ? Summary

### **What We Fixed:**

? **Removed** `OrderItemID` identity column
? **Added** Composite Primary Key `(OrderID, ProductID)`
? **Updated** all stored procedures
? **Updated** OrderItemDTO
? **Updated** Data Access Layer
? **Updated** Business Logic Layer
? **Updated** API Controller

### **Build Status:** ? **SUCCESSFUL**

### **Database Changes:**
- Table structure: ? Fixed
- Primary key: ? Composite key `(OrderID, ProductID)`
- Stored procedures: ? Updated (9 procedures)

### **Code Changes:**
- OrderItemDTO: ? No more OrderItemID
- OrderItemData: ? Uses composite key
- OrderItem BLL: ? Uses composite key
- OrderController: ? Fixed constructor calls

---

## ?? Next Steps

1. **Run SQL Script:**
   ```sql
   -- Execute: ORDERITEMS_DATABASE_SETUP.sql
   ```

2. **Verify Table Structure:**
   ```sql
   -- Check primary key
   EXEC sp_help 'OrderItems'
   ```

3. **Test API:**
   ```http
   POST /api/Orders/complete
   -- Send order with multiple items
   ```

4. **Verify Response:**
   - Check OrderItems array
   - Confirm no `orderItemID` field
   - Verify `(orderID, productID)` pairs

---

**Your OrderItems table now uses a proper composite primary key!** ??

This is the correct database design for order-product relationships.
