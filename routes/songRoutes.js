import express from 'express';
import {
  getAllSongs,
  getSongById,
  syncSongsFromStorage,
  createSong,
  updateSong,
  deleteSong
} from '../controllers/songController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllSongs);
router.get('/:id', getSongById);

// Protected routes (Admin only)
router.post('/sync', protect, isAdmin, syncSongsFromStorage);
router.post('/', protect, isAdmin, createSong);
router.put('/:id', protect, isAdmin, updateSong);
router.delete('/:id', protect, isAdmin, deleteSong);

export default router;
