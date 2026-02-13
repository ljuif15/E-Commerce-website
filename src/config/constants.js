// Product categories
const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'Electronics',
  CLOTHING: 'Clothing',
  FURNITURE: 'Furniture',
  BOOKS: 'Books',
  SPORTS: 'Sports',
  HOME: 'Home & Kitchen',
  TOYS: 'Toys',
  BEAUTY: 'Beauty',
};

// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Order status
const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

module.exports = {
  PRODUCT_CATEGORIES: Object.values(PRODUCT_CATEGORIES),
  USER_ROLES,
  ORDER_STATUS: Object.values(ORDER_STATUS),
  PAYMENT_STATUS: Object.values(PAYMENT_STATUS),
};
