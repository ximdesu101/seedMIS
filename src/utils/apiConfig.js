// Centralized API configuration
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = isProduction 
    ? 'https://seedmis-server-production.up.railway.app'
    : 'http://localhost:8000';

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${API_BASE_URL}/${imagePath}`;
};

export const getApiUrl = (endpoint) => {
    return `${API_BASE_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
