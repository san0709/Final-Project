import { useState, useEffect } from 'react';
import api from '../services/api';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import StoryList from '../components/stories/StoryList';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get(`/posts/feed?pageNumber=${page}`);

            if (page === 1) {
                setPosts(data.posts);
            } else {
                setPosts(prev => [...prev, ...data.posts]);
            }

            if (page >= data.pages) {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Error fetching feed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line
    }, [page]);

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <StoryList />
            <CreatePost onPostCreated={handlePostCreated} />

            <div className="space-y-6">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>

            {loading && <div className="text-center py-4">Loading...</div>}

            {!loading && hasMore && (
                <div className="text-center py-4">
                    <button
                        onClick={() => setPage(page + 1)}
                        className="text-blue-600 hover:underline"
                    >
                        Load More
                    </button>
                </div>
            )}

            {!loading && posts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No posts yet. Follow some friends or create a post!
                </div>
            )}
        </div>
    );
};

export default Home;
