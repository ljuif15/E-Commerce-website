const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:id', removeFromWishlist);
router.get('/check/:id', checkWishlist);
router.delete('/', clearWishlist);

module.exports = router;
