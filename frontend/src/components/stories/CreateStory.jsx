import { useState } from 'react';
import api from '../../services/api';

const CreateStory = ({ onClose, onStoryCreated }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a photo or video');

        const formData = new FormData();
        formData.append('media', file); // 🔥 MUST MATCH multer field

        try {
            setLoading(true);

            const { data } = await api.post('/stories', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onStoryCreated(data);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to create story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80">
                <h2 className="font-bold mb-4">Create Story</h2>

                <form onSubmit={submitHandler}>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="mb-4"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1 bg-gray-200 rounded"
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
