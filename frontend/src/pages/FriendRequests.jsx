import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/feed/PostCard';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';

const Profile = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Friend request states
    // none | sent | received | friends
    const [friendStatus, setFriendStatus] = useState('none');
    const [requestId, setRequestId] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // Fetch profile
                const { data: userProfile } = await api.get(`/users/${username}`);
                setProfile(userProfile);

                // Fetch posts
                const { data: userPosts } = await api.get(
                    `/posts/user/${userProfile._id}`
                );
                setPosts(userPosts);

                // Friend status logic
                if (currentUser && currentUser._id !== userProfile._id) {
                    // Already friends
                    if (userProfile.friends?.includes(currentUser._id)) {
                        setFriendStatus('friends');
                    } else {
                        // Check received requests
                        const { data: requests } = await api.get(
                            '/users/friend-requests'
                        );

                        const received = requests.find(
                            (r) => r.sender._id === userProfile._id
                        );

                        if (received) {
                            setFriendStatus('received');
                            setRequestId(received._id);
                        } else {
                            setFriendStatus('none');
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching profile', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username, currentUser]);

    const sendFriendRequest = async () => {
        try {
            const { data } = await api.post(
                `/users/friend-request/${profile._id}`
            );

            // Normal success
            setFriendStatus('sent');
            setRequestId(data._id);
        } catch (err) {
            // 🔥 KEY FIX
            if (
                typeof err === 'string' &&
                err.toLowerCase().includes('already pending')
            ) {
                // Treat as SENT
                setFriendStatus('sent');

                // Fetch sent requests to get requestId
                const { data: sentRequests } = await api.get(
                    '/users/sent-requests'
                );

                const sent = sentRequests.find(
                    (r) => r.receiver._id === profile._id
                );

                if (sent) {
                    setRequestId(sent._id);
                }
            } else {
                alert(err);
            }
        }
    };


    // Cancel sent request (toggle back to Connect)
    const cancelFriendRequest = async () => {
        try {
            await api.delete(
                `/users/friend-request/${requestId}/cancel`
            );

            setFriendStatus('none');
            setRequestId(null);
        } catch {
            alert('Failed to cancel request');
        }
    };

    // Accept received request
    const acceptRequest = async (id) => {
        try {
            await api.put(`/users/friend-request/${id}/accept`);
            setFriendStatus('friends');
            setRequestId(null);
        } catch {
            alert('Failed to accept request');
        }
    };

    // Decline received request
    const declineRequest = async (id) => {
        try {
            await api.put(`/users/friend-request/${id}/decline`);
            setFriendStatus('none');
            setRequestId(null);
        } catch {
            alert('Failed to decline request');
        }
    };

    if (loading)
        return <div className="text-center py-10">Loading Profile...</div>;

    if (!profile)
        return <div className="text-center py-10">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* HEADER */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                    {profile.coverPhoto && (
                        <img
                            src={`http://localhost:5000${profile.coverPhoto}`}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <div className="px-6 py-4 relative">
                    {/* Profile pic */}
                    <div className="absolute -top-16 left-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                            <img
                                src={
                                    profile.profilePicture
                                        ? `http://localhost:5000${profile.profilePicture}`
                                        : 'https://placehold.co/150'
                                }
                                alt={profile.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="ml-40 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                            <p className="text-gray-500">@{profile.username}</p>
                            {profile.bio && (
                                <p className="text-gray-700 mt-2">{profile.bio}</p>
                            )}
                        </div>

                        {/* FRIEND BUTTON LOGIC */}
                        {currentUser && currentUser._id !== profile._id && (
                            <>
                                {friendStatus === 'none' && (
                                    <button
                                        onClick={sendFriendRequest}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700"
                                    >
                                        <FaUserPlus />
                                        Connect
                                    </button>
                                )}

                                {friendStatus === 'sent' && (
                                    <button
                                        onClick={cancelFriendRequest}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300"
                                    >
                                        Requested
                                    </button>
                                )}

                                {friendStatus === 'received' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => acceptRequest(requestId)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-full"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => declineRequest(requestId)}
                                            className="bg-gray-200 px-4 py-2 rounded-full"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}

                                {friendStatus === 'friends' && (
                                    <button
                                        disabled
                                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2"
                                    >
                                        <FaUserCheck />
                                        Friends
                                    </button>
                                )}
                            </>
                        )}

                        {/* EDIT PROFILE */}
                        {currentUser && currentUser._id === profile._id && (
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* STATS */}
                    <div className="mt-8 flex space-x-8 border-t pt-4">
                        <div>
                            <span className="font-bold">{posts.length}</span>
                            <span className="text-gray-500 ml-1">Posts</span>
                        </div>
                        <div>
                            <span className="font-bold">
                                {profile.friends?.length || 0}
                            </span>
                            <span className="text-gray-500 ml-1">Friends</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* POSTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold mb-2">About</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>
                                Lives in <strong>{profile.location || 'Unknown'}</strong>
                            </p>
                            {profile.website && (
                                <p>
                                    Website:{' '}
                                    <a
                                        href={profile.website}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {profile.website}
                                    </a>
                                </p>
                            )}
                            <p>
                                Joined{' '}
                                {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    {posts.map((post) => (
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
