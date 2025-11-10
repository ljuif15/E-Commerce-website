
# E-commerce Backend with Node.js, Express, and SQLite

This is the backend for an e-commerce application built with Node.js, Express, and SQLite using Sequelize ORM.

## Features

- User authentication (register, login, JWT)
- Product management (CRUD operations)
- Shopping cart functionality
- File uploads for product images
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- SQLite3

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecommerce-site/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Initialize the database:
   ```bash
   npm run db:init
   ```
   This will:
   - Create the SQLite database file
   - Create all necessary tables
   - Create an admin user (admin@example.com / password123)
   - Add some sample products

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## Database Management

- Initialize/reset the database: `npm run db:init`
- Reset the database (deletes existing data): `npm run db:reset`
- Run migrations: `npm run db:migrate`
- Run seeders: `npm run db:seed`

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create a product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

## Project Structure

```
server/
├── config/             # Configuration files
│   ├── config.json     # Database configuration
│   └── db.js          # Database connection
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/             # Database models
├── routes/             # API routes
├── uploads/            # Uploaded files
├── utils/              # Utility functions
├── .env                # Environment variables
├── .sequelizerc        # Sequelize configuration
├── init-db.js          # Database initialization script
├── package.json
└── server.js           # Application entry point
```

## License

This project is licensed under the MIT License.
