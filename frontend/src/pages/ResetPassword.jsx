import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <form
                onSubmit={submitHandler}
                className="bg-white p-6 rounded shadow w-full max-w-md"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

                <input
                    type="password"
                    placeholder="New password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
