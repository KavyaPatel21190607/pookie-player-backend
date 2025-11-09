import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} from '../controllers/userController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes (Protected)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);

// Favorites routes
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:songId', protect, addToFavorites);
router.delete('/favorites/:songId', protect, removeFromFavorites);

// Admin routes
router.get('/', protect, isAdmin, getAllUsers);

export default router;
