require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const wishlistRoutes = require('./src/routes/wishlist');
const orderRoutes = require('./src/routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce API is running...',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      orders: '/api/orders',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database synchronization and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT} for API documentation`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
