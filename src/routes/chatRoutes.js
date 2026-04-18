import express from 'express';
import { getChatById, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Chat fetch karne ke liye (Jo aapne banaya hai)
router.get('/:id', protect, getChatById);

// 2. Naya message bhejne ke liye
router.post('/:id/message', protect, sendMessage);

export default router;