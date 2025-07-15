import appError from "../utils/appError.js";
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { userColl, itemColl, otherItemColl } from "../utils/collections.js";
import { modifingUserSchema, modifingPasswordUserSchema, userSchema } from "../validations/userSchema.js";
import { invalidateCache } from "../middelware/cache.js";

export async function modifyUser(req, res, next) {
    try {
        const userData = req.body;
        var modifyEmail = false;
        
        try {
            if (userData.modifyPassword) {
                await modifingPasswordUserSchema.validate(userData, { abortEarly: false });
            } else {
                await modifingUserSchema.validate(userData, { abortEarly: false });
            }
        } catch (validationError) {
            return res.status(400).json({
                status: 'error',
                errors: validationError.errors
            });
        }

        console.log(userData)
        const existingUser = await userColl.findOne({ _id: new ObjectId(userData._id)});
        if (!existingUser) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: 'User not found',
                code: 404
            });
        }

        if (userData.modifyPassword) { 
            const isOldPasswordMatch = await bcrypt.compare(userData.oldPassword, existingUser.password);
            if (!isOldPasswordMatch) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Old password is incorrect',
                    code: 401
                });
            }
    
            const isPasswordMatch = await bcrypt.compare(userData.password, existingUser.password);
            if (isPasswordMatch) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Password must be different from the old one',
                    code: 401
                });
            }
        }
        
        if(userData.email !== userData.oldEmail) {
            modifyEmail = true;
            const existingMail = await userColl.findOne({ email: userData.email });
            if (existingMail) {
                return res.status(409).json({
                    status: 'error',
                    data: {},
                    message: 'User already exists',
                    code: 409
                });
            }
        }

        await userColl.updateOne(
            { _id: new ObjectId(userData._id)}, 
            { $set: {
                    email: modifyEmail ? userData.email : existingUser.email,
                    name: userData.name,
                    surname: userData.surname,
                    password: userData.modifyPassword ? await bcrypt.hash(userData.password, 10) : existingUser.password,
                    admin: userData.admin,
                }
            }
        )

        invalidateCache('user');

        const io = req.app.get('io');
        io.emit('user-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'User updated successfully',
            code: 201
        });

    } catch (error) {
        console.error(error);
        return next(new appError('Error inserting user', 500));
    }
}

export async function modifyItem(req, res, next) {
    try {
        const itemData = req.body;
        const userId = new ObjectId(req.user.userId);

        try {
            await itemSchema.validate(itemData, { abortEarly: false });
        } catch (validationError) {
            return res.status(400).json({
                status: 'error',
                errors: validationError.errors
            });
        }

        const existingCategory = await otherItemColl.findOne({ description: itemData.category });
        if (!existingCategory) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: 'Category not found',
                code: 404
            });
        }

        const result = await itemColl.updateOne(
            { _id: new ObjectId(requestId) },
            {
                $set: {
                    itemDescription: itemData.description,
                    categoryId: new ObjectId(existingCategory._id),
                    quantity: parseInt(itemData.quantity, 10),
                    unitCost: parseFloat(itemData.unitCost),
                    justification: itemData.justification,
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Request not found" });
        }

        invalidateCache('item');

        const io = req.app.get('io');
        io.emit('item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'Request inserted successfully',
            code: 201
        });

    } catch (error) {
        console.error(error);
        return next(new appError('Error inserting request', 500));
    }
}

export async function modifyOtherItem(req, res, next) {
    try {
        const approverId = new ObjectId(req.user.userId);
        const { requestId, newStatus } = req.body;

        if (!requestId || !newStatus || !["approved", "rejected"].includes(newStatus)) {
            return res.status(400).json({ error: "Invalid input" });
        }

        const result = await itemColl.updateOne(
            { _id: new ObjectId(requestId) },
            {
                $set: {
                    status: newStatus,
                    approvalDate: new Date(),
                    approverId: approverId
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Request not found" });
        }

        invalidateCache('otherItem');

        const io = req.app.get('io');
        io.emit('otherItem');

        res.status(200).json({ message: "Request status updated successfully" });
    } catch (err) {
        console.error("Error updating request status:", err);
        res.status(500).json({ error: "Database error", message: err.message });
    }
}
/*
export async function modifyPersonalData(req, res, next) {
    try {
        const userData = req.body;

        const existingpersonalData = await personalDataColl.findOne({ personalDataID: userData.personalDataID });
        if (!existingpersonalData) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: 'Personal data not found',
                code: 404
            });
        }
        
        if(userData.email !== userData.oldEmail) {
            const existingMail = await personalDataColl.findOne({ email: userData.email });
            if (existingMail) {
                return res.status(409).json({
                    status: 'error',
                    data: {},
                    message: 'Personal data already exists',
                    code: 409
                });
            }
        }
        if(userData.phone !== userData.oldPhone) {
            const existingPhone = await personalDataColl.findOne({ phoneNumber: userData.phone });
            if (existingPhone) {
                return res.status(409).json({
                    status: 'error',
                    data: {},
                    message: 'Personal data already exists',
                    code: 409
                });
            }
        }

        await personalDataColl.updateOne(
            { personalDataID: userData.personalDataID }, 
            { $set: {
                    address: userData.address,
                    city: userData.city,
                    province: userData.province,
                    phoneNumber: userData.phoneNumber,
                    email: userData.email,
                    note: userData.note
                }
            }
        )

        //!invalidateCache('personalData');

        const io = req.app.get('io');
        io.emit('personalData-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'Personal data updated successfully',
            code: 201
        });

    } catch (error) {
        console.error(error);
        return next(new appError('Error inserting user', 500));
    }
}

export async function modifyDelivery(req, res, next) {
    try {
        const userData = req.body;

        const existingDelivery = await deliveryColl.findOne({ deliveryID: userData.deliveryID });
        if (!existingDelivery) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: 'Delivery not found',
                code: 404
            });
        }
        
        if(userData.keyDelivery !== userData.oldKeyDelivery) {
            const existingKey = await personalDataColl.findOne({ keyDelivery: userData.keyDelivery });
            if (existingKey) {
                return res.status(409).json({
                    status: 'error',
                    data: {},
                    message: 'Delivery key already exists',
                    code: 409
                });
            }
        }

        await personalDataColl.updateOne(
            { personalDataID: userData.personalDataID }, 
            { $set: {
                    withdrawalDate: userData.withdrawalDate,
                    deliveryDate: userData.deliveryDate,
                    State: userData.State,
                    keyDelivery: userData.keyDelivery,
                    personalDataID: userData.personalDataID
                }
            }
        )

        invalidateCache('delivery');

        const io = req.app.get('io');
        io.emit('delivery-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'Delivery updated successfully',
            code: 201
        });

    } catch (error) {
        console.error(error);
        return next(new appError('Error inserting user', 500));
    }
}*/