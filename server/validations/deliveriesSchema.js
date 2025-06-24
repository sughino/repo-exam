import * as Yup from 'yup';

export const deliveriesSchema = Yup.object().shape({
    withdrawalDate: Yup.string()
        .matches(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/, 'Date must be valid')
        .required("Withdrawal date is required!"),
    deliveryDate: Yup.string()
        .matches(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/, 'Date must be valid')
        .required("Delivery date is required!"),
    state: Yup.string()
        .oneOf(['Pending', 'Shipped', 'Delivered', 'Cancelled'], 'Invalid state')
        .required('State is required!'),
    keyDelivery: Yup.string()
        .required('Delivery key is required!'),
    personalDataId: Yup.string()
        .matches(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
        .required('PersonalDataId is required!'),
});