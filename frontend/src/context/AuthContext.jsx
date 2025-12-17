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
                // Not logged in
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });

        // We only returned basic info in login response, 
        // but the cookie is set. Let's fetch full profile or just use what we have.
        // Login response: { _id, name, email }
        // Ideally we want the same shape as profile/me.
        // Let's refetch profile to be safe and consistent

        try {
            const profileRes = await api.get('/users/profile/me');
            setUser(profileRes.data);
        } catch {
            setUser(data); // Fallback
        }

        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);

        try {
            const profileRes = await api.get('/users/profile/me');
            setUser(profileRes.data);
        } catch {
            setUser(data);
        }
        return data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    const updateProfile = (updatedUser) => {
        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
