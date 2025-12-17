import express from 'express';
import {
    getUserProfileByUsername,
    getCurrentUserProfile,
    updateUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriendRequests,
    getFriendsList,
    removeFriend,
    searchUsers
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
    .put(protect, updateUserProfile);

router.get('/profile/me', protect, getCurrentUserProfile);
router.get('/:username', protect, getUserProfileByUsername);

router.get('/search', protect, searchUsers);

// Friend System Routes
router.post('/friend-request/:userId', protect, sendFriendRequest);
router.put('/friend-request/:requestId/accept', protect, acceptFriendRequest);
router.put('/friend-request/:requestId/decline', protect, declineFriendRequest);
router.get('/friend-requests', protect, getFriendRequests);

router.get('/:userId/friends', protect, getFriendsList);
router.delete('/friends/:friendId', protect, removeFriend);

export default router;
