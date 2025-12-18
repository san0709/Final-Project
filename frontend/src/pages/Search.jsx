import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/users/search?q=${query}`);
                setUsers(data);
            } catch {
                console.error('Search failed');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [query]);

    if (!query) return <p className="text-center">Search something</p>;
    if (loading) return <p className="text-center">Searching...</p>;

    return (
        <div className="max-w-xl mx-auto bg-white p-4 rounded shadow">
            <h1 className="font-bold mb-4">Search Results</h1>

            {users.length === 0 ? (
                <p className="text-gray-500">No users found</p>
            ) : (
                <div className="space-y-3">
                    {users.map((user) => (
                        <Link
                            key={user._id}
                            to={`/profile/${user.username}`}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
                        >
                            <img
                                src={
                                    user.profilePicture
                                        ? `http://localhost:5000${user.profilePicture}`
                                        : 'https://placehold.co/40'
                                }
                                alt={user.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold">{user.fullName}</p>
                                <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
