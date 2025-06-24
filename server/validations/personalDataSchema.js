import * as Yup from 'yup';

export const personalDataSchema = Yup.object().shape({
    address: Yup.string()
        .required("Address is required!"),
    city: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'City must have only letters')
        .required("City is required!"),
    province: Yup.string()
        .matches(/^[a-zA-Z]{2}$/, 'Province must have 2 characters')
        .required("Province is required!"),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{8,15}$/, 'Phone number must be between 8 and 15 digits and contain only numbers')
        .required('Phone number is required!'),
    note: Yup.string()
});