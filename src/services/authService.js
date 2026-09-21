import api from './api';

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post('/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const response = await api.post('/verify-otp', { email, otp });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (data) => {
        try {
            const response = await api.post('/reset-password', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default authService;
