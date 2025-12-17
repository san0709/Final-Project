import { useState } from 'react';
import api from '../../services/api';

const CommentBox = ({ postId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.post(`/posts/${postId}/comments`, { content });
            setContent('');
            if (onCommentAdded) onCommentAdded(data);
        } catch (error) {
            console.error("Failed to add comment", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-4">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
                type="submit"
                disabled={!content.trim() || loading}
                className="text-blue-600 font-semibold text-sm disabled:opacity-50"
            >
                Post
            </button>
        </form>
    );
};

export default CommentBox;
