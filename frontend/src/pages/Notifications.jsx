import { useState, useEffect } from 'react';
import api from '../services/api';
import NotificationItem from '../components/notifications/NotificationItem';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data.notifications);

            // Mark all as read on load? Or manually?
            // Usually users prefer manual or auto on view.
            // Let's auto mark all read for simplicity in UX, or provide a button.
            // Providing a button is explicit.
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow min-h-[500px]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Notifications</h2>
                    <button
                        onClick={markAllRead}
                        className="text-blue-600 text-sm hover:underline"
                    >
                        Mark all as read
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div>
                        {notifications.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <NotificationItem key={notification._id} notification={notification} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
