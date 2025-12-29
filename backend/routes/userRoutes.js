const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword,
  activateUser,
  deactivateUser
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/auth');

// User profile routes (any authenticated user)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin only routes
router.get('/', protect, isAdmin, getAllUsers);
router.patch('/:id/activate', protect, isAdmin, activateUser);
router.patch('/:id/deactivate', protect, isAdmin, deactivateUser);

module.exports = router;