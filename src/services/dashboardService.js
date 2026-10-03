import api from './api';

const dashboardService = {
    // Get comprehensive dashboard data (defaults to current month on backend)
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default dashboardService;
