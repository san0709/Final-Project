import asyncHandler from 'express-async-handler';
import Story from '../models/Story.js';
import User from '../models/User.js';

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
const createStory = asyncHandler(async (req, res) => {
    const { mediaUrl, mediaType } = req.body;

    if (!mediaUrl) {
        res.status(400);
        throw new Error('Media URL is required');
    }

    const story = await Story.create({
        user: req.user._id,
        mediaUrl,
        mediaType: mediaType || 'image',
    });

    const populatedStory = await Story.findById(story._id).populate('user', 'fullName username profilePicture');

    res.status(201).json(populatedStory);
});

// @desc    Get Accessable Stories (Friends + Self)
// @route   GET /api/stories
// @access  Private
const getStories = asyncHandler(async (req, res) => {
    // Get current user's friends
    const user = await User.findById(req.user._id);
    const friends = user.friends || [];

    // Stories from friends AND self
    // Group stories by User? Usually stories are UI-grouped by user circles.
    // So we prefer an aggregation or returning list of users who have stories, with their stories nested.
    // BUT for simplicity, let's return a flat list sorted by user, or let frontend group them.
    // Grouping on backend is better for "Feed".

    const userIds = [...friends, req.user._id];

    // Fetch stories that haven't expired (handled by TTL mostly, but good to filter query)
    // TTL runs every 60s in MongoDB background, so precision isn't perfect.
    // We should manually filter `created/expireAt` just in case.
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // Wait, if we use the Schema logic `expireAt` = Date.now, it expires in 24h.
    // So valid stories have `expireAt` > (Now - 24h).

    // Let's just trust Mongo to remove them, but strictly select:
    // If `expireAt` defaults to Create Time:
    const stories = await Story.find({
        user: { $in: userIds },
        // redundancy check:createdAt > 24h ago
        createdAt: { $gt: threshold }
    })
        .populate('user', 'fullName username profilePicture')
        .sort({ createdAt: 1 }); // Oldest first (chronological order for stories)

    res.json(stories);
});

export {
    createStory,
    getStories,
};
