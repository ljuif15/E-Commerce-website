const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, authorize('admin'), getUserById);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;
