import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus } from 'react-icons/fa';
import CreateStory from './CreateStory';




const StoryList = () => {
    const [stories, setStories] = useState([]);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const { data } = await api.get('/stories');
                setStories(data);
            } catch (err) {
                console.error('Failed to fetch stories', err);
            }
        };
        fetchStories();
    }, []);


    const uniqueStories = [];
    const userIds = new Set();

    stories.forEach(story => {
        if (!userIds.has(story.user._id)) {
            userIds.add(story.user._id);
            uniqueStories.push(story);
        }
    });

    return (
        <div className="flex space-x-4 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            <div
                onClick={() => setShowCreate(true)}
                className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer"
            >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-dashed border-blue-500 text-blue-500 relative">
                    <FaPlus size={24} />
                </div>
                <span className="text-xs font-medium">Add Story</span>
            </div>


            {/* Friends Stories */}
            {uniqueStories.map(story => (
                <div key={story._id} className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer">
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-red-500">
                        <img
                            src={`http://localhost:5000${story.mediaUrl}`}
                            alt={story.user.username}
                            className="w-full h-full rounded-full object-cover border-2 border-white"
                        />

                    </div>
                    <span className="text-xs font-medium max-w-[64px] truncate">{story.user.username}</span>

                </div>
            ))}
            {showCreate && (
                <CreateStory
                    onClose={() => setShowCreate(false)}
                    onStoryCreated={(newStory) =>
                        setStories([newStory, ...stories])
                    }
                />
            )}
        </div>
    );
};

export default StoryList;
