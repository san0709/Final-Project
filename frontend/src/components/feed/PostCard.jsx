import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaRegComment, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentBox from './CommentBox';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]); // Fetch on toggle
    const [commentsCount, setCommentsCount] = useState(post.commentsCount);

    // Optimistic UI Update
    const handleLike = async () => {
        const previousLikes = likes;
        const previousIsLiked = isLiked;

        if (isLiked) {
            setLikes(likes.filter(id => id !== user._id));
            setIsLiked(false);
        } else {
            setLikes([...likes, user._id]);
            setIsLiked(true);
        }

        try {
            await api.put(`/posts/${post._id}/like`);
            // Could sync with server response here to be safe
        } catch (error) {
            // Revert on error
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
            console.error("Like failed", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to={`/profile/${post.user.username}`}>
                        {post.user.profilePicture ? (
                            <img src={post.user.profilePicture} alt={post.user.username} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                {post.user.fullName.charAt(0)}
                            </div>
                        )}
                    </Link>
                    <div className="ml-3">
                        <Link to={`/profile/${post.user.username}`} className="font-semibold text-gray-900 hover:underline">
                            {post.user.fullName}
                        </Link>
                        <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </div>
                    </div>
                </div>
                {/* Dropdown for Edit/Delete could go here */}
            </div>

            <div className="px-4 pb-2">
                {post.caption && <p className="text-gray-800 whitespace-pre-wrap">{post.caption}</p>}
            </div>

            {post.mediaUrl && post.mediaType !== 'none' && (
                <div className="mt-2">
                    {post.mediaType === 'image' ? (
                        <img src={post.mediaUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                    ) : (
                        <video src={post.mediaUrl} controls className="w-full max-h-[500px]" />
                    )}
                </div>
            )}

            <div className="px-4 py-2 border-t flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center space-x-1">
                    <FaHeart className="text-red-500" />
                    <span>{likes.length}</span>
                </div>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => setShowComments(!showComments)}>
                    <span>{commentsCount} comments</span>
                </div>
            </div>

            <div className="border-t px-4 py-2 flex justify-around">
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
                >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>Like</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition text-gray-600"
                >
                    <FaRegComment />
                    <span>Comment</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition text-gray-600">
                    <FaShare />
                    <span>Share</span>
                </button>
            </div>

            {showComments && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                    <CommentBox
                        postId={post._id}
                        onCommentAdded={(newComment) => {
                            setComments([...comments, newComment]);
                            setCommentsCount(commentsCount + 1);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default PostCard;
