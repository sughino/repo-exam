import { object, string, ref as yupRef } from "yup";

export function modifySchema() {
    return object({
        email: string()
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
            .required("Required!"),
        name: string()
            .matches(/^[a-zA-Z]+$/, 'Name must have only letters')
            .required("Required!"),
        surname: string()
            .matches(/^[a-zA-Z]+$/, 'Surname must have only letters')
            .required("Required!"),
    });
}

export function modifySchemaWithPassword() {
    return object({
        email: string()
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
            .required("Required!"),
        name: string()
            .matches(/^[a-zA-Z]+$/, 'Name must have only letters')
            .required("Required!"),
        surname: string()
            .matches(/^[a-zA-Z]+$/, 'Surname must have only letters')
            .required("Required!"),
        oldPassword: string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .required('Required!'),
        password: string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .notOneOf([yupRef('oldPassword')], 'The new password must be different from the old one')
            .required('Required!'),
        matchingPassword: string()
            .oneOf([yupRef('password')], 'Passwords must match')
            .required('Required!'),
    });
}