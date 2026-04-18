import express from 'express';
import { 
    getLeaderboard, 
    getMyProfile, 
    completeOnboarding, 
    getUserStats 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Route ---
router.get('/leaderboard', getLeaderboard);

// --- Protected Routes (Token Needed) ---

// 1. Dashboard ke liye '/me' add kiya (Jo aapke frontend ki demand hai)
router.get('/me', protect, getMyProfile); 

// 2. Profile page ke liye (Dono same controller use kar sakte hain)
router.get('/profile', protect, getMyProfile);

// 3. Stats aur Onboarding
router.get('/stats', protect, getUserStats);
router.put('/onboarding', protect, completeOnboarding);

export default router;