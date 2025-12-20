import axios from 'axios';


const api = axios.create({
    baseURL: 'https://zenchat-social-app.onrender.com/api',
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

// Response interceptor to handle parsing error messages
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;
