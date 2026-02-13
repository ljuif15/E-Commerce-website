# 🚀 Getting Started - E-Commerce Platform

## Quick Start (5 Minutes)

### What You Need
- Node.js v14+ installed
- Two terminal windows or tabs

### Step 1: Start Backend (Terminal 1)

```bash
# Navigate to project root
cd d:\l\E-Commerce-website

# Install dependencies (first time only)
npm install

# Start the backend server
npm start
```

✅ You should see:
```
Server running on http://localhost:5000
Database connected
```

**Keep this terminal open.**

### Step 2: Start Frontend (Terminal 2)

```bash
# Navigate to frontend folder
cd d:\l\E-Commerce-website\frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

✅ You should see:
```
VITE v5.0.0  ready in XXX ms
➜  Local:   http://localhost:3000/
```

**Keep this terminal open.**

### Step 3: Open the App

Open your browser and go to:
```
http://localhost:3000
```

You should see the e-commerce store homepage! 🎉

---

## Testing the App

### 1. Register a New Account

1. Click the **"Register"** button in the top-right
2. Fill in the form:
   - **Name**: John Doe (or any name)
   - **Email**: john@example.com (or any email)
   - **Phone**: 1234567890
   - **Password**: Password123! (must have uppercase, number, special char)
   - **Address**: 123 Main Street
3. Click **"Register"**

### 2. Login

1. Click the **"Login"** button
2. Enter your email and password
3. Click **"Login"**

✅ You're now logged in! You should see your name in the navbar.

### 3. Browse Products

1. Click **"Products"** in the navbar (or browse homepage)
2. You should see products displayed
3. Try:
   - **Search**: Enter a product name in the search box
   - **Filter**: Click category buttons to filter products
   - **Pagination**: Use Previous/Next buttons to view more products

### 4. Add to Cart

1. Click **"Add"** on any product card
2. You should see a green notification "Added to cart! ✓"
3. Notice the cart counter in the navbar increases

### 5. View Your Cart

1. Click the **shopping cart icon** in the navbar
2. Or go to **Dashboard → Cart**
3. You'll see:
   - Items in your cart
   - Quantity controls (+/- buttons)
   - Total price
   - Remove button for each item

### 6. Create an Order

1. In your cart, scroll down to the **Order Summary** section
2. Enter a **Shipping Address** (required)
3. Optionally add **Order Notes**
4. Click **"Place Order"**

✅ Your order is created!

### 7. Track Your Order

1. Click **"Orders"** in the navbar
2. Or go to **Dashboard → Orders**
3. You'll see:
   - All your orders
   - Order status (pending, processing, etc.)
   - Order total and items
   - Click any order to expand and see details

### 8. Use Wishlist

1. Click the **heart icon** ❤️ on any product
2. Click **"Wishlist"** in the navbar
3. You can see all your saved products
4. Add them to cart or remove from wishlist

### 9. View Your Dashboard

1. Click **"Dashboard"** in the navbar
2. You'll see:
   - Welcome message
   - Stats cards (total orders, pending, delivered, total spent)
   - Your profile information
   - Quick action buttons
   - Recent orders table

---

## API Testing (Advanced)

### Using cURL

**Register a user**:
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John\",\"email\":\"john@test.com\",\"phone\":\"123\",\"password\":\"Pass123!\",\"address\":\"123 St\"}"
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@test.com\",\"password\":\"Pass123!\"}"
```

**Get all products**:
```bash
curl http://localhost:5000/api/products?page=1&limit=10
```

> Get your token from the login response and add to headers:
> ```bash
> -H "Authorization: Bearer YOUR_TOKEN_HERE"
> ```

---

## Common Issues & Solutions

### Issue: "Connection Refused" on Frontend

**Problem**: Frontend can't connect to backend

**Solution**:
1. Make sure backend terminal shows "Server running on http://localhost:5000"
2. If not, go to backend terminal and run `npm start`
3. Refresh the frontend page (Ctrl+R or Cmd+R)

### Issue: "Port 5000 Already in Use"

**Problem**: Another application is using port 5000

