import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
// @desc    Create a new post
// @route   POST /api/posts
// @access  Private

const createPost = asyncHandler(async (req, res) => {
    const { caption, location } = req.body;

    let mediaUrl = null;
    let mediaType = 'none';

    // 🔥 Multer file handling
    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;

        if (req.file.mimetype.startsWith('video')) {
            mediaType = 'video';
        } else {
            mediaType = 'image';
        }
    }

    // Atleast caption or media must be present
    if (!caption && !mediaUrl) {
        res.status(400);
        throw new Error('Post must have a caption or media');
    }

    const post = await Post.create({
        user: req.user._id,
        caption,
        mediaUrl,
        mediaType,
        location,
    });

    const populatedPost = await Post.findById(post._id)
        .populate('user', 'fullName username profilePicture');

    res.status(201).json(populatedPost);
});


// @desc    Get all posts (News Feed) - User + Friends
// @route   GET /api/posts/feed
// @access  Private
const getFeedPosts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    // Get current user's friends
    const user = await User.findById(req.user._id);
    const friends = user.friends || [];

    // Include user's own ID in the list
    const userIds = [...friends, req.user._id];

    const count = await Post.countDocuments({ user: { $in: userIds } });

    const posts = await Post.find({ user: { $in: userIds } })
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .populate('user', 'fullName username profilePicture')
        .populate({
            path: 'likes', // Optional: if you want to show who liked it immediately
            select: 'fullName username profilePicture'
            // NOTE: For performance, maybe don't populate all likes in feed, just count + isLiked check
        });

    res.json({ posts, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('user', 'fullName username profilePicture')
        .populate('likes', 'fullName username profilePicture');

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        post.caption = req.body.caption !== undefined ? req.body.caption : post.caption;
        post.location = req.body.location !== undefined ? req.body.location : post.location;

        // Update Media
        if (req.body.mediaUrl) {
            post.mediaUrl = req.body.mediaUrl;
            post.mediaType = req.body.mediaType || 'image';
            post.mediaPublicId = req.body.mediaPublicId || post.mediaPublicId;
        } else if (req.body.mediaUrl === '') {
            // If explicitly set to empty string, remove media
            post.mediaUrl = undefined;
            post.mediaType = 'none';
            post.mediaPublicId = undefined;
        }

        const updatedPost = await post.save();
        // Re-populate for response
        await updatedPost.populate('user', 'fullName username profilePicture');

        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        // Delete associated comments
        await Comment.deleteMany({ post: post._id });

        // MOCK: Cloudinary Deletion
        if (post.mediaPublicId) {
            // In a real app, you would use cloudinary.uploader.destroy(post.mediaPublicId)
            console.log(`[Mock] Deleted Cloudinary media: ${post.mediaPublicId}`);
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Like / Unlike Post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        if (post.likes.includes(req.user._id)) {
            // Unlike
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            // Like
            post.likes.push(req.user._id);

            // Notification
            await createNotification({
                recipient: post.user,
                sender: req.user._id,
                type: 'like',
                post: post._id,
            });
        }

        await post.save();

        // Return updated likes list (or just count)
        // Populating to show "You and X others liked this" if needed
        // For bandwidth, maybe just return IDs
        res.json(post.likes);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Get user posts
// @route   GET /api/posts/user/:userId
// @access  Private
const getUserPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .populate('user', 'fullName username profilePicture');

    res.json(posts);
});

export {
    createPost,
    getFeedPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    getUserPosts,
};
