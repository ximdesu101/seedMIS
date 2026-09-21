import api from './api';

const clientService = {
    // Get all clients
    getAllClients: async () => {
        try {
            const response = await api.get('/clients');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single client by ID
    getClientById: async (id) => {
        try {
            const response = await api.get(`/clients/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new client
    createClient: async (clientData) => {
        try {
            const response = await api.post('/clients', clientData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update client
    updateClient: async (id, clientData) => {
        try {
            const response = await api.put(`/clients/${id}`, clientData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete client
    deleteClient: async (id) => {
        try {
            const response = await api.delete(`/clients/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default clientService;
