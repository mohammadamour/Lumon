import { create } from 'zustand';
import axios from '../lib/axios';

const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: true,

    // Initialize the auth state by fetching user profile
    checkAuth: async () => {
        try {
            set({ isLoading: true });
            const response = await axios.get('/api/user');
            set({ user: response.data, isLoading: false });
        } catch (error) {
            set({ user: null, isLoading: false });
        }
    },

    login: async (credentials) => {
        // First get the CSRF cookie
        await axios.get('/sanctum/csrf-cookie');
        // Then perform login
        await axios.post('/api/login', credentials);
        // Then fetch the user
        await get().checkAuth();
    },

    register: async (data) => {
        await axios.post('/api/register', data);
        await get().login({ email: data.email, password: data.password });
    },

    logout: async () => {
        await axios.post('/api/logout');
        set({ user: null });
    }
}));

export default useAuthStore;
