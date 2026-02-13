const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/items', addItemToCart);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
