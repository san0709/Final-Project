import asyncHandler from 'express-async-handler';
import Story from '../models/Story.js';
import User from '../models/User.js';

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
const createStory = asyncHandler(async (req, res) => {
    // 🔥 FILE COMES FROM MULTER
    if (!req.file) {
        res.status(400);
        throw new Error('No media file uploaded');
    }

    const mediaUrl = `/uploads/${req.file.filename}`;
    const mediaType = req.file.mimetype.startsWith('video')
        ? 'video'
        : 'image';

    const story = await Story.create({
        user: req.user._id,
        mediaUrl,
        mediaType,
    });

    const populatedStory = await Story.findById(story._id)
        .populate('user', 'fullName username profilePicture');

    res.status(201).json(populatedStory);
});

// @desc    Get Accessible Stories (Friends + Self)
// @route   GET /api/stories
// @access  Private
const getStories = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const friends = user.friends || [];

    const userIds = [...friends, req.user._id];

    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stories = await Story.find({
        user: { $in: userIds },
        createdAt: { $gt: threshold },
    })
        .populate('user', 'fullName username profilePicture')
        .sort({ createdAt: 1 });

    res.json(stories);
});

export {
    createStory,
    getStories,
};
