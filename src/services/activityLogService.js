import api from './api';

const activityLogService = {
    // Get paginated activity logs
    getLogs: async (page = 1, perPage = 10, filters = {}) => {
        try {
            // Get logged-in user info
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userType = localStorage.getItem('userType');

            const params = {
                page,
                per_page: perPage,
                logged_user_id: user?.id || null,
                logged_user_type: userType || null,
                ...filters
            };
            const response = await api.get('/activity-logs', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get activity log statistics
    getStatistics: async () => {
        try {
            // Get logged-in user info
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userType = localStorage.getItem('userType');

            const params = {
                logged_user_id: user?.id || null,
                logged_user_type: userType || null,
            };
            const response = await api.get('/activity-logs/statistics', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default activityLogService;
