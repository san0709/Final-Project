import { useState } from 'react';
import api from '../../services/api';
import { FaImage, FaVideo } from 'react-icons/fa';

const CreatePost = ({ onPostCreated }) => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // At least caption or media required
        if (!caption.trim() && !file) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('caption', caption);

            if (file) {
                formData.append('media', file); // 🔥 MUST match multer field name
            }

            const { data } = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setCaption('');
            setFile(null);

            if (onPostCreated) onPostCreated(data);
        } catch (error) {
            console.error('Failed to create post', error);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <form onSubmit={handleSubmit}>
                {/* Caption */}
                <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>

                    <div className="flex-grow">
                        <textarea
                            className="w-full border-none focus:ring-0 resize-none text-gray-700 text-lg placeholder-gray-400"
                            rows="2"
                            placeholder="What's on your mind?"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="border-t pt-3 mt-3">
                    {/* Hidden file input */}
                    <input
                        id="mediaUpload"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    <div className="flex items-center justify-between">
                        {/* Upload buttons */}
                        <div className="flex space-x-4 text-gray-500">
                            <label
                                htmlFor="mediaUpload"
                                className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                            >
                                <FaImage className="text-green-500" />
                                <span className="text-sm font-medium">Photo</span>
                            </label>

                            <label
                                htmlFor="mediaUpload"
                                className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                            >
                                <FaVideo className="text-red-500" />
                                <span className="text-sm font-medium">Video</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={(!caption.trim() && !file) || loading}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>

                    {/* Selected file preview */}
                    {file && (
                        <p className="text-xs text-gray-500 mt-2">
                            Selected: {file.name}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
