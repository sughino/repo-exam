import appError from "../utils/appError.js";
import { ObjectId } from 'mongodb';
import { userColl, itemColl, otherItemColl } from "../utils/collections.js";
import { invalidateCache } from "../middelware/cache.js";

export async function deleteUser(req, res, next) {
    try {  
        const userData = req.body;

        try {
            await userColl.deleteOne({ _id: new ObjectId(userData._id)});
        } catch (error) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: 'User not found',
                code: 404
            });
        }

        invalidateCache('user');

        const io = req.app.get('io');
        io.emit('user-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'User deleted successfully',
            code: 201
        });
        
    } catch (error) {
        console.error(error);
        return next(new appError('Error deleting user', 500));
    }
}

export async function deleteItem(req, res, next) {
    try {  
        const itemData = req.body;

        try {
            await itemColl.deleteOne({ _id: new ObjectId(itemData._id)});
        } catch (error) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: 'Request not found',
                code: 404
            });
        }

        invalidateCache('item');

        const io = req.app.get('io');
        io.emit('item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'Request deleted successfully',
            code: 201
        });
        
    } catch (error) {
        console.error(error);
        return next(new appError('Error deleting user', 500));
    }
}
/*export async function deletePersonalData(req, res, next) {
    try {
        const serialBody = req.body.id;
        const existingSerial = await personalDataColl.findOne({ email: serialBody });
        if (!existingSerial) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: 'User not found',
                code: 404
            });
        }
        
        await personalDataColl.deleteOne({email: serialBody})

        invalidateCache('personalData');

        const io = req.app.get('io');
        io.emit('personalData-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'Personal data deleted successfully',
            code: 201
        });
        
    } catch (error) {
        console.error(error);
        return next(new appError('Error deleting personal data', 500));
    }
}

export async function deleteDalivery(req, res, next) {
    try {
        const serialBody = req.body.id;
        const existingSerial = await deliveryColl.findOne({ keyDelivery: serialBody });
        if (!existingSerial) {
            return res.status(404).json({
                status: 'error',
                data: {},
                message: 'Delivery not found',
                code: 404
            });
        }
        
        await deliveryColl.deleteOne({keyDelivery: serialBody})

        invalidateCache('delivery');

        const io = req.app.get('io');
        io.emit('delivery-item');

        res.status(201).json({
            status: 'success',
            data: {},
            message: 'Delivery deleted successfully',
            code: 201
        });
        
    } catch (error) {
        console.error(error);
        return next(new appError('Error deleting delivery', 500));
    }
}*/