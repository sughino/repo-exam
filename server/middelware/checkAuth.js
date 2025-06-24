import jwt from 'jsonwebtoken';
import { userColl } from "../utils/collections.js";

export async function checkAuth(req, res, next) {
    try {
        const token = req.cookies.token;
        
        if(!token) {
            return res.status(401).json({
                status: 'error',
                data: {},
                message: 'Unauthorized - Missing token',
                code: 401
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Token expired',
                    code: 401
                });
            }
            
            return res.status(401).json({
                status: 'error',
                data: {},
                message: 'Invalid token',
                code: 401
            });
        }

        const user = await userColl.findOne({email: decoded.email});
        if (!user) {
            return res.status(401).json({
                status: 'error',
                data: {},
                message: 'User no longer exists',
                code: 401
            });
        }

        req.user = {
            userId: user._id,
            email: user.email,
            admin: user.admin
        };

        next();
    } catch (error) {
        console.error("Error in middleware to check auth:", error);
        res.status(500).json({ status: "error", message: "Server error", code: 500 });
    }
}