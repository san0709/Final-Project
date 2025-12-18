import express from 'express';
import {
    getUserProfileByUsername,
    getCurrentUserProfile,
    updateUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    getFriendRequests,
    getFriendsList,
    removeFriend,
    searchUsers,
    getSentFriendRequests,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

/* ✅ ONLY ONE profile update route */
router.put(
    '/profile',
    protect,
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPhoto', maxCount: 1 },
    ]),
    updateUserProfile
);

// PROFILE
router.get('/profile/me', protect, getCurrentUserProfile);

// SEARCH & REQUEST HELPERS (STATIC)
router.get('/search', protect, searchUsers);
router.get('/sent-requests', protect, getSentFriendRequests);
router.get('/friend-requests', protect, getFriendRequests);

// FRIEND ACTIONS
router.post('/friend-request/:userId', protect, sendFriendRequest);
router.put('/friend-request/:requestId/accept', protect, acceptFriendRequest);
router.put('/friend-request/:requestId/decline', protect, declineFriendRequest);
router.delete('/friend-request/:requestId/cancel', protect, cancelFriendRequest);

// FRIENDS
router.get('/:userId/friends', protect, getFriendsList);
router.delete('/friends/:friendId', protect, removeFriend);

// 🚨 USERNAME ROUTE MUST BE LAST
router.get('/:username', protect, getUserProfileByUsername);

export default router;
