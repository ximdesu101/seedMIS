import api from './api';

const staffService = {
    // Get all staff
    getAllStaff: async () => {
        try {
            const response = await api.get('/staff');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single staff by ID
    getStaffById: async (id) => {
        try {
            const response = await api.get(`/staff/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new staff
    createStaff: async (staffData) => {
        try {
            const response = await api.post('/staff', staffData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update staff
    updateStaff: async (id, staffData) => {
        try {
            const response = await api.put(`/staff/${id}`, staffData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete staff
    deleteStaff: async (id) => {
        try {
            const response = await api.delete(`/staff/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default staffService;
