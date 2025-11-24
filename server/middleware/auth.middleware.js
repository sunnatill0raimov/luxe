import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protect = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            // Check if it's a mock admin token (base64 encoded JSON)
            try {
                const decodedToken = JSON.parse(atob(token));
                if (decodedToken.isAdmin && decodedToken.id === 'admin-user-id') {
                    // Mock admin user
                    req.user = {
                        _id: 'admin-user-id',
                        username: 'Admin',
                        phone: 'admin',
                        isAdmin: true
                    };
                    return next();
                }
            } catch (e) {
                // Not a mock token, continue with JWT verification
            }

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123')

            req.user = await User.findById(decoded.id).select('-password')

            return next()
        } catch (error) {
            console.error('Auth error:', error.message)
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            })
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        })
    }
}

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authorized as an admin'
        })
    }
}
