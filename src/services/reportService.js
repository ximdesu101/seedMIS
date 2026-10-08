import api from './api';

const reportService = {
    // Get distribution report
    getDistributionReport: async (params = {}) => {
        try {
            const response = await api.get('/reports/distribution', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching distribution report:', error);
            throw error;
        }
    },

    // Get production report
    getProductionReport: async (params = {}) => {
        try {
            const response = await api.get('/reports/production', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching production report:', error);
            throw error;
        }
    },

    // Get inventory report
    getInventoryReport: async () => {
        try {
            const response = await api.get('/reports/inventory');
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory report:', error);
            throw error;
        }
    },

    // Get summary report
    getSummaryReport: async (params = {}) => {
        try {
            const response = await api.get('/reports/summary', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching summary report:', error);
            throw error;
        }
    },
};

export default reportService;
