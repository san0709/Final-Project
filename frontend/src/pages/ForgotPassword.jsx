import { useState } from 'react';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('Reset link sent to your email');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            setMessage('');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <form
                onSubmit={submitHandler}
                className="bg-white p-6 rounded shadow w-full max-w-md"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

                {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

                <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
