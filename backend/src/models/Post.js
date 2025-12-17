import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    caption: {
        type: String,
        maxLength: 2200,
    },
    mediaUrl: {
        type: String, // URL from Cloudinary
    },
    mediaPublicId: {
        type: String, // Cloudinary Public ID for deletion
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', 'none'],
        default: 'none',
    },
    likes: [{ // Array of User IDs who liked the post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    commentsCount: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,
    },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;
