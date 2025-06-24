import { Form, Formik } from "formik";
import { InputField, PasswordField } from "../../components/inputsField";
import { Button } from "../../components/buttons";
import Text from "../../components/Text";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "styled-components";
import { Loader } from "../../components/loader";
import './DataForms.css';
import '../Login/Login.css';
import { Checkbox } from "../checkbox";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { registrationSchema } from "../../models/RegistrationModels";
import { modifySchema, modifySchemaWithPassword } from "../../models/UserSchema";

export const UserForm = ({ isOpen, onCancel, onSubmit, isError, isLoading, data, isEditing }) => {
    const theme = useContext(ThemeContext)
    const formikRef = useRef();
    const formRef = useRef(null);

    const [localError, setLocalError] = useState(false);
    const [modifyPassword, setModifyPassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(isEditing ? !!data?.admin : false);
    }, [isEditing, data]);
    
    useEffect(() => {
        setLocalError(true);
        if (formRef.current) {
            formRef.current.scrollTop = 0;
        }
    }, [isError])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(!isOpen) {
                formikRef.current?.resetForm();
                setLocalError(false);
                setModifyPassword(false);
                setIsAdmin(false);
            }
          }, 500);
        return () => clearTimeout(timeout);
    }, [isOpen])

    const schema = registrationSchema();

    const modifingSchema = modifySchema();
    const modifingSchemaWithPassword = modifySchemaWithPassword();

    const initialValues = {
        email: data?.email || "",
        name: data?.name || "",
        surname: data?.surname || "",
        password: "",
    };

    return (
        <Formik
            innerRef={formikRef}
            validationSchema={isEditing ? modifyPassword ? modifingSchemaWithPassword : modifingSchema : schema}
            initialValues={initialValues}
            enableReinitialize={true} 
            onSubmit={(values) => {
                const formData = {
                    ...values,
                    admin: isAdmin,
                    ...(isEditing && { 
                        _id: data?._id || null,
                        oldEmail: data?.email,
                        modifyPassword: modifyPassword
                     }),
                };
                formData.name = formData.name.charAt(0).toUpperCase() + formData.name.slice(1);
                formData.surname = formData.surname.charAt(0).toUpperCase() + formData.surname.slice(1);
                
                onSubmit(formData);
            }}
        >
            {({ values, setTouched, setFieldValue, errors, touched }) => (
                <Form className="form-container" ref={formRef}>
                    <div className="inner-form-container-flex col">
                        <Text variant={"h2"}>{isEditing ? "Edit user" : "Add a new user"}</Text>
                        {localError && isError?.response?.data?.message ? <Text variant={'h5'} color={theme.colors.warning}>{isError.response.data.message}</Text> : null}
                    </div>
                    
                    <div className="inner-form-container-flex col">
                        <Text variant={"subtitle"}>Tell about you</Text>
                        <div className="inner-form-container-flex row">
                            <InputField 
                                value={values.name} 
                                onChange={(e) => setFieldValue("name", e.currentTarget.value)}
                                onBlur={() => setTouched({ ...touched, name: true})}
                                isCorrect={touched.name && !errors.name} 
                                placeholder="Name"
                                name="name"
                                errorMessage={touched.name && errors.name && errors.name}
                            />
                            <InputField 
                                value={values.surname} 
                                onChange={(e) => setFieldValue("surname", e.currentTarget.value)}
                                onBlur={() => setTouched({ ...touched, surname: true})}
                                isCorrect={touched.surname && !errors.surname} 
                                placeholder="Surname"
                                name="surname"
                                errorMessage={touched.surname && errors.surname && errors.surname}
                            />
                        </div>
                    </div>

                    {!isEditing ? (
                        <div className="inner-form-container-flex col wrap">
                            <Text variant={"subtitle"}>Security data</Text>
                            <InputField 
                                value={values.email} 
                                onChange={(e) => setFieldValue("email", e.currentTarget.value)}
                                onBlur={() => setTouched({ ...touched, email: true})}
                                isCorrect={touched.email && !errors.email} 
                                placeholder="Email"
                                name="email"
                                errorMessage={touched.email && errors.email && errors.email}
                                type={"email"}
                            />
                            <PasswordField 
                                value={values.password} 
                                onChange={(e) => setFieldValue("password", e.currentTarget.value)}
                                onBlur={() => setTouched({ ...touched, password: true})}
                                isCorrect={touched.password && !errors.password} 
                                placeholder={isEditing ? "New password" : "Password"}
                                name="password"
                                errorMessage={touched.password && errors.password && errors.password}
                            />
                            <PasswordField 
                                value={values.matchingPassword} 
                                onChange={(e) => setFieldValue("matchingPassword", e.currentTarget.value)}
                                onBlur={() => setTouched({ ...touched, matchingPassword: true})}
                                isCorrect={touched.matchingPassword && !errors.matchingPassword} 
                                placeholder={isEditing ? "Repeat new password" : "Repeat password"}
                                name="matchingPassword"
                                errorMessage={touched.matchingPassword && errors.matchingPassword && errors.matchingPassword}
                            />
                        </div>
                    ) : (
                        <div className="inner-form-container-flex col wrap">
                            <Text variant={"subtitle"}>Security data</Text>
                            <InputField 
                                value={values.email} 
                                onChange={(e) => setFieldValue("email", e.currentTarget.value)}
                                onBlur={() => setTouched({ ...touched, email: true})}
                                isCorrect={touched.email && !errors.email} 
                                placeholder="Email"
                                name="email"
                                errorMessage={touched.email && errors.email && errors.email}
                                type={"email"}
                            />

                            <Checkbox isChecked={modifyPassword} size={'big'} onClick={() => {setModifyPassword(!modifyPassword)}}>Modify password?</Checkbox>
                            <motion.div 
                                initial={{ display: "none", opacity: 0, height: 0 }}
                                animate={modifyPassword ? { display: "flex", opacity: 1, height: "auto"  } : { display: "none", opacity: 0, height: 0 }}
                                transition={theme.transition.main}
                                className="inner-form-container-flex col wrap"
                            >
                                <PasswordField 
                                    value={values.oldPassword} 
                                    onChange={(e) => setFieldValue("oldPassword", e.currentTarget.value)}
                                    onBlur={() => setTouched({ ...touched, oldPassword: true })}
                                    isCorrect={touched.oldPassword && !errors.oldPassword} 
                                    placeholder="Old password"
                                    name="oldPassword"
                                    errorMessage={touched.oldPassword && errors.oldPassword && errors.oldPassword}
                                    isRequired={modifyPassword}
                                />
                                <PasswordField 
                                    value={values.password} 
                                    onChange={(e) => setFieldValue("password", e.currentTarget.value)}
                                    onBlur={() => setTouched({ ...touched, password: true})}
                                    isCorrect={touched.password && !errors.password} 
                                    placeholder={isEditing ? "New password" : "Password"}
                                    name="password"
                                    errorMessage={touched.password && errors.password && errors.password}
                                    isRequired={modifyPassword}
                                />
                                <PasswordField 
                                    value={values.matchingPassword} 
                                    onChange={(e) => setFieldValue("matchingPassword", e.currentTarget.value)}
                                    onBlur={() => setTouched({ ...touched, matchingPassword: true})}
                                    isCorrect={touched.matchingPassword && !errors.matchingPassword} 
                                    placeholder={isEditing ? "Repeat new password" : "Repeat password"}
                                    name="matchingPassword"
                                    errorMessage={touched.matchingPassword && errors.matchingPassword && errors.matchingPassword}
                                    isRequired={modifyPassword}
                                />
                            </motion.div>
                        </div>
                    )}
                    <div className="inner-form-container-flex col wrap">
                        <Text variant={"subtitle"}>User role</Text>
                        <div className="inner-form-container-flex row">
                            <div className={`login-radio-button ${!isAdmin ? 'active' : ''}`}
                                onClick={() => setIsAdmin(false)}>
                                <div className="login-radio-button-inner">
                                    <Icon name={'user'} size={24} color={!isAdmin ? theme.colors.black : theme.colors.white}/>
                                    <Text variant={"subtitle"}>User</Text>
                                </div>
                            </div>
                            <div className={`login-radio-button ${isAdmin ? 'active' : ''}`}
                                onClick={() => setIsAdmin(true)}>
                                <div className="login-radio-button-inner">
                                    <Icon name={'shield'} size={24} color={isAdmin ? theme.colors.black : theme.colors.white}/>
                                    <Text variant={"subtitle"}>Admin</Text>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="inner-form-container-flex row space">
                        <Button variant={'accent'} size={'regular'} type={"cancel"} onClick={(e) => {e.preventDefault();onCancel();}}>Cancel</Button>
                        <Loader isLoading={isLoading} color={theme.colors.white} bgColor={theme.colors.primary}>
                            <Button variant={'primary'} size={'regular'} type={"submit"}>{isEditing ? "Update" : "Submit"}</Button>
                        </Loader>
                    </div>
                </Form>
            )}
        </Formik>
    )
}