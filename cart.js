const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cart');

const { protect } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

router
  .route('/')
  .get(getCart)
  .delete(clearCart);

router.route('/items')
  .post(addToCart);

router.route('/items/:itemId')
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;
