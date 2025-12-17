import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/feed/PostCard';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';

const Profile = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Friend status state
    const [friendStatus, setFriendStatus] = useState('none'); // none, pending, friend

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const { data: userProfile } = await api.get(`/users/${username}`);
                setProfile(userProfile);

                // Fetch posts
                const { data: userPosts } = await api.get(`/posts/user/${userProfile._id}`);
                setPosts(userPosts);

                // Check friend status
                if (currentUser && currentUser._id !== userProfile._id) {
                    // This logic is complex without a dedicated "check status" endpoint, 
                    // but we can check `currentUser.friends`.
                    // Ideally we should check if a request is pending.
                    // For now, let's just check if friends.
                    // We would need to fetch "my" friend requests to see if pending.
                }

            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [username, currentUser]);

    const sendFriendRequest = async () => {
        try {
            await api.post(`/users/friend-request/${profile._id}`);
            alert('Friend request sent!');
        } catch (err) {
            alert('Failed to send request');
        }
    }

    if (loading) return <div className="text-center py-10">Loading Profile...</div>;
    if (!profile) return <div className="text-center py-10">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                    {profile.coverPhoto && <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
                </div>
                <div className="px-6 py-4 relative">
                    <div className="absolute -top-16 left-6 grid place-items-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                            <img
                                src={profile.profilePicture || 'https://placehold.co/150'}
                                alt={profile.username}
                                className="w-full h-full object-cover px-0 py-0"
                            />
                        </div>
                    </div>

                    <div className="ml-40 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                            <p className="text-gray-500">@{profile.username}</p>
                            {profile.bio && <p className="text-gray-700 mt-2">{profile.bio}</p>}
                        </div>

                        {currentUser && currentUser._id !== profile._id && (
                            <button
                                onClick={sendFriendRequest}
                                className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-700"
                            >
                                <FaUserPlus />
                                <span>Connect</span>
                            </button>
                        )}

                        {currentUser && currentUser._id === profile._id && (
                            <button className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50">
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mt-8 flex space-x-8 border-t pt-4">
                        <div>
                            <span className="font-bold text-gray-900">{posts.length}</span>
                            <span className="text-gray-500 ml-1">Posts</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900">{profile.friends?.length || 0}</span>
                            <span className="text-gray-500 ml-1">Friends</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold mb-2">About</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Lives in <strong>{profile.location || 'Unknown'}</strong></p>
                            {profile.website && <p>Website: <a href={profile.website} className="text-blue-600 hover:underline">{profile.website}</a></p>}
                            <p>Joined {new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                    {posts.length === 0 && (
                        <div className="text-center py-10 bg-white rounded shadow text-gray-500">
                            No posts to show.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
