import { object, string, ref as yupRef } from "yup";

export function registrationSchema() {
    return object({
        email: string()
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
            .required("Required!"),
        name: string()
            .matches(/^[A-Za-zÀ-ÿ\s'-]+$/, 'Name can only contain letters')
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name must be at most 50 characters')
            .required('Required!'),
        surname: string()
            .matches(/^[A-Za-zÀ-ÿ\s'-]+$/, 'Surname can only contain letters')
            .min(2, 'Surname must be at least 2 characters')
            .max(50, 'Surname must be at most 50 characters')
            .required('Required!'),
        password: string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .required('Required!'),
        matchingPassword: string()
            .oneOf([yupRef('password')], 'Passwords must match')
            .required('Required!'),
    });
}

export function loginSchema() {
    return object({
        email: string()
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
            .required("Required!"),
        password: string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .required('Required!'),
    });
}