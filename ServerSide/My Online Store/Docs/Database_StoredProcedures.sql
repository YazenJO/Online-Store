-- ========================================
-- REQUIRED STORED PROCEDURES FOR ONLINE STORE API
-- ========================================

-- ========================================
-- 1. CUSTOMER AUTHENTICATION PROCEDURES
-- ========================================

-- Get customer by username (for login)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_GetCustomerByUsername') AND type in (N'P'))
DROP PROCEDURE SP_GetCustomerByUsername
GO

CREATE PROCEDURE SP_GetCustomerByUsername
    @Username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT CustomerID, Name, Email, Phone, Address, Username, Password
    FROM Customers
    WHERE Username = @Username
END
GO

-- ========================================
-- 2. PRODUCT PROCEDURES
-- ========================================

-- Get products by category
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_GetProductsByCategoryID') AND type in (N'P'))
DROP PROCEDURE SP_GetProductsByCategoryID
GO

CREATE PROCEDURE SP_GetProductsByCategoryID
    @CategoryID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ProductID, ProductName, Description, Price, QuantityInStock, CategoryID
    FROM ProductCatalog
    WHERE CategoryID = @CategoryID
    ORDER BY ProductName
END
GO

-- Search products by name or description
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_SearchProducts') AND type in (N'P'))
DROP PROCEDURE SP_SearchProducts
GO

CREATE PROCEDURE SP_SearchProducts
    @SearchTerm NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ProductID, ProductName, Description, Price, QuantityInStock, CategoryID
    FROM ProductCatalog
    WHERE ProductName LIKE '%' + @SearchTerm + '%' 
       OR Description LIKE '%' + @SearchTerm + '%'
    ORDER BY ProductName
END
GO

-- ========================================
-- 3. IMAGE PROCEDURES
-- ========================================

-- Get images by product ID
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_GetImagesByProductID') AND type in (N'P'))
DROP PROCEDURE SP_GetImagesByProductID
GO

CREATE PROCEDURE SP_GetImagesByProductID
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ImageID, ImageURL, ProductID, ImageOrder
    FROM ProductImages
    WHERE ProductID = @ProductID
    ORDER BY ImageOrder, ImageID
END
GO

-- ========================================
-- 4. REVIEW PROCEDURES
-- ========================================

-- Get reviews by product ID
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_GetReviewsByProductID') AND type in (N'P'))
DROP PROCEDURE SP_GetReviewsByProductID
GO

CREATE PROCEDURE SP_GetReviewsByProductID
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ReviewID, ProductID, CustomerID, ReviewText, Rating, ReviewDate
    FROM Reviews
    WHERE ProductID = @ProductID
    ORDER BY ReviewDate DESC
END
GO

-- ========================================
-- 5. ORDER PROCEDURES (ADVANCED - OPTIONAL)
-- ========================================

-- Get orders by customer ID with items
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_GetOrdersByCustomerID') AND type in (N'P'))
DROP PROCEDURE SP_GetOrdersByCustomerID
GO

CREATE PROCEDURE SP_GetOrdersByCustomerID
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT o.OrderID, o.CustomerID, o.OrderDate, o.TotalAmount, o.Status
    FROM Orders o
    WHERE o.CustomerID = @CustomerID
    ORDER BY o.OrderDate DESC
END
GO

-- Get order items by order ID
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_GetOrderItemsByOrderID') AND type in (N'P'))
DROP PROCEDURE SP_GetOrderItemsByOrderID
GO

CREATE PROCEDURE SP_GetOrderItemsByOrderID
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT oi.OrderID, oi.ProductID, oi.Quantity, oi.Price, oi.TotalItemsPrice,
           p.ProductName
    FROM OrderItems oi
    INNER JOIN ProductCatalog p ON oi.ProductID = p.ProductID
    WHERE oi.OrderID = @OrderID
END
GO

-- Get shipping info by order ID
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_GetShippingByOrderID') AND type in (N'P'))
DROP PROCEDURE SP_GetShippingByOrderID
GO

CREATE PROCEDURE SP_GetShippingByOrderID
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ShippingID, OrderID, CarrierName, TrackingNumber, ShippingStatus, 
           EstimatedDeliveryDate, ActualDeliveryDate
    FROM Shippings
    WHERE OrderID = @OrderID
END
GO

-- Get payment info by order ID
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_GetPaymentByOrderID') AND type in (N'P'))
DROP PROCEDURE SP_GetPaymentByOrderID
GO

CREATE PROCEDURE SP_GetPaymentByOrderID
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT PaymentID, OrderID, Amount, PaymentMethod, TransactionDate
    FROM Payments
    WHERE OrderID = @OrderID
END
GO

-- Update order status (for cancellation)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'SP_UpdateOrderStatus') AND type in (N'P'))
DROP PROCEDURE SP_UpdateOrderStatus
GO

CREATE PROCEDURE SP_UpdateOrderStatus
    @OrderID INT,
    @Status SMALLINT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Orders
    SET Status = @Status
    WHERE OrderID = @OrderID
    
    SELECT @@ROWCOUNT
END
GO

-- ========================================
-- VERIFICATION SCRIPT
-- ========================================
-- Run this to verify all procedures were created successfully

SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS StoredProcedureName,
    create_date AS CreatedDate,
    modify_date AS ModifiedDate
FROM sys.procedures
WHERE name LIKE 'SP_%'
ORDER BY name

-- ========================================
-- TEST DATA (OPTIONAL)
-- ========================================
-- Uncomment and modify as needed to insert test data

/*
-- Insert test customer
INSERT INTO Customers (Name, Email, Phone, Address, Username, Password)
VALUES ('John Doe', 'john@example.com', '+1234567890', '123 Main St', 'johndoe', 'password123')

-- Insert test categories
INSERT INTO ProductCategory (CategoryName) VALUES ('Electronics')
INSERT INTO ProductCategory (CategoryName) VALUES ('Clothing')
INSERT INTO ProductCategory (CategoryName) VALUES ('Books')

-- Insert test products
INSERT INTO ProductCatalog (ProductName, Description, Price, QuantityInStock, CategoryID)
VALUES 
    ('Laptop', 'High performance laptop', 999.99, 10, 1),
    ('T-Shirt', 'Cotton t-shirt', 19.99, 50, 2),
    ('Programming Book', 'Learn C# in 30 days', 39.99, 25, 3)

-- Insert test product images
INSERT INTO ProductImages (ImageURL, ProductID, ImageOrder)
VALUES 
    ('https://example.com/laptop1.jpg', 1, 1),
    ('https://example.com/laptop2.jpg', 1, 2),
    ('https://example.com/tshirt1.jpg', 2, 1)

-- Insert test reviews
INSERT INTO Reviews (ProductID, CustomerID, ReviewText, Rating, ReviewDate)
VALUES 
    (1, 1, 'Great laptop!', 5, GETDATE()),
    (2, 1, 'Nice quality', 4, GETDATE())
*/
