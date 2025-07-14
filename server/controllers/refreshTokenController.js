import jwt from 'jsonwebtoken';
import { userColl } from "../utils/collections.js";
import appError from "../utils/appError.js";
import { generateToken } from '../utils/generateToken.js';
import { maskEmail } from '../utils/maskEmail.js';

export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided',
                code: 401
            });
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid or expired token',
                    code: 401
                });
            }

            const user = await userColl.findOne({ email: decoded.email });
            if (!user) {
                res.clearCookie("token");
                res.clearCookie("refreshToken");
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                    code: 404
                });
            }

            const newToken = generateToken(user);
            res.cookie('token', newToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 1000 * 60 * 30,
            });

            res.status(200).json({
                status: 'success',
                message: 'Token refreshed successfully',
                code: 200
            });
        });
    } catch (error) {
        return next(new appError('Error refreshing token', 500));
    }
}

export async function me(req, res) {
    const { email } = req.user;
  
    const user = await userColl.findOne({email: email});
    if (!user) {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
            code: 404,
        });
    }

    return res.json({
        status: 'success',
        data: {
            email: maskEmail(user.email),
            name: user.name,
            surname: user.surname,
            admin: user.admin            
        },
        message: 'User data retrieved successfully',
        code: 200,
    });
}