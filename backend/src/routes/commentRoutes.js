import express from 'express';
import {
    deleteComment,
    likeComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id')
    .delete(protect, deleteComment);

router.put('/:id/like', protect, likeComment);

export default router;
