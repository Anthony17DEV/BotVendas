import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = () => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;