**Solution**:
```bash
# Use a different port
PORT=5001 npm start
```

Then update the frontend proxy in `frontend/vite.config.js`:
```javascript
/api.*: 'http://localhost:5001'  // Change 5000 to 5001
```

### Issue: Images Not Showing

**Problem**: Product images show placeholder

**Reasons**:
- Images are stored in the backend `/uploads` folder
- Some products might not have images yet
- This is normal - they'll show placeholder

### Issue: "npm: command not found"

**Problem**: Node.js not installed

**Solution**:
1. Download Node.js from https://nodejs.org
2. Install it
3. Open a new terminal and try again

### Issue: Cart Items Disappear

**Problem**: Cart was cleared or session ended

**Solution**:
- This is normal - create a new order to test persistence
- Cart data is stored on the backend

---

## Project Structure

```
E-Commerce-website/            ← Root
├── server.js                  ← Backend entry point
├── package.json               ← Backend dependencies
├── .env                       ← Backend configuration
├── src/                       ← Backend code
│   ├── models/               ← Database models
│   ├── controllers/          ← API logic
│   ├── routes/               ← API routes
│   └── middleware/           ← Auth, error handling
│
└── frontend/                 ← React frontend
    ├── src/
    │   ├── pages/           ← Page components
    │   ├── components/      ← Reusable components
    │   ├── context/         ← State management
    │   ├── services/        ← API calls
    │   └── styles/          ← CSS
    ├── index.html           ← HTML entry point
    └── package.json         ← Frontend dependencies
```

---

## What's Running

### Backend (Port 5000)
- **http://localhost:5000** - API server
- **http://localhost:5000/api/products** - Example API endpoint
- SQLite database at `./database.sqlite`

### Frontend (Port 3000)
- **http://localhost:3000** - React app
- Automatically proxies API calls to backend

---

## Features You Can Try

✅ **User Authentication**
- Register with validation
- Login/logout
- Change password
- Update profile

✅ **Product Browsing**
- Search products
- Filter by category
- View product details
- Check stock status

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- View cart total
- Clear cart

✅ **Wishlist**
- Save favorite products
- Remove from wishlist
- Add to cart from wishlist

✅ **Orders**
- Create orders
- Track order status
- View order history
- Cancel pending orders

✅ **Dashboard**
- View profile
- See order statistics
- Quick actions
- Recent orders

---

## Next Steps

### Learn More
- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete setup
- Read [README.md](./README.md) for backend API docs
- Read [frontend/README.md](./frontend/README.md) for frontend docs
- Read [TECH_ARCHITECTURE.md](./TECH_ARCHITECTURE.md) for architecture

### Make Changes
- Edit frontend code in `frontend/src/` - changes reload instantly
- Edit backend code in `src/` - requires restart
- Edit styles in `frontend/src/styles/index.css`

### Deploy
- Backend can be deployed to Heroku, AWS, etc.
- Frontend can be deployed to Vercel, Netlify, etc.
- See SETUP_GUIDE.md for deployment info

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Ctrl+Shift+R | Hard refresh frontend |
| F12 | Open browser DevTools |
| Ctrl+J | Open DevTools Console |
| Ctrl+Alt+K | Vite command palette (while dev server running) |

---

## Need Help?

### Check These Files
1. **SETUP_GUIDE.md** - Complete setup and troubleshooting
2. **README.md** - Backend documentation
3. **frontend/README.md** - Frontend documentation
4. **TECH_ARCHITECTURE.md** - System architecture
5. **PROJECT_SUMMARY.md** - Complete project overview

### Debug Tips
1. Check browser console (F12) for frontend errors
2. Check terminal output for backend errors
3. Check network tab in DevTools to see API calls
4. Check `database.sqlite` exists in root folder

---

## Success Indicators

### ✅ Everything is working if:
1. You can see the products homepage
2. You can register a new account
3. You can login successfully
4. You can add products to cart
5. You can view your cart
6. You can create an order
7. You can see your order in the Orders page

### 🎉 Enjoy!

Your e-commerce platform is ready to use. Start exploring the features!

---

**Questions?** Check the documentation files in the root directory.
