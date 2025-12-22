import axios from 'axios';

// We trim the URL to prevent double-slash errors (//api)
const rawURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const API_URL = rawURL.replace(/\/$/, "");

console.log("Current API URL being used:", API_URL); // This will show up in your browser console

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
});

// Request interceptor to add Bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;