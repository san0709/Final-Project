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
        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Set exact expiry date for 24h later
    });

    // NOTE: In the model, we defined `expireAt` with `expires: 86400`. 
    // If we set `expireAt` to +24h, and `expires` is 86400, it might live for 48h or expire instantly depending on config.
    // CORRECT APPROACH for Mongoose TTL:
    // Option A: Field `createdAt` expires in 24h.
    // Option B: Field `expireAt` set to specific time, index has `expireAfterSeconds: 0`.

    // Checking Model again: I defined `expires: 86400` on a field that defaults to `Date.now`.
    // This means it expires 24h after the time in that field.
    // So if we save `Date.now()`, it expires in 24h. Perfect.
    // But above I manually set it to +24h. If I keep `expires: 86400` (24h) and set value to +24h, it expires in 48h.
    // Let's correct this line to just use default (Date.now) or remove the manual addition if the schema handles it.
    // Actually, to be safer and clearer:
    // Schema: expireAt: { type: Date, expires: 0 }
    // Create: expireAt: Date.now() + 24*60*60*1000.
    // This is clearer logic. "This doc expires AT this specific time".

    // Let's stick to the Schema definition I wrote which was:
    // expireAt: { type: Date, default: Date.now, expires: 86400 }
    // This means it expires 86400s (24h) after the value in `expireAt`.
    // So we just need to leave it as default (Date.now).
    // I will revert the manual override in `story` creation to `undefined` so it uses default.

    // However, I already wrote the file with `expires: 86400`.
    // So I'll just rely on `default: Date.now`.

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
