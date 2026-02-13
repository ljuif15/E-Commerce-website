# E-Commerce Backend API

A complete RESTful API for an e-commerce application built with **Node.js**, **Express**, **SQLite**, and **Sequelize ORM**. This backend provides comprehensive features including user authentication, product management, shopping cart, wishlists, and order management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)

## Features

✅ **User Authentication**
- User registration and login with JWT tokens
- Password hashing with bcryptjs
- Role-based access control (User & Admin)
- Update profile and change password functionality
- Admin user management

✅ **Product Management**
- Create, read, update, and delete products (Admin only)
- Product categories and search functionality
- Image upload support
- Stock management
- Rating system

✅ **Shopping Cart**
- Add/remove items from cart
- Update item quantities
- Cart persistence per user
- Clear cart functionality
- Real-time cart total updates

✅ **Wishlist**
- Add/remove products from wishlist
- Check if product is in wishlist
- View full wishlist with product details
- Clear wishlist functionality

✅ **Order Management**
- Create orders from cart
- Order tracking with status updates
- Payment status management
- Order cancellation (pending/processing orders only)
- Admin order dashboard with statistics

✅ **Additional Features**
- Pagination support on all list endpoints
- Comprehensive input validation
- Error handling with custom error messages
- CORS enabled for frontend integration
- HTTP request logging with Morgan
- Image upload for products (max 5MB)

## Tech Stack

- **Runtime**: Node.js v14+
- **Framework**: Express.js v4.18+
- **Database**: SQLite3 v5.1+
- **ORM**: Sequelize v6.31+
- **Authentication**: JWT (jsonwebtoken v9.0+)
- **Password Hashing**: bcryptjs v2.4+
- **File Upload**: Multer v1.4+
- **Development**: Nodemon v2.0+

## Prerequisites

- **Node.js** v14 or higher
- **npm** v6 or higher
- **SQLite3** (automatically installed via npm)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd E-Commerce-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Database
DATABASE_URL=./database.sqlite

# Security
BCRYPT_ROUNDS=10
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `JWT_SECRET` | Secret key for JWT signing | required |
| `JWT_EXPIRE` | JWT token expiration | 7d |
| `DATABASE_URL` | SQLite database path | ./database.sqlite |
| `BCRYPT_ROUNDS` | Password hashing rounds | 10 |

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start with automatic reload using Nodemon.

### Production Mode

```bash
npm start
```

The server will run at `http://localhost:5000` by default.

## Project Structure

```
E-Commerce-website/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection setup
│   │   └── constants.js         # App constants (roles, statuses, categories)
│   ├── controllers/
│   │   ├── authController.js    # User authentication logic
│   │   ├── productController.js # Product management logic
│   │   ├── cartController.js    # Shopping cart logic
│   │   ├── wishlistController.js # Wishlist logic
│   │   └── orderController.js   # Order management logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & role authorization
│   │   └── errorHandler.js      # Global error handling
│   ├── models/
│   │   ├── User.js              # User database model
│   │   ├── Product.js           # Product database model
│   │   ├── Cart.js              # Cart database model
│   │   ├── CartItem.js          # Cart items model
│   │   ├── Wishlist.js          # Wishlist database model
│   │   ├── Order.js             # Order database model
│   │   ├── OrderItem.js         # Order items model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── products.js          # Product endpoints
│   │   ├── cart.js              # Cart endpoints
│   │   ├── wishlist.js          # Wishlist endpoints
│   │   └── orders.js            # Order endpoints
│   └── utils/
│       ├── errorResponse.js     # Custom error class
│       └── validators.js        # Input validation functions
├── uploads/                     # Product image uploads
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
├── package.json                 # Project dependencies
├── server.js                    # Express app setup & server start
└── README.md                    # This file
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Quick API Reference

### Authentication (Public)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile (protected)
- `PUT /auth/update` - Update user profile (protected)
- `PUT /auth/change-password` - Change password (protected)
- `GET /auth/users` - Get all users (admin only)
- `GET /auth/users/:id` - Get user by ID (admin only)
- `DELETE /auth/users/:id` - Delete user (admin only)
- `PUT /auth/users/:id/role` - Update user role (admin only)

### Products (Mostly Public)
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `GET /products/category/:category` - Get products by category
- `GET /products/search/:query` - Search products
- `POST /products` - Create product (admin only)
- `PUT /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)

### Cart (Protected)
- `GET /cart` - Get user's cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:id` - Update cart item quantity
- `DELETE /cart/items/:id` - Remove item from cart
- `DELETE /cart` - Clear cart

### Wishlist (Protected)
- `GET /wishlist` - Get wishlist
- `POST /wishlist` - Add to wishlist
- `DELETE /wishlist/:id` - Remove from wishlist
- `GET /wishlist/check/:id` - Check if in wishlist
- `DELETE /wishlist` - Clear wishlist

### Orders (Protected)
- `GET /orders` - Get orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create order
- `DELETE /orders/:id` - Cancel order
- `PUT /orders/:id/status` - Update status (admin only)
- `PUT /orders/:id/payment` - Update payment status (admin only)
- `GET /orders/stats/dashboard` - Get statistics (admin only)

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": ["validation error 1", "validation error 2"]
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Database Schema

### Key Tables

**Users**: id, name, email, phone, password (hashed), address, role, isActive, timestamps

**Products**: id, name, description, price, stock, category, image, rating, isActive, createdBy, timestamps

**Orders**: id, orderNumber, userId, totalAmount, totalItems, shippingAddress, status, paymentStatus, timestamps

**Cart**: id, userId, totalPrice, totalItems, timestamps

**Wishlist**: id, userId, productId, timestamps

## Example Usage

### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "SecurePass@123",
    "address": "123 Main Street"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Get Products and Add to Cart
```bash
# Get all products
curl http://localhost:5000/api/products

# Add to cart (requires JWT token)
curl -X POST http://localhost:5000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

## Validation Rules

### User Registration
- Name: Required, 1-100 characters
- Email: Required, valid email format
- Phone: Required, 10-15 digits
- Password: Min 8 chars, uppercase, lowercase, number, special char
- Address: Required

### Product Creation
- Name: Required, 1-100 characters
- Description: Required
- Price: Required, positive number
- Stock: Required, non-negative integer
- Category: Required, from predefined list

## License

This project is licensed under the MIT License.

**Version:** 1.0.0  
**Last Updated:** February 13, 2026
