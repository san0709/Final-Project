import axios from 'axios';


const api = axios.create({
    baseURL: 'https://zenchat-social-app.onrender.com/api',
    withCredentials: true,
});



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
