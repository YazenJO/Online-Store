# Role-Based Authorization - Quick Start Guide

## ?? What You Need to Do

### 1. Run the SQL Script (5 minutes)
1. Open SQL Server Management Studio (SSMS)
2. Connect to your database
3. Open the file: `ROLE_BASED_AUTHORIZATION_SETUP.sql`
4. Execute the entire script
5. Verify: Check if "Role" column exists in Customers table

### 2. Restart Your Application
- Stop your API application
- Start it again
- The code is already updated and built successfully ?

### 3. Test It Out

#### Test Admin Access:
1. Open Swagger UI: `http://localhost:<your-port>/swagger`
2. Go to `POST /api/auth/login`
3. Login with:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. Copy the `token` from response
5. Click ?? **Authorize** button at top of Swagger
6. Paste token and click "Authorize"
7. Try `GET /api/Orders/All` - Should work! ?

#### Test Customer Access:
1. Register a new user via `POST /api/auth/register`
2. Login with that user
3. Copy the token and authorize
4. Try `GET /api/Orders/All` - Should get 403 Forbidden ?

---

## ?? What Changed

| Component | Changes Made |
|-----------|--------------|
| **Database** | Added `Role` column to Customers table |
| **Stored Procedures** | Updated 5 SPs to include Role |
| **CustomerDTO** | Added `Role` property |
| **Customer (BLL)** | Added `Role` property |
| **CustomerData (DAL)** | Updated to read/write Role |
| **JwtService** | Includes role in JWT token |
| **AuthController** | Passes role when generating tokens |
| **OrderController** | Added `[Authorize(Roles = "Admin")]` to protected endpoints |
| **Program.cs** | Added Swagger JWT configuration |

---

## ?? Key Concepts

### Roles
- **Customer** (default): Can view/create their own data
- **Admin**: Full access to everything

### How It Works
1. User logs in ? Gets JWT token with role
2. Token is sent with each request
3. API checks role before allowing access
4. Admin = full access, Customer = limited access

---

## ?? Authorization Matrix

| Endpoint | Customer | Admin |
|----------|----------|-------|
| View ALL orders | ? | ? |
| View OWN order | ? | ? |
| Create order (for self) | ? | ? |
| Update any order | ? | ? |
| Delete any order | ? | ? |

---

## ?? Files Created

1. `ROLE_BASED_AUTHORIZATION_SETUP.sql` - Run this in your database
2. `ROLE_AUTHORIZATION_GUIDE.md` - Full detailed guide
3. `ROLE_AUTHORIZATION_QUICKSTART.md` - This file

---

## ? Checklist

- [ ] Run SQL script on database
- [ ] Restart API application
- [ ] Test admin login in Swagger
- [ ] Test authorization button works
- [ ] Try accessing `/api/Orders/All` as admin (should work)
- [ ] Register new customer
- [ ] Try accessing `/api/Orders/All` as customer (should fail with 403)

---

## ?? Need Help?

Check `ROLE_AUTHORIZATION_GUIDE.md` for:
- Detailed explanations
- Troubleshooting section
- How to add authorization to other controllers
- Security best practices

---

## ?? You're Done!

That's it! You now have role-based authorization working in your API.

**Default Admin Account:**
- Username: `admin`
- Password: `admin123`

Remember to change the admin password in production! ??
