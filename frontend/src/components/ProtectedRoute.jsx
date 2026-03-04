import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && roles.length > 0) {
        const hasRole = user.roles.some((role) => roles.includes(role));
        if (!hasRole) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;

