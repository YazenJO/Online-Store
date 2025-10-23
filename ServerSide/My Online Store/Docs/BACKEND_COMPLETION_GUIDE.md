# Backend Completion Guide for Online Store API

## Overview
This document outlines what you need to complete to make your ASP.NET Core Web API fully functional for the React frontend application.

## Current Status ✅

You have already implemented:
- ✅ ASP.NET Core Web API (.NET 9) project structure
- ✅ JWT Authentication & Authorization middleware
- ✅ CORS configuration (allows all origins)
- ✅ Three-layer architecture (DAL, BLL, Models)
- ✅ Most controller endpoints (Auth, Products, Orders, Shipping, Payments, Reviews, Categories, etc.)
- ✅ JWT token generation and validation
- ✅ Basic CRUD operations for all entities

---

## What You Need to Complete

### 1. **Add Authorization Attributes to Controllers** 🔐

Most of your controllers are missing the `[Authorize]` attribute. Only authenticated users should be able to access certain endpoints.

#### **Required Changes:**

**Add `[Authorize]` to protected controllers:**

- **OrdersController** - Only authenticated users should view/create their orders
- **ShippingsController** - Only authenticated users should view shipping info
- **PaymentsController** - Only authenticated users should handle payments
- **ReviewsController** - Only authenticated users should create reviews
- **CustomerController** - Only authenticated users should update their profile

#### **Example Fix for OrdersController:**

```csharp
[Authorize]  // Add this attribute
[ApiController]
[Route("api/Orders")]
public class OrdersController : ControllerBase
{
    // Endpoints will now require authentication
}
```

#### **Endpoints that should remain PUBLIC (no [Authorize]):**
- `AuthController` - Login/Register need to be public
- `ProductsController` - Products should be viewable by everyone
- `ProductCategoryController` - Categories should be viewable by everyone

---

### 2. **Implement Customer-Specific Order Endpoints** 👤

The frontend expects to get orders for the **currently logged-in customer**, not all orders.

#### **Add to OrdersController:**

```csharp
[Authorize]
[HttpGet("my-orders", Name = "GetMyOrders")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public ActionResult<IEnumerable<OrderDTO>> GetMyOrders()
{
    // Get customer ID from JWT token
    var customerIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    
    if (customerIdClaim == null || !int.TryParse(customerIdClaim.Value, out int customerId))
    {
        return Unauthorized(new { message = "Invalid token" });
    }

    var ordersList = Order.GetOrdersByCustomerId(customerId);

    if (ordersList == null || ordersList.Rows.Count == 0)
    {
        return Ok(new List<OrderDTO>()); // Return empty list instead of 404
    }

    var dtoList = new List<OrderDTO>();

    foreach (System.Data.DataRow row in ordersList.Rows)
    {
        dtoList.Add(new OrderDTO
        (
            (int?)row["OrderID"],
            (int)row["CustomerID"],
            (DateTime?)row["OrderDate"],
            (decimal)row["TotalAmount"],
            (short?)row["Status"]
        ));
    }

    return Ok(dtoList);
}

[Authorize]
[HttpGet("my-orders/{id}", Name = "GetMyOrderById")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public ActionResult<object> GetMyOrderById(int id)
{
    var customerIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    
    if (customerIdClaim == null || !int.TryParse(customerIdClaim.Value, out int customerId))
    {
        return Unauthorized(new { message = "Invalid token" });
    }

    Order order = Order.Find(id);

    if (order == null)
    {
        return NotFound(new { message = $"Order with ID {id} not found" });
    }

    // Verify this order belongs to the current customer
    if (order.CustomerID != customerId)
    {
        return Forbid(); // 403 Forbidden
    }

    // Get order items
    var orderItems = OrderItem.GetOrderItemsByOrderId(id);
    var itemsList = new List<object>();

    if (orderItems != null && orderItems.Rows.Count > 0)
    {
        foreach (System.Data.DataRow itemRow in orderItems.Rows)
        {
            var product = Product.Find((int)itemRow["ProductID"]);
            
            itemsList.Add(new
            {
                orderItemID = (int)itemRow["OrderItemID"],
                orderID = (int)itemRow["OrderID"],
                productID = (int)itemRow["ProductID"],
                quantity = (int)itemRow["Quantity"],
                unitPrice = (decimal)itemRow["UnitPrice"],
                product = product != null ? new
                {
                    productID = product.ProductID,
                    productName = product.ProductName,
                    price = product.Price
                } : null
            });
        }
    }

    // Get payment info
    var payment = Payment.FindByOrderId(id);
    object? paymentInfo = null;
    
    if (payment != null)
    {
        paymentInfo = new
        {
            paymentID = payment.PaymentID,
            orderID = payment.OrderID,
            paymentMethod = payment.PaymentMethod,
            paymentDate = payment.PaymentDate,
            amountPaid = payment.AmountPaid
        };
    }

    // Get shipping info
    var shipping = Shipping.FindByOrderId(id);
    object? shippingInfo = null;
    
    if (shipping != null)
    {
        shippingInfo = new
        {
            shippingID = shipping.ShippingID,
            orderID = shipping.OrderID,
            carrierName = shipping.CarrierName,
            trackingNumber = shipping.TrackingNumber,
            shippingStatus = shipping.ShippingStatus,
            estimatedDeliveryDate = shipping.EstimatedDeliveryDate,
            actualDeliveryDate = shipping.ActualDeliveryDate
        };
    }

    return Ok(new
    {
        orderID = order.OrderID,
        customerID = order.CustomerID,
        orderDate = order.OrderDate,
        totalAmount = order.TotalAmount,
        status = order.Status,
        items = itemsList,
        payment = paymentInfo,
        shipping = shippingInfo
    });
}
```

