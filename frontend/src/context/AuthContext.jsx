import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const { data } = await api.get('/users/profile/me');
                setUser(data);
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error(error);
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    // 🔐 LOGIN
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            try {
                const profileRes = await api.get('/users/profile/me');
                setUser(profileRes.data);
            } catch {
                setUser(data);
            }

            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    // 📝 REGISTER
    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);

            try {
                const profileRes = await api.get('/users/profile/me');
                setUser(profileRes.data);
            } catch {
                setUser(data);
            }

            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    // 🚪 LOGOUT  ✅ CORRECT PLACE
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            setUser(null);
        }
    };

    // 👤 UPDATE PROFILE
    const updateProfile = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, updateProfile }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
