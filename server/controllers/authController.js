import appError from "../utils/appError.js";
import { userColl } from "../utils/collections.js";
import bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import { userSchema } from "../validations/userSchema.js";
import { maskEmail } from "../utils/maskEmail.js";
import { format } from "date-fns";

const isProd = process.env.NODE_ENV === 'production';

export async function login(req, res, next) {
    try {
        const userData = req.body;

        const existingUser = await userColl.findOne({ email: userData.email });
        if (!existingUser) {
            return res.status(401).json({
                status: 'error',
                data: {},
                message: 'Incorrect email or password',
                code: 401
            });
        }

        const isPasswordMatch = await bcrypt.compare(userData.password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 'error',
                data: {},
                message: 'Incorrect email or password',
                code: 401
            });
        }

        const tokenPayload = {
            userId: existingUser._id,
            email: existingUser.email,
            admin: existingUser.admin
        };

        const token = generateToken(tokenPayload);
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 1000 * 60 * 30,
        });

        const refreshToken = generateRefreshToken(tokenPayload, userData.remainConnected);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: userData.remainConnected ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 30,
        });

        res.status(200).json({
            status: 'success',
            data: {
                email: maskEmail(existingUser.email),
                name: existingUser.name,
                surname: existingUser.surname,
                regDate: format(existingUser.regDate, 'yyyy/MM/dd'),
                admin: existingUser.admin
            },
            message: 'Login successful',
            code: 200
        });
    } catch (error) {
        console.error(error);
        return next(new appError('Error logging in', 500));
    }
}

export async function register(req, res, next) {
    try {
        const userData = req.body;

        try {
            await userSchema.validate(userData, { abortEarly: false });
        } catch (validationError) {
            return res.status(400).json({
                status: 'error',
                errors: validationError.errors
            });
        }

        const existingMail = await userColl.findOne({ email: userData.email.toLowerCase() });
        if (existingMail) {
            return res.status(409).json({
                status: 'error',
                data: {},
                message: 'User already exists',
                code: 409
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const newUser = {
            email: userData.email.toLowerCase(),
            name: userData.name,
            surname: userData.surname,
            password: hashedPassword,
            regDate: new Date(),
            admin: userData.admin || false,
        };
        
        await userColl.insertOne(newUser);

        const tokenPayload = {
            userId: newUser._id,
            email: newUser.email,
            admin: newUser.admin
        };
        
        const token = generateToken(tokenPayload);
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 1000 * 60 * 60 * 24
        });
        const refreshToken = generateRefreshToken(tokenPayload, false);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 1000 * 60 * 60 * 30,
        });

        const io = req.app.get('io');
        io.emit('user-item');

        res.status(201).json({
            status: 'success',
            data: {
                email: maskEmail(newUser.email),
                name: newUser.name,
                surname: newUser.surname,
                regDate: newUser.regDate,
                admin: newUser.admin 
            },
            message: 'User registered successfully',
            code: 201
        });
    } catch (error) {
        console.error(error);
        return next(new appError('Error during registration', 500));
    }
}