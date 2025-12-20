import express from 'express';
import { createStory, getStories } from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(protect, getStories)
    .post(
        protect,
        upload.single('media'), // 🔥 REQUIRED FOR FILE UPLOAD
        createStory
    );

export default router;