---

### 3. **Add Missing Data Access Methods** 💾

You need to implement these methods in your DAL/BLL layers:

#### **In OrderData.cs (DAL):**

```csharp
public static DataTable GetOrdersByCustomerId(int customerId)
{
    DataTable dt = new DataTable();

    try
    {
        using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
        {
            using (SqlCommand command = new SqlCommand("SP_GetOrdersByCustomerID", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@CustomerID", customerId);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        dt.Load(reader);
                    }
                }
            }
        }
    }
    catch (Exception ex)
    {
        // Log error
        clsEventLogData.WriteEvent($"Error in GetOrdersByCustomerId: {ex.Message}", 
            EventLogEntryType.Error);
    }

    return dt;
}
```

#### **In Order.cs (BLL):**

```csharp
public static DataTable GetOrdersByCustomerId(int customerId)
{
    return OrderData.GetOrdersByCustomerId(customerId);
}
```

#### **In ShippingData.cs (DAL):**

```csharp
public static Shipping FindByOrderId(int orderId)
{
    int? shippingID = null;
    int orderID = -1;
    string carrierName = "";
    string trackingNumber = "";
    short? shippingStatus = null;
    DateTime? estimatedDeliveryDate = null;
    DateTime? actualDeliveryDate = null;

    try
    {
        using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
        {
            using (SqlCommand command = new SqlCommand("SP_GetShippingByOrderID", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@OrderID", orderId);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        shippingID = (int)reader["ShippingID"];
                        orderID = (int)reader["OrderID"];
                        carrierName = (string)reader["CarrierName"];
                        trackingNumber = (string)reader["TrackingNumber"];
                        shippingStatus = reader["ShippingStatus"] != DBNull.Value ? 
                            (short?)reader["ShippingStatus"] : null;
                        estimatedDeliveryDate = reader["EstimatedDeliveryDate"] != DBNull.Value ? 
                            (DateTime?)reader["EstimatedDeliveryDate"] : null;
                        actualDeliveryDate = reader["ActualDeliveryDate"] != DBNull.Value ? 
                            (DateTime?)reader["ActualDeliveryDate"] : null;
                    }
                }
            }
        }
    }
    catch (Exception ex)
    {
        clsEventLogData.WriteEvent($"Error in FindShippingByOrderId: {ex.Message}", 
            EventLogEntryType.Error);
    }

    if (shippingID.HasValue)
        return new Shipping(new ShippingDTO(shippingID, orderID, carrierName, 
            trackingNumber, shippingStatus, estimatedDeliveryDate, actualDeliveryDate));
    
    return null;
}
```

