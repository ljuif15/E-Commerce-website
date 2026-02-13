# E-Commerce Platform - Complete Setup Guide

This is a full-stack e-commerce application with a Node.js/Express/SQLite backend and a React/Vite frontend.

## Project Overview

### Backend
- **Runtime**: Node.js v14+
- **Framework**: Express v4.18+
- **Database**: SQLite v3
- **ORM**: Sequelize v6.31+
- **Authentication**: JWT (jsonwebtoken v9.0+)
- **Security**: bcryptjs for password hashing
- **File Upload**: Multer for product images
- **Server Port**: 5000

### Frontend
- **Build Tool**: Vite v5.0
- **Framework**: React v18.2
- **Routing**: React Router v6.20
- **HTTP Client**: Axios v1.6
- **Styling**: Tailwind CSS v3.3
- **Icons**: Lucide React v0.294
- **Dev Server Port**: 3000

## Directory Structure

```
E-Commerce-website/
├── server.js                      # Express app main file
├── .env                           # Backend environment variables
├── package.json                   # Backend dependencies
├── database.sqlite                # SQLite database (created automatically)
├── src/                           # Backend source code
│   ├── config/                    # Configuration files
│   ├── models/                    # Database models (7 models)
│   ├── controllers/               # Route controllers
│   ├── middleware/                # Express middleware
│   ├── routes/                    # API route definitions
│   └── utils/                     # Utility functions
│
├── frontend/                      # React frontend application
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── context/               # React Context providers
│   │   ├── services/              # API client
│   │   └── styles/                # Global styles
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite configuration
│   ├── package.json               # Frontend dependencies
│   └── README.md                  # Frontend documentation
│
├── README.md                      # Backend documentation
├── QUICK_START.md                 # Quick start guide
├── TECH_ARCHITECTURE.md           # Architecture documentation
└── PROMPT_GUIDE.md               # Feature prompts guide
```

## Getting Started

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- Git (optional)

### Step 1: Backend Setup

1. **Navigate to the backend directory**:
```bash
cd E-Commerce-website
```

2. **Install backend dependencies**:
```bash
npm install
```

3. **Create `.env` file** (if not already created):
```bash
cp .env.example .env
```

Or manually create `.env` with:
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
DATABASE_URL=./database.sqlite
```

4. **Start the backend server**:
```bash
npm start
```

You should see:
```
Server running on http://localhost:5000
Database connected
```

The backend is now running with SQLite database at `./database.sqlite`.

### Step 2: Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
```bash
cd E-Commerce-website/frontend
```

2. **Install frontend dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

You should see:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
```

The frontend is now running at `http://localhost:3000`.

### Step 3: Access the Application

1. Open your browser and go to `http://localhost:3000`
2. You should see the e-commerce store homepage with product listings

## Testing the Application

### Quick Test Flow

1. **Register a new account**
   - Click "Register" button
   - Fill in: name, email, phone, password, address
   - Submit the form

2. **Login**
   - Click "Login" button
   - Enter your email and password
   - You're now logged in

3. **Browse Products**
   - You should see products on the homepage
   - Use the search bar to find products
   - Filter by categories

4. **Add to Cart**
   - Click "Add to Cart" on any product
   - Go to Dashboard → Cart
   - You should see the item in your cart

5. **Create an Order**
   - In your cart, enter a shipping address
   - Click "Place Order"
   - Check Orders page to see your new order

6. **Wishlist**
   - Click the heart icon on products to add to wishlist
   - Go to Wishlist to view saved products

## API Testing

### Using cURL or Postman

**Register a user**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "Password123!",
    "address": "123 Main St"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

**Get products**:
```bash
curl http://localhost:5000/api/products?page=1&limit=10
```

### Full API Documentation

See [Backend README.md](./README.md) for complete API documentation.

## Troubleshooting

### Backend Won't Start
```
Error: EADDRINUSE: address already in use :::5000
```
Solution: Port 5000 is in use. Kill the process or use a different port:
```bash
# Change PORT in .env or:
PORT=5001 npm start
```

### Frontend Can't Connect to Backend
```
Error: Network Error
```
Solution: Make sure backend is running on port 5000. Check:
1. Backend terminal shows "Server running"
2. API proxy in `frontend/vite.config.js` points to `http://localhost:5000`

### Database Issues
```
Error: no such table: Users
```
Solution: Database is not initialized. Restart the backend:
```bash
npm start
```
Sequelize will automatically sync models.

### CORS Errors in Console
Solution: This usually means the backend CORS configuration needs adjustment. The backend already has CORS enabled, but if you get errors:
1. Check backend is running
2. Verify the proxy configuration in frontend/vite.config.js

## Features Overview

### Authentication
✅ User registration with validation
✅ Login/logout with JWT tokens
✅ Password hashing with bcryptjs
✅ Role-based access (admin/user)
✅ Update profile
✅ Change password

### Products
✅ List all products with pagination
✅ Search products
✅ Filter by category
✅ Product details
✅ Stock management
✅ Admin: Create/edit/delete products
✅ Image upload support

### Shopping Cart
✅ Add/remove items
✅ Update quantities
✅ View cart total
✅ Clear cart
✅ Persist cart server-side

### Wishlist
✅ Save favorite products
✅ Add/remove from wishlist
✅ Quick add to cart from wishlist

### Orders
✅ Create orders from cart
✅ Order history tracking
✅ Order status (pending/processing/shipped/delivered)
✅ Cancel orders (if eligible)
✅ Admin: Update order status
✅ Order item details

### Admin Features
✅ Manage products (CRUD)
✅ View all orders
✅ Update order status
✅ User management

## Database Schema

The application uses 7 main tables:

1. **Users** - User accounts and authentication
2. **Products** - Product catalog with images
3. **Cart** - Shopping cart for each user
4. **CartItems** - Individual items in cart
5. **Wishlist** - Saved products
6. **Orders** - Customer orders
7. **OrderItems** - Items in each order

All relationships are properly defined with foreign keys and cascade deletes.

## Development Workflow

### Making Changes

1. **Backend changes**:
   - Edit files in `src/` directory
   - Backend will automatically restart (if using nodemon)
   - Test changes via API

2. **Frontend changes**:
   - Edit files in `frontend/src/` directory
   - Frontend will hot reload automatically
   - Changes appear instantly in browser

3. **Database changes**:
   - Edit model definitions in `src/models/`
   - Restart backend, Sequelize will sync

### Adding New Features

To add a new feature, you typically need to:

1. Create a model in `src/models/`
2. Create a controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Create API service method in `frontend/src/services/api.js`
5. Create React components/pages in `frontend/src/pages/`

## Environment Variables

### Backend (.env)
```
NODE_ENV=development          # development or production
PORT=5000                     # Server port
JWT_SECRET=your_secret_key    # Secret for JWT signing
DATABASE_URL=./database.sqlite # Database file path
```

### Frontend (optional .env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Building for Production

### Backend
```bash
# The backend is ready for production as-is
# For deployment, set:
NODE_ENV=production
JWT_SECRET=<strong-secret-key>
```

### Frontend
```bash
cd frontend
npm run build
```

This creates a `dist` folder with production-ready files.

## Additional Resources

- [Backend Documentation](./README.md)
- [Frontend Documentation](./frontend/README.md)
- [Quick Start Guide](./QUICK_START.md)
- [Architecture Documentation](./TECH_ARCHITECTURE.md)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check the browser console for error messages
4. Check the terminal output for server errors

## License

MIT
