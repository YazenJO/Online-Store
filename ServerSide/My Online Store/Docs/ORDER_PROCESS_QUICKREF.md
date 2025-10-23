# Order Process Flow - Quick Reference

## ?? Complete Order Flow

```
Customer Cart               Backend Processing              Database Changes
?????????????              ???????????????????              ?????????????????

?? Add to Cart:            ? Receive Request               
  • Product A (x2)         ? Validate Customer            
  • Product B (x1)         ? Check Products Exist         
                           ? Check Stock Available        
        ?                          ?                              ?
                                                          
?? Checkout                ? Calculate Total:              
  • Enter Address            • Product A: $50×2 = $100    
  • Select Payment           • Product B: $75×1 = $75     
  • Confirm Order            • Total = $175               
        ?                          ?                              ?

?? Send Request            ? Create Order                  ?? INSERT Orders
   POST /complete             OrderID: 100                    (1 record)
   {items: [...]}             Total: $175                  
        ?                          ?                              ?

                           ? Create OrderItems             ?? INSERT OrderItems
                             Item 1: OrderID=100              (2 records)
                                     ProductID=101         
                                     Qty=2, $100           
                             Item 2: OrderID=100           
                                     ProductID=205         
                                     Qty=1, $75            
        ?                          ?                              ?

                           ? Create Payment                ?? INSERT Payments
                             PaymentID: 150                   (1 record)
                             OrderID: 100                  
                             Amount: $175                  
        ?                          ?                              ?

                           ? Create Shipping               ?? INSERT Shipping
                             ShippingID: 75                   (1 record)
                             TrackingNo:                   
                             TRACK-20250120-123456        
        ?                          ?                              ?

                           ? Update Stock                  ?? UPDATE Products
                             Product 101: 50?48              (2 records)
                             Product 205: 20?19           
        ?                          ?                              ?

? Receive Response        ? Return Complete Order        
   {                          Success!                     
     orderID: 100,                                         
     items: [...],                                         
     tracking: "TRACK..."                                  
   }                                                        
```

---

## ?? What Gets Created

| Database Table | Records Created | Example |
|----------------|----------------|---------|
| **Orders** | 1 | OrderID: 100, Total: $175 |
| **OrderItems** | N (one per product) | Item 1: Product 101, Qty: 2<br>Item 2: Product 205, Qty: 1 |
| **Payments** | 1 | PaymentID: 150, Amount: $175 |
| **Shipping** | 1 | ShippingID: 75, Tracking: TRACK-... |
| **Products** (updated) | N | Product 101: Stock 50?48<br>Product 205: Stock 20?19 |

---

## ?? Request Format

```json
POST /api/Orders/complete
{
  "customerID": 5,
  "items": [
    { "productID": 101, "quantity": 2 },
    { "productID": 205, "quantity": 1 }
  ],
  "paymentMethod": "CreditCard",
  "shippingAddress": "123 Main St",
  "carrierName": "FedEx"
}
```

**Note:** 
- ? DON'T send `totalAmount` (calculated by backend)
- ? DON'T send `price` per item (fetched from DB)
- ? Only send ProductID and Quantity

---

## ?? Calculation Example

```
Cart Contents:
?? Product 101 (Laptop)
?  ?? Price: $500 (from DB)
?  ?? Quantity: 2
?  ?? Subtotal: $1,000
?
?? Product 205 (Mouse)
   ?? Price: $25 (from DB)
   ?? Quantity: 1
   ?? Subtotal: $25

Order Total: $1,025 ? Calculated by backend
```

---

## ??? Security: Why Calculate Total on Backend?

### ? Insecure (DON'T DO THIS):
```json
{
  "items": [...],
  "totalAmount": 1.00  // ? Hacker changes $175 to $1!
}
```

### ? Secure (DO THIS):
```json
{
  "items": [...]  // ? Backend fetches real prices from DB
  // No totalAmount field!
}
```

**Backend calculates:**
1. Fetch real price from Products table
2. Multiply: price × quantity
3. Sum all items
4. This is the REAL total (can't be manipulated)

---

## ?? Process Steps

```
1. Validate Request
   ?? Customer exists?
   ?? Products exist?
   ?? Sufficient stock?
        ?
2. Calculate Total
   ?? Fetch prices from DB
   ?? Sum: (price × quantity)
        ?
3. Create Order
   ?? Total = $175
        ?
4. Create OrderItems
   ?? Item 1: Product 101
   ?? Item 2: Product 205
        ?
5. Create Payment
   ?? Amount = $175
        ?
6. Create Shipping
   ?? Tracking Number
        ?
7. Update Stock
   ?? Product 101: -2
   ?? Product 205: -1
        ?
8. Return Response
   ?? Complete order details
```

---

## ?? Implementation Status

? **OrderItemDTO** - Created
? **OrderItemRequestDTO** - Created  
? **Updated Request/Response DTOs** - Done
?? **Need to implement:**
  - OrderItem Data Layer (DAL)
  - OrderItem Business Layer (BLL)
  - Updated Controller Logic
  - SQL Stored Procedures

---

## ?? Example Flow

**Customer wants to buy:**
- 2 Laptops ($500 each)
- 1 Mouse ($25)

**Frontend sends:**
```json
{
  "items": [
    {"productID": 101, "quantity": 2},
    {"productID": 205, "quantity": 1}
  ]
}
```

**Backend creates:**
- 1 Order (Total: $1,025)
- 2 OrderItems
  - OrderItem 1: Product 101, Qty 2, Price $1,000
  - OrderItem 2: Product 205, Qty 1, Price $25
- 1 Payment ($1,025)
- 1 Shipping (Tracking: TRACK-...)

**Database updates:**
- Products table: Reduce stock
  - Laptop: 50 ? 48
  - Mouse: 100 ? 99

**Response:**
```json
{
  "success": true,
  "order": {"orderID": 100, "totalAmount": 1025},
  "orderItems": [
    {"productID": 101, "quantity": 2, "totalItemsPrice": 1000},
    {"productID": 205, "quantity": 1, "totalItemsPrice": 25}
  ],
  "payment": {"amount": 1025},
  "shipping": {"trackingNumber": "TRACK-20250120-123456"}
}
```

---

## ? Key Benefits

? **One API Call** - Creates everything at once
? **Secure** - Backend calculates prices (can't be manipulated)
? **Accurate** - Uses real-time prices from database
? **Complete** - Returns all order details including tracking
? **Safe** - Automatic rollback if any step fails

---

For detailed implementation guide, see: `ORDER_PROCESS_COMPLETE_GUIDE.md`
