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
        default: Date.now,
        expires: 86400, // MongoDB TTL: 86400 seconds = 24 hours
    },
}, {
    timestamps: true,
});

// Explicitly ensure the index is created for TTL
// Note: 'expires' option in schema definition usually creates it, but explicit creation is safe.
// The field 'expireAt' will determine when the doc is removed. 
// We set 'expireAt' to Date.now on creation, and 'expires' sets the delay.
// ALTERNATIVE: Set expireAt to Date.now() + 24h and expires: 0. 
// Let's go with the standard TTL approach:
// field 'createdAt' can be used with expiration, but 'expireAt' gives control per doc if needed.
// Simplest Mongoose TTL:
// createdAt: { type: Date, expires: '24h', default: Date.now }

const Story = mongoose.model('Story', storySchema);

export default Story;
