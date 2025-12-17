import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:5000/api', // 🔥 VERY IMPORTANT
    withCredentials: true,               // 🔥 MUST
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
