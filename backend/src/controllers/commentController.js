import asyncHandler from 'express-async-handler';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { createNotification } from './notificationController.js';

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Private
const getPostComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
        .sort({ createdAt: 1 }) // Oldest first (like Facebook) or -1 for newest first (like Instagram) - usually chronological for threads
        .populate('user', 'fullName username profilePicture');

    res.json(comments);
});

// @desc    Add a comment
// @route   POST /api/posts/:postId/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const comment = await Comment.create({
        content,
        post: postId,
        user: req.user._id,
    });

    // Update comment count on post
    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    // Notification for Comment
    await createNotification({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        comment: comment._id,
    });

    // Populate user for the new comment
    await comment.populate('user', 'fullName username profilePicture');

    res.status(201).json(comment);
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Allow comment author OR post author to delete
    // Need to fetch post to check post author
    const post = await Post.findById(comment.post);

    if (
        comment.user.toString() !== req.user._id.toString() &&
        (!post || post.user.toString() !== req.user._id.toString())
    ) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await comment.deleteOne();

    // Decrement comment count
    if (post && post.commentsCount > 0) {
        post.commentsCount -= 1;
        await post.save();
    }

    res.json({ message: 'Comment removed' });
});

// @desc    Like / Unlike Comment
// @route   PUT /api/comments/:id/like
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id).populate('post'); // Populate post for notification context if needed, though usually just comment author is enough

    if (comment) {
        if (comment.likes.includes(req.user._id)) {
            comment.likes = comment.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            comment.likes.push(req.user._id);

            // Notification
            await createNotification({
                recipient: comment.user,
                sender: req.user._id,
                type: 'like',
                comment: comment._id,
                post: comment.post
            });
        }

        await comment.save();
        res.json(comment.likes);
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

export {
    getPostComments,
    addComment,
    deleteComment,
    likeComment,
};
