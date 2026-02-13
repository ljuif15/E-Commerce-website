# E-Commerce Frontend

React + Vite frontend for the E-Commerce application with a complete dashboard, product browsing, shopping cart, wishlist, and order management.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Product Browsing**: Browse products with filtering, search, and pagination
- **Shopping Cart**: Add, remove, and update product quantities
- **Wishlist**: Save favorite products for later
- **Order Management**: Create orders, track status, and cancel if needed
- **User Dashboard**: View order history and account statistics
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Vite** 5.0 - Lightning fast build tool
- **React** 18.2 - UI framework
- **React Router** 6.20 - Client-side routing
- **Axios** 1.6 - HTTP client
- **Tailwind CSS** 3.3 - Utility-first CSS framework
- **Lucide React** 0.294 - Beautiful icons

## Installation

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Environment Configuration** (if needed):
Create a `.env.local` file (optional):
```bash
VITE_API_URL=http://localhost:5000/api
```

## Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

The Vite dev server is configured with a proxy to the backend API at `http://localhost:5000`.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Entry point
│   ├── components/             # Reusable components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── PrivateRoute.jsx    # Protected route wrapper
│   ├── pages/                  # Page components
│   │   ├── LoginPage.jsx       # User login
│   │   ├── RegisterPage.jsx    # User registration
│   │   ├── DashboardPage.jsx   # User dashboard with stats
│   │   ├── ProductsPage.jsx    # Products listing with filters
│   │   ├── CartPage.jsx        # Shopping cart
│   │   ├── OrdersPage.jsx      # Order history and tracking
│   │   └── WishlistPage.jsx    # Saved products
│   ├── context/                # React Context providers
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── CartContext.jsx     # Shopping cart state
│   ├── services/               # API client
│   │   └── api.js              # Axios API instance and endpoints
│   └── styles/                 # Global styles
│       └── index.css           # Tailwind CSS setup
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies and scripts
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`. The API service includes:

- **Authentication**: Login, register, get profile, update profile, change password
- **Products**: Get all products, search, filter by category
- **Cart**: Get cart, add item, update quantity, remove item, clear cart
- **Wishlist**: Get wishlist, add item, remove item
- **Orders**: Get all orders, create order, get order details, cancel order

### Key API Endpoints

All requests are made to `http://localhost:5000/api`

**Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/update-profile` - Update user profile
- `PUT /auth/change-password` - Change password

**Products**
- `GET /products` - Get all products (paginated)
- `GET /products/search?q=query` - Search products
- `GET /products/category/:category` - Get products by category

**Cart**
- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/item/:cartItemId` - Update cart item quantity
- `DELETE /cart/item/:cartItemId` - Remove item from cart
- `DELETE /cart/clear` - Clear entire cart

**Wishlist**
- `GET /wishlist` - Get user's wishlist
- `POST /wishlist/add` - Add item to wishlist
- `DELETE /wishlist/:wishlistId` - Remove item from wishlist
- `POST /wishlist/check/:productId` - Check if product in wishlist

**Orders**
- `GET /orders` - Get all user orders
- `POST /orders` - Create new order
- `GET /orders/:orderId` - Get order details
- `PUT /orders/:orderId/cancel` - Cancel order

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in or registers
2. Backend returns a JWT token
3. Token is stored in localStorage
4. Token is automatically sent with every API request via the Authorization header
5. Protected routes require authentication

If the token expires or is invalid, the user will be redirected to the login page.

## State Management

The app uses React Context API for state management:

### AuthContext
- Manages user authentication state
- Stores user data and JWT token
- Handles login, register, logout, and profile updates

### CartContext
- Manages shopping cart state
- Handles add/remove/update cart items
- Syncs with backend cart

### Usage Example
```jsx
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { cart, addItem, removeItem } = useCart();
  
  // Use in component...
}
```

## Styling

The project uses Tailwind CSS for styling:

- **Global styles** are in `src/styles/index.css`
- **Custom components** are defined as Tailwind classes (`.btn`, `.card`, `.input-field`)
- **Responsive design** uses Tailwind's responsive prefixes (`md:`, `lg:`, etc.)

### Custom CSS Classes
```css
.btn - Base button styling
.btn-primary - Primary blue button
.btn-secondary - Secondary gray button
.btn-danger - Red danger button
.card - Card container with padding and border radius
.input-field - Styled form input
```

## Troubleshooting

### Connection Refused
If you get "connection refused" errors:
1. Make sure the backend server is running on port 5000
2. Check that the backend is accessible at `http://localhost:5000`
3. Verify the API proxy in `vite.config.js` points to the correct backend URL

### 404 Errors on Images
Product images may show placeholder if:
1. The image path is incorrect in the database
2. The image file doesn't exist in the backend uploads folder
3. The backend server isn't serving the uploads folder

The app will show a placeholder image in these cases.

### CORS Issues
If you get CORS errors:
1. Ensure the backend has CORS enabled
2. Check that the backend API URL is correct in the proxy configuration

## Development Tips

- **Hot Module Replacement (HMR)**: Changes are instantly reflected without full page reload
- **Developer Tools**: Use browser DevTools to inspect components and network requests
- **React DevTools**: Install React DevTools browser extension for easier debugging
- **Console Errors**: Check browser console for helpful error messages

## Building & Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```

### Deployment
1. Build the project: `npm run build`
2. The `dist` folder contains the production-ready files
3. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

## License

MIT
