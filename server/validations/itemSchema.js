import * as Yup from 'yup';

export const itemSchema = Yup.object().shape({
    category: Yup.string()
        .required("category is required!"),
    description: Yup.string()
        .required("Description is required")
        .min(3, "Description must be at least 3 characters"),
    unitCost: Yup.number()
        .typeError("Unit cost must be a number")
        .required("Unit cost is required")
        .positive("Unit cost must be greater than 0"),
    quantity: Yup.number()
        .typeError("Quantity must be a number")
        .required("Quantity is required")
        .integer("Quantity must be an integer")
        .positive("Quantity must be greater than 0"),
    justification: Yup.string()
        .required("Justification is required")
        .min(5, "Justification must be at least 5 characters"),
});