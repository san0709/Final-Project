import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

import {
    createPost,
    getFeedPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    getUserPosts,
} from '../controllers/postController.js';
import {
    addComment,
    getPostComments,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(
        protect,
        upload.single('media'),
        createPost
    );

router.get('/feed', protect, getFeedPosts);
router.get('/user/:userId', protect, getUserPosts);

router.route('/:id')
    .get(protect, getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);

// Comment routes nested in post for creation/fetching
router.route('/:postId/comments')
    .get(protect, getPostComments)
    .post(protect, addComment);

export default router;