#### **In PaymentData.cs (DAL):**

```csharp
public static Payment FindByOrderId(int orderId)
{
    // Similar implementation to ShippingData.FindByOrderId
    // Query the Payments table WHERE OrderID = @OrderID
}
```

#### **In OrderItemData.cs (DAL):**

```csharp
public static DataTable GetOrderItemsByOrderId(int orderId)
{
    DataTable dt = new DataTable();

    try
    {
        using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
        {
            using (SqlCommand command = new SqlCommand("SP_GetOrderItemsByOrderID", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@OrderID", orderId);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        dt.Load(reader);
                    }
                }
            }
        }
    }
    catch (Exception ex)
    {
        clsEventLogData.WriteEvent($"Error in GetOrderItemsByOrderId: {ex.Message}", 
            EventLogEntryType.Error);
    }

    return dt;
}
```

---

### 4. **Create Required Stored Procedures** 📝

Add these stored procedures to your database:

```sql
-- Get orders by customer ID
CREATE PROCEDURE SP_GetOrdersByCustomerID
    @CustomerID INT
AS
BEGIN
    SELECT * FROM Orders 
    WHERE CustomerID = @CustomerID
    ORDER BY OrderDate DESC
END
GO

-- Get shipping by order ID
CREATE PROCEDURE SP_GetShippingByOrderID
    @OrderID INT
AS
BEGIN
    SELECT * FROM Shippings 
    WHERE OrderID = @OrderID
END
GO

-- Get payment by order ID
CREATE PROCEDURE SP_GetPaymentByOrderID
    @OrderID INT
AS
BEGIN
    SELECT * FROM Payments 
    WHERE OrderID = @OrderID
END
GO

-- Get order items by order ID
CREATE PROCEDURE SP_GetOrderItemsByOrderID
    @OrderID INT
AS
BEGIN
    SELECT oi.*, p.ProductName, p.Price
    FROM OrderItems oi
    INNER JOIN ProductCatalog p ON oi.ProductID = p.ProductID
    WHERE oi.OrderID = @OrderID
END
GO

-- Search products
CREATE PROCEDURE SP_SearchProducts
    @SearchQuery NVARCHAR(100)
AS
BEGIN
    SELECT * FROM ProductCatalog
    WHERE ProductName LIKE '%' + @SearchQuery + '%'
       OR Description LIKE '%' + @SearchQuery + '%'
    ORDER BY ProductName
END
GO

-- Get products by category
CREATE PROCEDURE SP_GetProductsByCategoryID
    @CategoryID INT
AS
BEGIN
    SELECT * FROM ProductCatalog
    WHERE CategoryID = @CategoryID
    ORDER BY ProductName
END
GO
```

---

### 5. **Implement Complete Order Creation Endpoint** 🛒

The frontend sends a complete order with items, payment, and shipping info in one request.

#### **Add OrderItemDTO, PaymentDTO classes if missing:**

```csharp
// DTOs/OrderItemDTO.cs
public record OrderItemDTO(
    int? OrderItemID,
    int OrderID,
    int ProductID,
    int Quantity,
    decimal UnitPrice
);

// DTOs/CompleteOrderDTO.cs
public record CompleteOrderDTO(
    OrderDTO Order,
    List<OrderItemDTO> OrderItems,
    PaymentDTO Payment,
    ShippingDTO Shipping
);
```

#### **Add to OrdersController:**

