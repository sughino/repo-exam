import appError from "../utils/appError.js";
import bcrypt from 'bcrypt';
import { userColl, personalDataColl, deliveryColl } from "../utils/collections.js";
import { userSchema } from "../validations/userSchema.js";
import { personalDataSchema } from "../validations/personalDataSchema.js";
import { deliveriesSchema } from "../validations/deliveriesSchema.js";
import { invalidateCache } from "../middelware/cache.js";

export async function insertUser(req, res, next) {
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

        await userColl.insertOne({
            email: userData.email.toLowerCase(),
            name: userData.name,
            surname: userData.surname,
            password: hashedPassword,
            regDate: new Date(),
            admin: userData.admin || false,
        });

        invalidateCache('user');

        const io = req.app.get('io');
        io.emit('user-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'User inserted successfully',
            code: 201
        });

    } catch (error) {
        console.error(error);
        return next(new appError('Error inserting user', 500));
    }
}

export async function insertPersonalData(req, res, next) {
    try {
        const userData = req.body;

        try {
            await personalDataSchema.validate(userData, { abortEarly: false });
        } catch (validationError) {
            return res.status(400).json({
                status: 'error',
                errors: validationError.errors
            });
        }

        const existingPhone = await personalDataColl.findOne({ phoneNumber: userData.phone });
        if (existingPhone) {
            return res.status(409).json({
                status: 'error',
                data: {},
                message: 'Personal data already exists',
                code: 409
            });
        }

        await personalDataColl.insertOne({
            address: userData.address,
            city: userData.city,
            province: userData.province,
            phoneNumber: userData.phoneNumber,
            note: userData.note
        });

        invalidateCache('personalData');

        const io = req.app.get('io');
        io.emit('personalData-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'Personal data inserted successfully',
            code: 201
        });

    } catch (error) {
        console.error(error);
        return next(new appError('Error inserting personal data', 500));
    }
}

export async function insertDeliveries(req, res, next) {
    try {
        const userData = req.body;

        try {
            await deliveriesSchema.validate(userData, { abortEarly: false });
        } catch (validationError) {
            return res.status(400).json({
                status: 'error',
                errors: validationError.errors
            });
        }

        const existingKey = await deliveryColl.findOne({ keyDelivery: userData.keyDelivery });
        if (existingKey) {
            return res.status(409).json({
                status: 'error',
                data: {},
                message: 'User already exists',
                code: 409
            });
        }
        const existingUser = await personalDataColl.findOne({ personalDataId: userData.personalDataId });
        if (!existingUser) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: "Personal data not found",
                code: 404
            });
        }

        await deliveryColl.insertOne({
            withdrawalDate: userData.withdrawalDate,
            deliveryDate: userData.deliveryDate,
            state: userData.state,
            keyDelivery: userData.keyDelivery,
            personalDataId: userData.personalDataId,
        });

        invalidateCache('delivery');

        const io = req.app.get('io');
        io.emit('delivery-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'Delivery inserted successfully',
            code: 201
        });

    } catch (error) {
        console.error(error);
        return next(new appError('Delivery inserting user', 500));
    }
}