import api from './api';

const targetService = {
    // Get all targets
    getAllTargets: async () => {
        try {
            const response = await api.get('/targets');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get targets with progress
    getProgress: async () => {
        try {
            const response = await api.get('/targets/progress');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create or update target
    saveTarget: async (targetData) => {
        try {
            const response = await api.post('/targets', targetData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update target
    updateTarget: async (id, targetData) => {
        try {
            const response = await api.put(`/targets/${id}`, targetData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete target
    deleteTarget: async (id) => {
        try {
            const response = await api.delete(`/targets/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get monthly target vs actual distribution
    getMonthlyTargetVsActual: async () => {
        try {
            const response = await api.get('/targets/monthly-target-vs-actual');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default targetService;
