# Authorization Implementation Plan for All Controllers

## ?? Authorization Matrix

This document outlines which endpoints need authorization and what roles should be applied to each controller in the Online Store API.

---

## ?? Role Definitions

| Role | Description | Use Case |
|------|-------------|----------|
| **Customer** | Regular users who shop | Can view products, create/manage their own orders, reviews, and profile |
| **Admin** | Store administrators | Full access to manage products, categories, view all orders, payments, shipping, and customer data |

---

## ?? Controller-by-Controller Authorization

### 1. ? **AuthController** - Already Configured
- **Status**: ? Already has proper authorization
- **Endpoints**:
  - `POST /api/auth/login` - Public ?
  - `POST /api/auth/register` - Public ?
  - `GET /api/auth/me` - [Authorize] ?

---

### 2. ? **CustomerController** - Needs Authorization

| Endpoint | Current | Recommended | Reason |
|----------|---------|-------------|---------|
| `GET /api/Customers/All` | Public | **[Authorize(Roles = "Admin")]** | Only admins should see all customers |
| `GET /api/Customers/{id}` | Public | **[Authorize] + Ownership check** | Customers can view their own profile, admins can view any |
| `POST /api/Customers` | Public | **Remove** (use /register instead) | Should use AuthController register endpoint |
| `PUT /api/Customers/{id}` | Public | **[Authorize] + Ownership check** | Customers can update their own profile, admins can update any |
| `DELETE /api/Customers/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can delete customers |
| `GET /api/Customers/Exists/{id}` | Public | **[Authorize]** | Authenticated users only |

---

### 3. ? **OrderController** - Already Configured
- **Status**: ? Already has proper authorization
- All endpoints properly protected with role-based and ownership checks

---

### 4. ? **ProductsController** (Read-Only Catalog) - Needs Minimal Authorization

| Endpoint | Current | Recommended | Reason |
|----------|---------|-------------|---------|
| `GET /api/products` | Public | **Public** ? | Anyone can browse products |
| `GET /api/products/{id}` | Public | **Public** ? | Anyone can view product details |
| `GET /api/products/category/{categoryId}` | Public | **Public** ? | Anyone can view products by category |
| `GET /api/products/search` | Public | **Public** ? | Anyone can search products |

**Note**: This controller is READ-ONLY for the public-facing catalog. All management operations are in ProductCatalogController.

---

### 5. ? **ProductCatalogController** (Admin Management) - Needs Authorization

| Endpoint | Current | Recommended | Reason |
|----------|---------|-------------|---------|
| `GET /api/ProductCatalog/All` | Public | **[Authorize(Roles = "Admin")]** | Admin-only management view |
| `GET /api/ProductCatalog/{id}` | Public | **[Authorize(Roles = "Admin")]** | Admin-only detailed view |
| `POST /api/ProductCatalog` | Public | **[Authorize(Roles = "Admin")]** | Only admins can create products |
| `PUT /api/ProductCatalog/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can update products |
| `DELETE /api/ProductCatalog/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can delete products |
| `GET /api/ProductCatalog/Exists/{id}` | Public | **[Authorize(Roles = "Admin")]** | Admin-only utility |

---

### 6. ? **CategoriesController** (ProductCategoryController) - Needs Authorization

| Endpoint | Current | Recommended | Reason |
|----------|---------|-------------|---------|
| `GET /api/categories` | Public | **Public** ? | Anyone can view categories (for browsing) |
| `GET /api/categories/{id}` | Public | **Public** ? | Anyone can view category details |
| `POST /api/categories` | Public | **[Authorize(Roles = "Admin")]** | Only admins can create categories |
| `PUT /api/categories/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can update categories |
| `DELETE /api/categories/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can delete categories |
| `GET /api/categories/exists/{id}` | Public | **Public** ? | Utility endpoint for validation |

---

### 7. ? **ReviewsController** - Already Configured
- **Status**: ? Already has proper authorization
- Public read access, authenticated write access with ownership checks ?

---

### 8. ? **PaymentsController** - Needs Authorization

| Endpoint | Current | Recommended | Reason |
|----------|---------|-------------|---------|
| `GET /api/Payments/All` | Public | **[Authorize(Roles = "Admin")]** | Only admins should see all payments |
| `GET /api/Payments/{id}` | Public | **[Authorize] + Ownership check** | Customers can view their own payments, admins can view any |
| `POST /api/Payments` | Public | **[Authorize] + Ownership check** | Customers can create payments for their orders |
| `PUT /api/Payments/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can update payment records |
| `DELETE /api/Payments/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can delete payment records |
| `GET /api/Payments/Exists/{id}` | Public | **[Authorize]** | Authenticated users only |

---

### 9. ? **ShippingsController** - Needs Authorization

| Endpoint | Current | Recommended | Reason |
|----------|---------|-------------|---------|
| `GET /api/Shippings/All` | Public | **[Authorize(Roles = "Admin")]** | Only admins should see all shipments |
| `GET /api/Shippings/{id}` | Public | **[Authorize] + Ownership check** | Customers can track their own shipments, admins can view any |
| `POST /api/Shippings` | Public | **[Authorize(Roles = "Admin")]** | Only admins/system can create shipping records |
| `PUT /api/Shippings/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can update shipping records |
| `DELETE /api/Shippings/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can delete shipping records |
| `GET /api/Shippings/Exists/{id}` | Public | **[Authorize]** | Authenticated users only |

---

### 10. ? **ProductImagesController** - Needs Authorization

| Endpoint | Current | Recommended | Reason |
|----------|---------|-------------|---------|
| `GET /api/images/All` | Public | **[Authorize(Roles = "Admin")]** | Admin-only management view |
| `GET /api/images/{id}` | Public | **Public** ? | Images are served publicly (via ProductsController) |
| `POST /api/images` | Public | **[Authorize(Roles = "Admin")]** | Only admins can upload images |
| `PUT /api/images/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can update images |
| `DELETE /api/images/{id}` | Public | **[Authorize(Roles = "Admin")]** | Only admins can delete images |

