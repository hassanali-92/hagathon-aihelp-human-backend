import express from 'express';
import { 
    createRequest, 
    getAllRequests, 
    offerHelp, 
    markAsSolved, 
    getRecommendedRequests,
    getMyTasks,      // <--- Ye import lazmi check karein
    getMyRequests    // <--- Ye import lazmi check karein
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- 1. STATIC ROUTES (Hamesha upar) ---
router.post('/', protect, createRequest);
router.get('/', getAllRequests);
router.get('/my-tasks', protect, getMyTasks); // <--- Sab se zaroori line
router.get('/my-requests', protect, getMyRequests);
router.get('/recommendations', protect, getRecommendedRequests);

// --- 2. DYNAMIC ROUTES (Hamesha niche) ---
router.post('/:id/offer', protect, offerHelp);
router.put('/:id/solve', protect, markAsSolved);

export default router;