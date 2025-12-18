import { useState } from 'react';
import api from '../../services/api';

const CreateStory = ({ onClose, onStoryCreated }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select an image or video');
            return;
        }

        setLoading(true);
        setError('');

        try {
            /* -----------------------------
               STEP 1️⃣ Upload file
            ----------------------------- */
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const mediaUrl = uploadRes.data.url;

            /* -----------------------------
               STEP 2️⃣ Create story
            ----------------------------- */
            const mediaType = file.type.startsWith('video')
                ? 'video'
                : 'image';

            const { data: newStory } = await api.post('/stories', {
                mediaUrl,
                mediaType,
            });

            onStoryCreated(newStory);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to create story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">Add Story</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="mb-3"
                    />

                    {file && (
                        <p className="text-xs text-gray-500 mb-2">
                            Selected: {file.name}
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-red-600 mb-2">{error}</p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1 bg-gray-200 rounded"
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-1 bg-blue-600 text-white rounded"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStory;