---

## ?? Summary

### Controllers by Authorization Status

| Controller | Status | Action Needed |
|------------|--------|---------------|
| AuthController | ? Complete | None |
| OrderController | ? Complete | None |
| ReviewsController | ? Complete | None |
| CustomerController | ? Needs Work | Add authorization + ownership checks |
| ProductsController | ? Complete | None (public catalog) |
| ProductCatalogController | ? Needs Work | Add admin-only authorization |
| CategoriesController | ?? Partial | Add authorization to write operations only |
| PaymentsController | ? Needs Work | Add authorization + ownership checks |
| ShippingsController | ? Needs Work | Add authorization + ownership checks |
| ProductImagesController | ?? Partial | Add admin authorization to write operations |

---

## ?? Priority Implementation Order

### High Priority (Business Critical)
1. **CustomersController** - Protect sensitive customer data
2. **PaymentsController** - Protect financial data
3. **ProductCatalogController** - Prevent unauthorized product management

### Medium Priority (Security Important)
4. **ShippingsController** - Protect shipping information
5. **CategoriesController** - Prevent unauthorized category management
6. **ProductImagesController** - Prevent unauthorized image management

### Low Priority (Already Handled)
- ProductsController (public by design)
- AuthController (already secured)
- OrderController (already secured)
- ReviewsController (already secured)

---

## ?? Implementation Notes

### Ownership Check Pattern
For endpoints where customers can access their own data:

```csharp
[Authorize]
[HttpGet("{id}")]
public ActionResult<DTO> GetById(int id)
{
    // Get the resource
    var resource = Resource.Find(id);
    if (resource == null) return NotFound();
    
    // Check authorization
    var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    // Admin can access anything
    if (userRole == "Admin")
    {
        return Ok(resource);
    }
    
    // Customer can only access their own data
    if (resource.CustomerID.ToString() != userId)
    {
        return Forbid();
    }
    
    return Ok(resource);
}
```

### Payment Ownership Check
For payments, you need to check through the Order:
```csharp
var order = Order.Find(payment.OrderID);
if (order == null) return NotFound();

if (userRole != "Admin" && order.CustomerID.ToString() != userId)
{
    return Forbid();
}
```

### Shipping Ownership Check
Similar to payments - check through Order:
```csharp
var order = Order.Find(shipping.OrderID);
if (order == null) return NotFound();

if (userRole != "Admin" && order.CustomerID.ToString() != userId)
{
    return Forbid();
}
```

---

## ?? Next Steps

1. Review this authorization matrix
2. Confirm the proposed authorization levels
3. Implement authorization on each controller in priority order
4. Test each endpoint with both Customer and Admin roles
5. Update API documentation to reflect authorization requirements

---

## ??? Security Best Practices Applied

? Principle of Least Privilege - Users only get access they need
? Defense in Depth - Multiple layers of checks
? Role-Based Access Control (RBAC) - Clear role separation
? Ownership Verification - Users can only access their own data
? Admin Override - Admins have full access when needed
? Public Read, Protected Write - Browse freely, modify securely

---

**Ready to implement? Let me know which controllers you want me to update first!**