```csharp
[Authorize]
[HttpPost("complete", Name = "CreateCompleteOrder")]
[ProducesResponseType(StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public ActionResult<object> CreateCompleteOrder([FromBody] CompleteOrderDTO orderData)
{
    var customerIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    
    if (customerIdClaim == null || !int.TryParse(customerIdClaim.Value, out int customerId))
    {
        return Unauthorized(new { message = "Invalid token" });
    }

    // Validate
    if (orderData.Order == null || orderData.OrderItems == null || 
        orderData.Payment == null || orderData.Shipping == null)
    {
        return BadRequest(new { message = "Missing required order data" });
    }

    // Create order
    var order = new Order(new OrderDTO(
        null,
        customerId,
        DateTime.Now,
        orderData.Order.TotalAmount,
        1 // Pending status
    ));

    if (!order.Save())
    {
        return StatusCode(500, new { message = "Error creating order" });
    }

    // Create order items
    foreach (var item in orderData.OrderItems)
    {
        var orderItem = new OrderItem(new OrderItemDTO(
            null,
            order.OrderID!.Value,
            item.ProductID,
            item.Quantity,
            item.UnitPrice
        ));

        if (!orderItem.Save())
        {
            // Rollback order creation if items fail
            Order.DeleteOrder(order.OrderID.Value);
            return StatusCode(500, new { message = "Error creating order items" });
        }

        // Update product stock
        var product = Product.Find(item.ProductID);
        if (product != null)
        {
            product.QuantityInStock -= item.Quantity;
            product.Save();
        }
    }

    // Create payment
    var payment = new Payment(new PaymentDTO(
        null,
        order.OrderID.Value,
        orderData.Payment.PaymentMethod,
        DateTime.Now,
        orderData.Payment.AmountPaid
    ));

    if (!payment.Save())
    {
        return StatusCode(500, new { message = "Error creating payment" });
    }

    // Create shipping
    var shipping = new Shipping(new ShippingDTO(
        null,
        order.OrderID.Value,
        orderData.Shipping.CarrierName,
        GenerateTrackingNumber(), // Generate tracking number
        1, // Pending status
        orderData.Shipping.EstimatedDeliveryDate,
        null
    ));

    if (!shipping.Save())
    {
        return StatusCode(500, new { message = "Error creating shipping" });
    }

    return CreatedAtRoute("GetMyOrderById", new { id = order.OrderID }, new
    {
        orderID = order.OrderID,
        message = "Order created successfully"
    });
}

private string GenerateTrackingNumber()
{
    return $"TRK{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";
}
```

---

### 6. **Add Reviews Endpoints for Products** ⭐

The frontend expects to get reviews for each product.

#### **Add to ReviewsControllerV2:**

```csharp
[HttpGet("product/{productId}", Name = "GetReviewsByProductId")]
[ProducesResponseType(StatusCodes.Status200OK)]
public ActionResult<IEnumerable<object>> GetReviewsByProductId(int productId)
{
    var reviews = Review.GetReviewsByProductId(productId);

    if (reviews == null || reviews.Rows.Count == 0)
    {
        return Ok(new List<object>());
    }

    var result = new List<object>();

    foreach (System.Data.DataRow row in reviews.Rows)
    {
        var customer = Customer.Find((int)row["CustomerID"]);
        
        result.Add(new
        {
            reviewID = (int)row["ReviewID"],
            productID = (int)row["ProductID"],
            customerID = (int)row["CustomerID"],
            customerName = customer?.Name ?? "Unknown",
            rating = (short)row["Rating"],
            comment = row["Comment"].ToString(),
            reviewDate = (DateTime)row["ReviewDate"]
        });
    }

    return Ok(result);
}

[Authorize]
[HttpPost(Name = "CreateReview")]
[ProducesResponseType(StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public ActionResult<ReviewDTO> CreateReview([FromBody] ReviewDTO reviewDTO)
{
    var customerIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    
    if (customerIdClaim == null || !int.TryParse(customerIdClaim.Value, out int customerId))
    {
        return Unauthorized(new { message = "Invalid token" });
    }

    // Set the customer ID from token
    var review = new Review(new ReviewDTO(
        null,
        reviewDTO.ProductID,
        customerId,
        reviewDTO.Rating,
        reviewDTO.Comment,
        DateTime.Now
    ));

    if (!review.Save())
    {
        return StatusCode(500, new { message = "Error creating review" });
    }

    return CreatedAtRoute("GetReviewById", new { id = review.ReviewID }, review.ReviewDTO);
}
```

---

### 7. **Configure CORS for Production** 🌐

Currently, your CORS allows all origins. For production, you should restrict this:

