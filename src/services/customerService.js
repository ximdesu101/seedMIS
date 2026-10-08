import api from './api';

const customerService = {
    // Get next customer ID
    getNextCustomerId: async () => {
        try {
            const response = await api.get('/customers/next-customer-id');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all customers
    getAllCustomers: async () => {
        try {
            const response = await api.get('/customers');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single customer by ID
    getCustomerById: async (id) => {
        try {
            const response = await api.get(`/customers/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new customer
    createCustomer: async (customerData) => {
        try {
            const response = await api.post('/customers', customerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update customer
    updateCustomer: async (id, customerData) => {
        try {
            const response = await api.put(`/customers/${id}`, customerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete customer
    deleteCustomer: async (id) => {
        try {
            const response = await api.delete(`/customers/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Upgrade customer to client
    upgradeToClient: async (id) => {
        try {
            const response = await api.post(`/customers/${id}/upgrade-to-client`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default customerService;
