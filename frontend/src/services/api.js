import axios from 'axios';

// In production, set VITE_API_URL env var. In dev, it falls back to proxyor hardcoded localhost if needed.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL,
    withCredentials: true, // Important for cookies (JWT)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle parsing error messages
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message;
        return Promise.reject(message);
    }
);

export default api;
