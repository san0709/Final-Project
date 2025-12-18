import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaUser, FaBell, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { FaUserFriends } from 'react-icons/fa';



const Navbar = () => {
    const { user, logout } = useAuth();
    console.log('NAVBAR USER:', user);

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [requestCount, setRequestCount] = useState(0);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const { data } = await api.get('/users/friend-requests');
                setRequestCount(data.length);
            } catch (err) {
                // Silent fail – happens on initial load / no auth / no requests
                setRequestCount(0);
            }
        };

        if (user) {
            fetchFriendRequests();
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${search}`);
            setSearch('');
        }
    };

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            SocialApp
                        </Link>
                        {user && (
                            <form onSubmit={handleSearch} className="ml-4">
                                <div className="relative text-gray-400 focus-within:text-gray-600">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <FaSearch />
                                    </span>
                                    <input
                                        type="text"
                                        className="py-2 pl-10 text-sm text-gray-900 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </form>
                        )}
                    </div>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition">
                                <FaHome size={20} />
                            </Link>
                            <Link to="/notifications" className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition relative">
                                <FaBell size={20} />
                                {/* Notification Badge could go here */}
                            </Link>
                            <Link
                                to="/friend-requests"
                                className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition"
                                title="Friend Requests"
                            >
                                <FaUserFriends size={20} />
                            </Link>

                            <Link to={`/profile/${user.username}`} className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition">
                                {user.profilePicture ? (
                                    <img
                                        src={`http://localhost:5000${user.profilePicture}`}
                                        alt="Profile"
                                        className="w-6 h-6 rounded-full object-cover"
                                    />

                                ) : (
                                    <FaUser size={20} />
                                )}
                            </Link>
                            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition">
                                <FaSignOutAlt size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
