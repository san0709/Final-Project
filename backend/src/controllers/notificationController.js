import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;

    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .populate('sender', 'fullName username profilePicture')
        .populate('post', 'mediaUrl caption') // Preview
        .populate('comment', 'content');

    const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.json({ notifications, unreadCount: count });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
});

// @desc    Mark ALL notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllNotificationsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );

    res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
});

// Internal Helper to create notification
export const createNotification = async ({
    recipient, sender, type, post, comment, text
}) => {
    try {
        if (recipient.toString() === sender.toString()) return; // Don't notify self

        await Notification.create({
            recipient,
            sender,
            type,
            post,
            comment,
            text,
            priority: (type === 'request' || type === 'mention') ? 'high' : 'medium'
        });
    } catch (error) {
        console.error('Notification Error:', error);
        // Don't crash the app if notification fails
    }
};

export {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
};
