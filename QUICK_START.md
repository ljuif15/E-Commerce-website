# E-Commerce API - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd E-Commerce-website
npm install
```

### Step 2: Create .env File
Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here_change_this_in_production
JWT_EXPIRE=7d
DATABASE_URL=./database.sqlite
BCRYPT_ROUNDS=10
```

### Step 3: Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start at `http://localhost:5000`

---

## 📝 Common Tasks

### Register a New User

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "SecurePass@123",
  "address": "123 Main Street"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Login User

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Add Product to Cart

**Request:**
```bash
POST /api/cart/items
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "productId": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": 1,
    "productId": 1,
    "quantity": 2,
    "price": "99.99",
    "subtotal": "199.98"
  }
}
```

---

### Get User Cart

**Request:**
```bash
GET /api/cart
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "totalPrice": "199.98",
    "totalItems": 2,
    "CartItems": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "price": "99.99",
        "Product": {
          "name": "Product Name",
          "image": "image.jpg"
        }
      }
    ]
  }
}
```

---

### Create an Order

**Request:**
```bash
POST /api/orders
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "shippingAddress": "456 New Street, City",
  "notes": "Please deliver after 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "orderNumber": "ORD-1676283600000-ABC123",
    "totalAmount": "199.98",
    "totalItems": 2,
    "status": "pending",
    "paymentStatus": "pending",
    "OrderItems": [...]
  }
}
```

---

### Get All Products

**Request:**
```bash
GET /api/products?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": "99.99",
      "stock": 50,
      "category": "Electronics",
      "image": "image.jpg",
      "rating": 4.5,
      "reviewCount": 10
    }
  ],
  "pagination": {
    "total": 100,
    "pages": 10,
    "currentPage": 1,
    "perPage": 10
  }
}
```

---

### Add to Wishlist

**Request:**
```bash
POST /api/wishlist
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "productId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to wishlist"
}
```

---

### Get User Orders

**Request:**
```bash
GET /api/orders
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-1676283600000-ABC123",
      "totalAmount": "199.98",
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "2026-02-13T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "pages": 1,
    "currentPage": 1
  }
}
```

---

## 🔑 Useful Headers

### All Requests
```
Content-Type: application/json
```

### Protected Routes (Requires JWT Token)
```
Authorization: Bearer <your_jwt_token>
```

### File Uploads
```
Content-Type: multipart/form-data
Authorization: Bearer <your_jwt_token>
```

---

## 📊 Available Endpoints Summary

### Authentication (Public)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/update` | ✅ | Update profile |
| PUT | `/api/auth/change-password` | ✅ | Change password |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | Get all products |
| GET | `/api/products/:id` | ❌ | Get single product |
| GET | `/api/products/category/:category` | ❌ | Get by category |
| GET | `/api/products/search/:query` | ❌ | Search products |
| POST | `/api/products` | ✅ Admin | Create product |
| PUT | `/api/products/:id` | ✅ Admin | Update product |
| DELETE | `/api/products/:id` | ✅ Admin | Delete product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | ✅ | Get user cart |
| POST | `/api/cart/items` | ✅ | Add to cart |
| PUT | `/api/cart/items/:id` | ✅ | Update quantity |
| DELETE | `/api/cart/items/:id` | ✅ | Remove from cart |
| DELETE | `/api/cart` | ✅ | Clear cart |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wishlist` | ✅ | Get wishlist |
| POST | `/api/wishlist` | ✅ | Add to wishlist |
| DELETE | `/api/wishlist/:id` | ✅ | Remove from wishlist |
| GET | `/api/wishlist/check/:id` | ✅ | Check if in wishlist |
| DELETE | `/api/wishlist` | ✅ | Clear wishlist |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders` | ✅ | Get orders |
| GET | `/api/orders/:id` | ✅ | Get order details |
| POST | `/api/orders` | ✅ | Create order |
| DELETE | `/api/orders/:id` | ✅ | Cancel order |
| PUT | `/api/orders/:id/status` | ✅ Admin | Update status |
| PUT | `/api/orders/:id/payment` | ✅ Admin | Update payment |
| GET | `/api/orders/stats/dashboard` | ✅ Admin | Get statistics |

---

## ✔️ Password Requirements

Your password must contain:
- ✓ Minimum 8 characters
- ✓ At least one uppercase letter (A-Z)
- ✓ At least one lowercase letter (a-z)
- ✓ At least one number (0-9)
- ✓ At least one special character (@$!%*?&)

**Example:** `SecurePass@123`

---

## 🛠️ Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Try changing PORT in .env file
- Clear node_modules and reinstall: `rm -r node_modules && npm install`

### Database errors
- Delete database.sqlite and restart server
- Check file permissions

### Authentication errors
- Verify JWT_SECRET is set in .env
- Check token hasn't expired
- Ensure Bearer token is in Authorization header

### CORS errors
- CORS is already enabled for all origins in development
- Update in server.js for specific domains in production

---

## 🔐 Security Best Practices

1. **Change JWT_SECRET** - Use a strong random string in production
2. **Use HTTPS** - Enable SSL/TLS in production
3. **Validate Input** - All inputs are validated automatically
4. **Secure Passwords** - Passwords are hashed with bcryptjs
5. **Role-Based Access** - Admin endpoints are protected
6. **Token Expiration** - Tokens expire after 7 days by default

---

## 📚 Additional Resources

- Full API Documentation: See [README.md](README.md)
- API Testing Report: See [API_TESTING_REPORT.md](API_TESTING_REPORT.md)
- Project Structure: See project root

---

## Getting Help

If you encounter issues:
1. Check the error message in the response
2. Review the API_TESTING_REPORT.md
3. Check server logs in terminal
4. Verify .env file is correctly configured
5. Ensure all dependencies are installed

---

**Happy Coding! 🚀**

**API Version:** 1.0.0  
**Last Updated:** February 13, 2026
