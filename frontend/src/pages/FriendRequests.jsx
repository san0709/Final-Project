import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FriendRequests = () => {
    const { user } = useAuth(); // current logged-in user
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/users/friend-requests');
                setRequests(data);
            } catch (err) {
                console.error('Failed to fetch friend requests', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchRequests();
        }
    }, [user]);

    const acceptRequest = async (id) => {
        try {
            await api.put(`/users/friend-request/${id}/accept`);
            setRequests(requests.filter((r) => r._id !== id));
        } catch {
            alert('Failed to accept request');
        }
    };

    const declineRequest = async (id) => {
        try {
            await api.put(`/users/friend-request/${id}/decline`);
            setRequests(requests.filter((r) => r._id !== id));
        } catch {
            alert('Failed to decline request');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-4 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Friend Requests</h1>

            {requests.length === 0 ? (
                <p className="text-gray-500 text-center">No pending requests</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className="flex items-center justify-between border p-3 rounded"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        req.sender.profilePicture
                                            ? `http://localhost:5000${req.sender.profilePicture}`
                                            : 'https://placehold.co/50'
                                    }
                                    alt={req.sender.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <Link
                                    to={`/profile/${req.sender.username}`}
                                    className="font-semibold"
                                >
                                    {req.sender.fullName}
                                </Link>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => acceptRequest(req._id)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => declineRequest(req._id)}
                                    className="bg-gray-200 px-3 py-1 rounded"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendRequests;
