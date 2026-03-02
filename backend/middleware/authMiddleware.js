import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Grant access to specific roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user.roles is an array of strings e.g. ['buyer', 'vendor']
        const hasRole = req.user.roles.some((role) => roles.includes(role));
        if (!hasRole) {
            return res.status(403).json({
                message: `User roles [${req.user.roles.join(', ')}] are not authorized to access this route. Requires one of: [${roles.join(', ')}]`,
            });
        }
        next();
    };
};
