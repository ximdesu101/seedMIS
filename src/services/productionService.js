import api from './api';

const productionService = {
    // Get production metrics
    getMetrics: async () => {
        try {
            const response = await api.get('/productions/metrics');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all production batches
    getAllProductions: async () => {
        try {
            const response = await api.get('/productions');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single production by ID
    getProductionById: async (id) => {
        try {
            const response = await api.get(`/productions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new production batch with image
    createProduction: async (productionData) => {
        try {
            const formData = new FormData();
            
            // Append all fields to FormData
            Object.keys(productionData).forEach(key => {
                if (productionData[key] !== null && productionData[key] !== undefined) {
                    formData.append(key, productionData[key]);
                }
            });

            const response = await api.post('/productions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update production batch
    updateProduction: async (id, productionData) => {
        try {
            const formData = new FormData();
            
            // Append all fields to FormData
            Object.keys(productionData).forEach(key => {
                if (productionData[key] !== null && productionData[key] !== undefined) {
                    formData.append(key, productionData[key]);
                }
            });

            // Laravel doesn't support PUT with FormData directly, so we use POST with _method
            formData.append('_method', 'PUT');

            const response = await api.post(`/productions/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update production stage
    updateStage: async (id, stageData) => {
        try {
            const response = await api.post(`/productions/${id}/update-stage`, stageData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Transfer to inventory
    transferToInventory: async (id, transferData = {}) => {
        try {
            const response = await api.post(`/productions/${id}/transfer-to-inventory`, transferData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete production batch
    deleteProduction: async (id) => {
        try {
            const response = await api.delete(`/productions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get production history
    getProductionHistory: async (id) => {
        try {
            const response = await api.get(`/productions/${id}/history`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all production history across all batches
    getAllProductionHistory: async () => {
        try {
            const response = await api.get('/productions/history');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default productionService;