#### **Update Program.cs:**

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins(
                "http://localhost:5173",  // Vite dev server
                "http://localhost:3000",  // Alternative React port
                "https://yourdomain.com"  // Production domain
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Later in the file
app.UseCors("AllowFrontend");
```

---

### 8. **Add Error Handling Middleware** ⚠️

Add global exception handling:

```csharp
// Create Middleware/ErrorHandlingMiddleware.cs
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var response = new
        {
            message = "An error occurred processing your request",
            error = exception.Message
        };

        return context.Response.WriteAsJsonAsync(response);
    }
}

// In Program.cs, add before app.UseAuthentication():
app.UseMiddleware<ErrorHandlingMiddleware>();
```

---

### 9. **Add Input Validation** ✔️

Add data annotations to your DTOs:

```csharp
using System.ComponentModel.DataAnnotations;

public record LoginRequestDTO(
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, ErrorMessage = "Username must be between 3 and 50 characters", MinimumLength = 3)]
    string Username,
    
    [Required(ErrorMessage = "Password is required")]
    [StringLength(100, ErrorMessage = "Password must be at least 6 characters", MinimumLength = 6)]
    string Password
);

public record RegisterRequestDTO(
    [Required]
    [StringLength(100)]
    string Name,
    
    [Required]
    [EmailAddress]
    string Email,
    
    [Phone]
    string? Phone,
    
    string? Address,
    
    [Required]
    [StringLength(50, MinimumLength = 3)]
    string Username,
    
    [Required]
    [StringLength(100, MinimumLength = 6)]
    string Password
);
```

Then enable automatic model validation in Program.cs:

```csharp
builder.Services.AddControllers()
    .ConfigureApplyingValidationAttributes();
```

---

### 10. **Test Your API** 🧪

Create a test file or use Swagger to test all endpoints:

1. **Test Authentication:**
   - POST `/api/auth/register` - Create a new user
   - POST `/api/auth/login` - Login and get JWT token
   - GET `/api/auth/me` - Get current user (with token)

2. **Test Products:**
   - GET `/api/products` - Get all products
   - GET `/api/products/{id}` - Get single product
   - GET `/api/products/category/{id}` - Get products by category
   - GET `/api/products/search?q=laptop` - Search products

3. **Test Orders (with authentication):**
   - GET `/api/Orders/my-orders` - Get user's orders
   - POST `/api/Orders/complete` - Create complete order
   - GET `/api/Orders/my-orders/{id}` - Get order details

4. **Test Reviews:**
   - GET `/api/reviews/product/{productId}` - Get product reviews
   - POST `/api/reviews` - Create review (authenticated)

---

## Summary Checklist

- [x] Add `[Authorize]` attributes to protected controllers
- [ ] Implement `GetMyOrders` endpoint
- [ ] Implement `GetMyOrderById` endpoint with full details
- [ ] Add `Order.GetOrdersByCustomerId()` method in DAL/BLL
- [ ] Add `Shipping.FindByOrderId()` method
- [ ] Add `Payment.FindByOrderId()` method
- [ ] Add `OrderItem.GetOrderItemsByOrderId()` method
- [ ] Create required stored procedures in database
- [ ] Implement `CreateCompleteOrder` endpoint
- [ ] Add product reviews endpoints
- [ ] Update CORS for production
- [ ] Add error handling middleware
- [ ] Add input validation to DTOs
- [ ] Test all endpoints with Swagger/Postman
- [ ] Document API endpoints

---

## Database Schema Reminder

Make sure your database has these tables:
- `Customers` - User accounts
- `ProductCatalog` - Products
- `ProductCategory` - Categories
- `ProductImages` - Product images
- `Orders` - Customer orders
- `OrderItems` - Order line items
- `Payments` - Payment records
- `Shippings` - Shipping info
- `Reviews` - Product reviews

---

## Next Steps

1. Start by adding the missing stored procedures to your database
2. Implement the DAL methods for getting related data
3. Add the `[Authorize]` attributes to controllers
4. Implement the new endpoints in OrdersController
5. Test each endpoint using Swagger UI
6. Connect your React frontend and test the full flow

---

## Additional Resources

- [ASP.NET Core JWT Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/jwt)
- [ASP.NET Core Authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/introduction)
- [ASP.NET Core Model Validation](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation)

---

**Good luck completing your backend! 🚀**
