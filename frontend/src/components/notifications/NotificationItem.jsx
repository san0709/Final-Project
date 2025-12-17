import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaHeart, FaComment, FaUserPlus } from 'react-icons/fa';

const NotificationItem = ({ notification }) => {
    let icon;
    let text;

    switch (notification.type) {
        case 'like':
            icon = <FaHeart className="text-red-500" />;
            text = 'liked your post.';
            break;
        case 'comment':
            icon = <FaComment className="text-blue-500" />;
            text = 'commented on your post.';
            break;
        case 'request':
            icon = <FaUserPlus className="text-green-500" />;
            text = 'sent you a friend request.';
            break;
        default:
            icon = <FaHeart className="text-gray-500" />;
            text = 'interacted with you.';
    }

    return (
        <div className={`p-4 border-b flex items-start space-x-3 hover:bg-gray-50 transition ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}>
            <div className="pt-1">{icon}</div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <Link to={`/profile/${notification.sender.username}`} className="font-semibold text-gray-900 hover:underline">
                        {notification.sender.fullName}
                    </Link>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-gray-700 text-sm mt-1">
                    {text} {notification.post && <span className="text-gray-500 italic">"{notification.post.caption?.substring(0, 20)}..."</span>}
                </p>
            </div>
            {notification.post && notification.post.mediaUrl && (
                <img src={notification.post.mediaUrl} alt="Preview" className="w-10 h-10 object-cover rounded" />
            )}
        </div>
    );
};

export default NotificationItem;
