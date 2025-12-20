import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaRegHeart,
    FaHeart,
    FaRegComment,
    FaShare,
    FaEdit,
    FaTrash,
    FaEllipsisH,
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import api, { API_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentBox from './CommentBox';

const PostCard = ({ post }) => {
    const { user } = useAuth();

    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount);

    // Post edit
    const isOwner = user?._id === post.user._id;
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCaption, setEditedCaption] = useState(post.caption);

    // Comment edit
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    /* ---------------- POST ACTIONS ---------------- */

    const handleLike = async () => {
        const prevLikes = likes;
        const prevIsLiked = isLiked;

        if (isLiked) {
            setLikes(likes.filter((id) => id !== user._id));
            setIsLiked(false);
        } else {
            setLikes([...likes, user._id]);
            setIsLiked(true);
        }

        try {
            await api.put(`/posts/${post._id}/like`);
        } catch {
            setLikes(prevLikes);
            setIsLiked(prevIsLiked);
        }
    };

    const handleEditPost = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleUpdatePost = async () => {
        try {
            const { data } = await api.put(`/posts/${post._id}`, {
                caption: editedCaption,
            });
            post.caption = data.caption;
            setIsEditing(false);
        } catch {
            alert('Failed to update post');
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await api.delete(`/posts/${post._id}`);
            window.location.reload();
        } catch {
            alert('Failed to delete post');
        }
    };

    /* ---------------- COMMENTS ---------------- */

    const fetchComments = async () => {
        const { data } = await api.get(`/posts/${post._id}/comments`);
        setComments(data);
    };

    const handleCommentEdit = (comment) => {
        setEditingCommentId(comment._id);
        setEditedComment(comment.content);
    };

    const handleCommentUpdate = async (commentId) => {
        try {
            const { data } = await api.put(`/comments/${commentId}`, {
                content: editedComment,
            });
            setComments(
                comments.map((c) => (c._id === commentId ? data : c))
            );
            setEditingCommentId(null);
            setEditedComment('');
        } catch {
            alert('Failed to update comment');
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter((c) => c._id !== commentId));
            setCommentsCount((c) => c - 1);
        } catch {
            alert('Failed to delete comment');
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="bg-white rounded-lg shadow mb-6">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to={`/profile/${post.user.username}`}>
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                            {post.user.fullName.charAt(0)}
                        </div>
                    </Link>
                    <div className="ml-3">
                        <div className="font-semibold">{post.user.fullName}</div>
                        <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)}>
                            <FaEllipsisH />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 bg-white border rounded shadow">
                                <button onClick={handleEditPost} className="px-3 py-2 text-sm">
                                    <FaEdit className="inline mr-1" /> Edit
                                </button>
                                <button
                                    onClick={handleDeletePost}
                                    className="px-3 py-2 text-sm text-red-600"
                                >
                                    <FaTrash className="inline mr-1" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Caption */}
            <div className="px-4 pb-2">
                {isEditing ? (
                    <>
                        <textarea
                            value={editedCaption}
                            onChange={(e) => setEditedCaption(e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={handleUpdatePost}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-200 px-3 py-1 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    post.caption && <p>{post.caption}</p>
                )}
            </div>

            {/* Media */}
            {post.mediaUrl && (
                <div>
                    {post.mediaType === 'image' ? (
                        <img
                            src={`${API_URL}${post.mediaUrl}`}
                            className="w-full max-h-[500px] object-cover"
                        />
                    ) : (
                        <video
                            src={`${API_URL}${post.mediaUrl}`}
                            controls
                            className="w-full max-h-[500px]"
                        />
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="px-4 py-2 border-t flex justify-between text-sm text-gray-500">
                <div>
                    <FaHeart className="inline text-red-500" /> {likes.length}
                </div>
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        if (!showComments) fetchComments();
                        setShowComments(!showComments);
                    }}
                >
                    {commentsCount} comments
                </div>
            </div>

            {/* Like / Comment */}
            <div className="border-t px-4 py-2 flex justify-around">
                <button onClick={handleLike}>
                    {isLiked ? <FaHeart /> : <FaRegHeart />} Like
                </button>
                <button>
                    <FaRegComment /> Comment
                </button>
                <button>
                    <FaShare /> Share
                </button>
            </div>

            {/* Comments */}
            {showComments && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                    {comments.map((comment) => {
                        const canEdit =
                            comment.user._id === user._id ||
                            post.user._id === user._id;

                        return (
                            <div
                                key={comment._id}
                                className="flex justify-between items-start text-sm mb-2"
                            >
                                <div className="flex-1">
                                    <span className="font-semibold">
                                        {comment.user.fullName}
                                    </span>{' '}
                                    {editingCommentId === comment._id ? (
                                        <>
                                            <textarea
                                                value={editedComment}
                                                onChange={(e) => setEditedComment(e.target.value)}
                                                className="w-full border rounded p-1 mt-1"
                                            />
                                            <div className="flex gap-2 mt-1">
                                                <button
                                                    onClick={() => handleCommentUpdate(comment._id)}
                                                    className="text-blue-600 text-xs"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingCommentId(null)}
                                                    className="text-gray-500 text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <span>{comment.content}</span>
                                    )}
                                </div>

                                {canEdit && editingCommentId !== comment._id && (
                                    <div className="flex gap-2 ml-2 mt-1">
                                        <button onClick={() => handleCommentEdit(comment)}>
                                            <FaEdit size={12} />
                                        </button>
                                        <button onClick={() => handleCommentDelete(comment._id)}>
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <CommentBox
                        postId={post._id}
                        onCommentAdded={(newComment) => {
                            setComments([...comments, newComment]);
                            setCommentsCount((c) => c + 1);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default PostCard;
