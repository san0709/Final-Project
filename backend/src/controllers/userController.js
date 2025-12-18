import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
import { createNotification } from './notificationController.js';

// @desc    Get user profile (public or private)
// @route   GET /api/users/:username
// @access  Private
const getUserProfileByUsername = asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
        .select('-password -resetPasswordToken -resetPasswordExpire');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get current user profile
// @route   GET /api/users/profile/me
// @access  Private
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password -resetPasswordToken -resetPasswordExpire')
        .populate('friends', 'fullName username profilePicture');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Text fields
    user.fullName = req.body.fullName || user.fullName;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.website = req.body.website !== undefined ? req.body.website : user.website;

    // 🔥 THIS IS CRITICAL
    if (req.files?.profilePicture) {
        user.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
    }

    if (req.files?.coverPhoto) {
        user.coverPhoto = `/uploads/${req.files.coverPhoto[0].filename}`;
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
        profilePicture: updatedUser.profilePicture,
        coverPhoto: updatedUser.coverPhoto,
    });
});


// @desc    Send Friend Request
// @route   POST /api/users/friend-request/:userId
// @access  Private
const sendFriendRequest = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.params.userId;

    if (senderId.toString() === receiverId) {
        res.status(400);
        throw new Error('You cannot send a friend request to yourself');
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if friends already
    if (receiver.friends.includes(senderId)) {
        res.status(400);
        throw new Error('You are already friends');
    }

    // Check if request already exists
    const requestExists = await FriendRequest.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    });

    if (requestExists) {
        if (requestExists.status === 'pending') {
            res.status(400);
            throw new Error('Friend request already pending');
        }
        // If a request was rejected previously, we might want to allow sending again.
        // For now, let's assume we can resend if it was rejected or we just update status.
        // For simplicity: if it exists and is not pending/accepted, we can maybe update it or delete and create new.
        // Let's keep it strict: if accepted, error. If rejected, maybe allow.
        // Let's keep it simple: "Request already exists" is safe.
        res.status(400);
        throw new Error(`Friend request status is ${requestExists.status}`);
    }

    const friendRequest = await FriendRequest.create({
        sender: senderId,
        receiver: receiverId,
        status: 'pending'
    });

    // Notification
    await createNotification({
        recipient: receiverId,
        sender: senderId,
        type: 'request',
    });

    res.status(201).json(friendRequest);
});

// @desc    Accept Friend Request
// @route   PUT /api/users/friend-request/:requestId/accept
// @access  Private
const acceptFriendRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
        res.status(404);
        throw new Error('Friend request not found');
    }

    if (request.receiver.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Not authorized to accept this request');
    }

    if (request.status !== 'pending') {
        res.status(400);
        throw new Error('Request already handled');
    }

    request.status = 'accepted';
    await request.save();

    // Add to friends list for both
    const sender = await User.findById(request.sender);
    const receiver = await User.findById(request.receiver);

    if (sender && receiver) {
        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);
        await sender.save();
        await receiver.save();

        // Notification: "User X accepted your friend request"
        // We use 'follow' type as it represents a new connection/following
        await createNotification({
            recipient: sender._id,
            sender: receiver._id,
            type: 'follow', // Friend request accepted
            text: 'accepted your friend request',
        });
    }

    res.json({ message: 'Friend request accepted' });
});

// @desc    Decline Friend Request
// @route   PUT /api/users/friend-request/:requestId/decline
// @access  Private
const declineFriendRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
        res.status(404);
        throw new Error('Friend request not found');
    }

    if (request.receiver.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Not authorized to decline this request');
    }

    if (request.status !== 'pending') {
        res.status(400);
        throw new Error('Request already handled');
    }

    request.status = 'rejected';
    await request.save();
    // OR await request.remove(); if you want to just delete it.
    // Keeping it as rejected is good for history but "remove" allows re-request easier.
    // Let's delete it for "Decline" implies "I don't want this now".
    // Actually, usually Declining just removes the request.
    await FriendRequest.findByIdAndDelete(requestId);

    res.json({ message: 'Friend request declined' });
});

// @desc    Get Pending Friend Requests (Received)
// @route   GET /api/users/friend-requests
// @access  Private
const getFriendRequests = asyncHandler(async (req, res) => {
    const requests = await FriendRequest.find({ receiver: req.user._id, status: 'pending' })
        .populate('sender', 'fullName username profilePicture');
    res.json(requests);
});

const getSentFriendRequests = asyncHandler(async (req, res) => {
    const requests = await FriendRequest.find({
        sender: req.user._id,
        status: 'pending'
    }).populate('receiver', 'username fullName profilePicture');

    res.json(requests);
});

// @desc    Get Friends List
// @route   GET /api/users/:userId/friends
// @access  Private
const getFriendsList = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)
        .populate('friends', 'fullName username profilePicture');

    if (user) {
        res.json(user.friends);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Remove Friend
// @route   DELETE /api/users/friends/:friendId
// @access  Private
const removeFriend = asyncHandler(async (req, res) => {
    const friendId = req.params.friendId;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!user.friends.includes(friendId)) {
        res.status(400);
        throw new Error('Not friends');
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId.toString());

    await user.save();
    await friend.save();

    // Also remove the FriendRequest record if it exists, to allow re-adding? 
    // Usually good practice to clean up or set status to something else.
    // We'll leave it for now or delete if we find one.
    await FriendRequest.findOneAndDelete({
        $or: [
            { sender: userId, receiver: friendId },
            { sender: friendId, receiver: userId }
        ]
    });

    res.json({ message: 'Friend removed' });
});

// @desc    Cancel Friend Request (Sender cancels)
// @route   DELETE /api/users/friend-request/:requestId/cancel
// @access  Private
const cancelFriendRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
        res.status(404);
        throw new Error('Friend request not found');
    }

    if (request.sender.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Not authorized to cancel this request');
    }

    if (request.status !== 'pending') {
        res.status(400);
        throw new Error('Request already handled');
    }

    await request.deleteOne();

    res.json({ message: 'Friend request canceled' });
});

// @desc    Search Users
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
    const query = req.query.q;
    if (!query) {
        res.status(400);
        throw new Error('Query parameter q is required');
    }

    const users = await User.find({
        $or: [
            { fullName: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } }
        ]
    }).select('fullName username profilePicture');

    res.json(users);
});

export {
    getUserProfileByUsername,
    getCurrentUserProfile,
    updateUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    getFriendRequests,
    getSentFriendRequests,
    getFriendsList,
    removeFriend,
    searchUsers
};
