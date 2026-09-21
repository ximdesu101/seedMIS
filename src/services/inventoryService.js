import api from './api';

const inventoryService = {
    // Get inventory metrics
    getMetrics: async () => {
        try {
            const response = await api.get('/inventories/metrics');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all inventories
    getAllInventories: async () => {
        try {
            const response = await api.get('/inventories');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single inventory by ID
    getInventoryById: async (id) => {
        try {
            const response = await api.get(`/inventories/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get batches for inventory item
    getInventoryBatches: async (id) => {
        try {
            const response = await api.get(`/inventories/${id}/batches`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new inventory
    createInventory: async (inventoryData) => {
        try {
            const response = await api.post('/inventories', inventoryData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update inventory
    updateInventory: async (id, inventoryData) => {
        try {
            const response = await api.put(`/inventories/${id}`, inventoryData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete inventory
    deleteInventory: async (id) => {
        try {
            const response = await api.delete(`/inventories/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default inventoryService;
