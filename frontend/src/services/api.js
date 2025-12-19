import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:5000/api', // 🔥 VERY IMPORTANT
    withCredentials: true,               // 🔥 MUST
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
