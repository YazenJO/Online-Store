-- =====================================================
-- Online Store API - Role-Based Authorization Setup
-- =====================================================
-- This script adds Role-based authorization to your Online Store database
-- Run these scripts in order on your database

-- =====================================================
-- STEP 1: Add Role Column to Customers Table
-- =====================================================

-- Add Role column with default value
ALTER TABLE Customers
ADD Role NVARCHAR(20) NOT NULL DEFAULT 'Customer';
GO

-- Update existing customers to have 'Customer' role
UPDATE Customers
SET Role = 'Customer'
WHERE Role IS NULL OR Role = '';
GO

-- =====================================================
-- STEP 2: Create an Admin User (Optional but Recommended)
-- =====================================================

-- Create an admin account for testing
INSERT INTO Customers (Name, Email, Phone, Address, Username, Password, Role)
VALUES ('Admin User', 'admin@onlinestore.com', NULL, NULL, 'admin', 'admin123', 'Admin');
GO

-- =====================================================
-- STEP 3: Update Stored Procedures
-- =====================================================

-- Update SP_GetCustomerByID to include Role
ALTER PROCEDURE SP_GetCustomerByID
    @CustomerID INT
AS
BEGIN
    SELECT CustomerID, Name, Email, Phone, Address, Username, Password, Role
    FROM Customers
    WHERE CustomerID = @CustomerID;
END;
GO

-- Update SP_GetCustomerByUsername to include Role  
ALTER PROCEDURE SP_GetCustomerByUsername
    @CustomerUsername NVARCHAR(50)
AS
BEGIN
    SELECT CustomerID, Name, Email, Phone, Address, Username, Password, Role
    FROM Customers
    WHERE Username = @CustomerUsername;
END;
GO

-- Update SP_AddCustomer to include Role
ALTER PROCEDURE SP_AddCustomer
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Phone NVARCHAR(20),
    @Address NVARCHAR(255),
    @Username NVARCHAR(50),
    @Password NVARCHAR(255),
    @Role NVARCHAR(20) = 'Customer',  -- Default to Customer
    @NewCustomerID INT OUTPUT
AS
BEGIN
    INSERT INTO Customers (Name, Email, Phone, Address, Username, Password, Role)
    VALUES (@Name, @Email, @Phone, @Address, @Username, @Password, @Role);
    
    SET @NewCustomerID = SCOPE_IDENTITY();
END;
GO

-- Update SP_UpdateCustomer to include Role
ALTER PROCEDURE SP_UpdateCustomer
    @CustomerID INT,
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Phone NVARCHAR(20),
    @Address NVARCHAR(255),
    @Username NVARCHAR(50),
    @Password NVARCHAR(255),
    @Role NVARCHAR(20)
AS
BEGIN
    UPDATE Customers
    SET Name = @Name,
        Email = @Email,
        Phone = @Phone,
        Address = @Address,
        Username = @Username,
        Password = @Password,
        Role = @Role
    WHERE CustomerID = @CustomerID;
    
    SELECT @@ROWCOUNT;
END;
GO

-- Update SP_GetAllCustomers to include Role
ALTER PROCEDURE SP_GetAllCustomers
AS
BEGIN
    SELECT CustomerID, Name, Email, Phone, Address, Username, Password, Role
    FROM Customers;
END;
GO

-- =====================================================
-- STEP 4: Verify the Changes
-- =====================================================

-- Check if Role column exists
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Customers' AND COLUMN_NAME = 'Role';
GO

-- View all customers with their roles
SELECT CustomerID, Name, Username, Role
FROM Customers;
GO

-- =====================================================
-- STEP 5: Test Admin User
-- =====================================================

-- Test: Login as admin
SELECT CustomerID, Username, Role
FROM Customers
WHERE Username = 'admin' AND Password = 'admin123';
GO

-- =====================================================
-- Additional: Create More Admin Users (Optional)
-- =====================================================

-- Example: Promote existing user to Admin
-- UPDATE Customers
-- SET Role = 'Admin'
-- WHERE Username = 'your-username-here';
-- GO

PRINT 'Role-based authorization setup completed successfully!';
PRINT 'You can now:';
PRINT '1. Login as admin (username: admin, password: admin123)';
PRINT '2. Normal registrations will automatically get "Customer" role';
PRINT '3. Admin users have full access to all endpoints';
PRINT '4. Customer users can only access their own data';
GO
