import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const FriendsList = () => {
    const { userId } = useParams();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const { data } = await api.get(`/users/${userId}/friends`);
                setFriends(data);
            } catch (err) {
                console.error('Friends fetch failed');
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [userId]);

    if (loading) {
        return <div className="text-center py-10">Loading friends...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Friends</h1>

            {friends.length === 0 ? (
                <p className="text-gray-500">No friends yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {friends.map(friend => (
                        <div
                            key={friend._id}
                            className="flex items-center gap-4 border p-3 rounded"
                        >
                            <img
                                src={
                                    friend.profilePicture
                                        ? `http://localhost:5000${friend.profilePicture}`
                                        : 'https://placehold.co/60'
                                }
                                className="w-12 h-12 rounded-full object-cover"
                            />

                            <div className="flex-1">
                                <Link
                                    to={`/profile/${friend.username}`}
                                    className="font-semibold hover:underline"
                                >
                                    {friend.fullName}
                                </Link>
                                <p className="text-sm text-gray-500">
                                    @{friend.username}
                                </p>

                                <button
                                    onClick={async () => {
                                        if (!window.confirm('Unfriend pannava?')) return;
                                        await api.delete(`/users/friends/${friend._id}`);
                                        setFriends(friends.filter(f => f._id !== friend._id));
                                    }}
                                    className="text-xs text-red-600 hover:underline mt-1"
                                >
                                    Unfriend
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsList;
