import appError from "../utils/appError.js";
import * as Yup from "yup";
import { deliveryColl, personalDataColl } from "../utils/collections.js";
import { addDays, parse, startOfDay, format } from "date-fns";

const options = {
    projection: {_id: 0},
};

const userSchema = Yup.object().shape({
    keydelivery: Yup.string()
        .required("Required!"),
    withdrawaldate: Yup.string()
        .matches(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/, "Date must be valid")
        .required("Required!"),
});

export async function getDelivery(req, res, next) {
    try {
        const { keydelivery, withdrawaldate } = req.query;
        const userData = { keydelivery, withdrawaldate };

        try {
            await userSchema.validate(userData, { abortEarly: false });
        } catch (validationError) {
            return res.status(400).json({
                status: "error",
                errors: validationError.errors,
            });
        }

        const startDate = parse(withdrawaldate, "yyyy/MM/dd", startOfDay(new Date()));
        const endDate = addDays(startDate, 1);

        const deliveryData = await deliveryColl.findOne(
            { 
                keyDelivery: keydelivery, 
                withdrawalDate: {
                    $gte: startDate,
                    $lt: endDate
                }
            }, options
        );
        if (!deliveryData) {
            return res.status(404).json({
                status: "error",
                data: {},
                message: "Delivery not found",
                code: 404,
            });
        }

        const personalData = await personalDataColl.findOne(
            { _id: deliveryData.personalDataId }, 
            options
        );
        if (!personalData) {
            return res.status(404).json({
                status: "error",
                data: {},
                message: "Personal data not found",
                code: 404,
            });
        }

        const result = {
            ...deliveryData,
            withdrawalDate: format(deliveryData.withdrawalDate, 'yyyy-MM-dd'),
            deliveryDate: format(deliveryData.deliveryDate, 'yyyy-MM-dd'),
            personalData: personalData
        };
        delete result.personalDataId;

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return next(new appError("Error fetching delivery", 500));
    }
}