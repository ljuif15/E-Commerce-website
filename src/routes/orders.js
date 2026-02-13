const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
} = require('../controllers/orderController');

// All order routes require authentication
router.use(protect);

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.delete('/:id', cancelOrder);

// Admin routes
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.put('/:id/payment', authorize('admin'), updatePaymentStatus);
router.get('/stats/dashboard', authorize('admin'), getOrderStats);

module.exports = router;
