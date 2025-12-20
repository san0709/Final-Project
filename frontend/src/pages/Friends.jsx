import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_URL } from '../services/api';
import { FaUserTimes } from 'react-icons/fa';

const Friends = () => {
    const { userId } = useParams();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const { data } = await api.get(`/users/${userId}/friends`);
                setFriends(data);
            } catch (error) {
                console.error('Failed to fetch friends', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [userId]);

    const unfriend = async (friendId) => {
        if (!window.confirm('Remove this friend?')) return;

        try {
            await api.delete(`/users/friends/${friendId}`);
            setFriends(friends.filter((f) => f._id !== friendId));
        } catch (error) {
            alert('Failed to remove friend');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading friends...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Friends</h1>

            {friends.length === 0 ? (
                <p className="text-gray-500 text-center">No friends yet</p>
            ) : (
                <div className="space-y-4">
                    {friends.map((friend) => (
                        <div
                            key={friend._id}
                            className="flex items-center justify-between border p-3 rounded"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        friend.profilePicture
                                            ? `${API_URL}${friend.profilePicture}`
                                            : 'https://placehold.co/50'
                                    }
                                    alt={friend.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div>
                                    <Link
                                        to={`/profile/${friend.username}`}
                                        className="font-semibold hover:underline"
                                    >
                                        {friend.fullName}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        @{friend.username}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => unfriend(friend._id)}
                                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1 rounded"
                            >
                                <FaUserTimes />
                                Unfriend
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Friends;
