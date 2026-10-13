import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    try {
        const userStr = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        // Check if both exist
        if (!userStr || !userType) {
            return <Navigate to="/login" replace />;
        }

        // Validate user is valid JSON
        const user = JSON.parse(userStr);
        
        // Check if user object has required properties
        if (!user || !user.id || !user.email) {
            // Clear invalid data
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            localStorage.removeItem('userData');
            return <Navigate to="/login" replace />;
        }

        return children;
    } catch (error) {
        // If any error occurs (like JSON parse error), clear data and redirect
        console.error('Auth validation error:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('userData');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
