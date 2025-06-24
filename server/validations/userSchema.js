import * as Yup from 'yup';

export const userSchema = Yup.object().shape({
    email: Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
        .required("Email is required!"),
    name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ\s'-]+$/, 'Name can only contain letters')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
        .required('Name is required!'),
    surname: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ\s'-]+$/, 'Surname can only contain letters')
        .min(2, 'Surname must be at least 2 characters')
        .max(50, 'Surname must be at most 50 characters')
        .required('Surname is required!'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .required('Password is required!'),
    admin: Yup.boolean()
        .required("Admin is required!"),
});

export const modifingUserSchema = Yup.object().shape({
    oldEmail : Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
        .required("Email is required!"),
    email: Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
        .required("Email is required!"),
    name: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'Name must have only letters')
        .required("Required!"),
    surname: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'Surname must have only letters')
        .required("Required!"),
    admin: Yup.boolean()
        .required("Admin is required!"),
});
export const modifingPasswordUserSchema = Yup.object().shape({
    oldEmail : Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
        .required("Email is required!"),
    email: Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid')
        .required("Email is required!"),
    name: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'Name must have only letters')
        .required("Required!"),
    surname: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'Surname must have only letters')
        .required("Required!"),
    admin: Yup.boolean()
        .required("Admin is required!"),
    oldPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .required('Required!'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .notOneOf([Yup.ref('oldPassword')], 'The new password must be different from the old one')
        .required('Required!'),
});