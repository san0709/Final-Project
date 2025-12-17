import express from 'express';
import {
    createStory,
    getStories
} from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getStories)
    .post(protect, createStory);

export default router;
