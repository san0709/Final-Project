import { useState } from 'react';
import api from '../../services/api';
import { FaImage, FaVideo } from 'react-icons/fa';

const CreatePost = ({ onPostCreated }) => {
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    // Media handling would go here (e.g. uploading to Cloudinary first)
    // For now we just allow text or manual URL input if you wanted, 
    // but let's stick to text + simplistic media placeholder.

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.post('/posts', {
                caption,
                // mediaUrl: '...',   // Implement file upload logic separately
                // mediaType: 'none',
            });
            setCaption('');
            if (onPostCreated) onPostCreated(data);
        } catch (error) {
            console.error("Failed to create post", error);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <form onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                        {/* Current User Avatar could go here */}
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex-grow">
                        <textarea
                            className="w-full border-none focus:ring-0 resize-none text-gray-700 text-lg placeholder-gray-400"
                            rows="2"
                            placeholder="What's on your mind?"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                    <div className="flex space-x-4 text-gray-500">
                        <button type="button" className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                            <FaImage className="text-green-500" />
                            <span className="text-sm font-medium">Photo</span>
                        </button>
                        <button type="button" className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                            <FaVideo className="text-red-500" />
                            <span className="text-sm font-medium">Video</span>
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!caption.trim() || loading}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
