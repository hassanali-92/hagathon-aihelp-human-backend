import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sirf wahi user access kar payega jisne Login kiya ho
router.get('/stats', protect, getDashboardStats);

export default router;