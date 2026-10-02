import api from './api';

const requestService = {
    // Get available seedlings for request form
    getAvailableSeedlings: async () => {
        try {
            const response = await api.get('/requests/available-seedlings');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Search users (clients) for the request form
    searchUsers: async (query) => {
        try {
            const response = await api.get('/users/search', {
                params: { query }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all requests
    getAllRequests: async () => {
        try {
            const response = await api.get('/requests');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single request by ID
    getRequestById: async (id) => {
        try {
            const response = await api.get(`/requests/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new request
    createRequest: async (requestData) => {
        try {
            const response = await api.post('/requests', requestData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update request
    updateRequest: async (id, requestData) => {
        try {
            const response = await api.put(`/requests/${id}`, requestData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete request
    deleteRequest: async (id) => {
        try {
            const response = await api.delete(`/requests/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get request metrics
    getMetrics: async () => {
        try {
            const response = await api.get('/requests/metrics');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get monthly total sales (sum of total_price for Released requests in current month)
    getMonthlySales: async () => {
        try {
            const response = await api.get('/requests/monthly-sales');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default requestService;
