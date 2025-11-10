const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/').get(getProducts);
router.route('/:id').get(getProduct);

// Protected routes (admin only)
router.route('/').post(protect, authorize('admin'), createProduct);
router
  .route('/:id')
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
