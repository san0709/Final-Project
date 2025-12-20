import mongoose from 'mongoose';

const storySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    mediaUrl: {
        type: String, // from Cloudinary (or mock)
        required: true,
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        default: 'image',
    },
    textOffset: { // If user adds text overlay, we can store position/data here
        type: Object,
        default: {},
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Auto-expire logic:
    expireAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hrs
        expires: 86400, // MongoDB TTL: 86400 seconds = 24 hours
    },
}, {
    timestamps: true,
});

const Story = mongoose.model('Story', storySchema);

export default Story;
