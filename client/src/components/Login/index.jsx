import './Login.css';
import { Form, Formik } from "formik";
import { InputField, PasswordField } from "../../components/inputsField";
import { Button } from "../../components/buttons";
import Text from "../../components/Text";
import { Loader } from "../../components/loader";
import { ThemeContext } from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import authServices from "../../services/authServices";
import { Icon } from '../../components/Icon';
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from '../../components/checkbox';
import { useUser } from "../../hooks/useUser";
import { loginSchema, registrationSchema } from '../../models/RegistrationModels';

export const Login = ({isOpen, onCancel}) => {
    const theme = useContext(ThemeContext)
    const loginRef = useRef();
    const registerRef = useRef();
    const { setUser } = useUser();

    const { verifyLogin, isLoginLoading, isLoginError } = authServices.useLogin();
    const { verifyRegister, isRegisterLoading, isRegisterError } = authServices.useRegister();

    const [localError, setLocalError] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [direction, setDirection] = useState(1);
    const [remainConnected, setRemainConnected] = useState(false);

    useEffect(() => {
        setLocalError(true);
    }, [isLoginError, isRegisterError])

    useEffect(() => {
        setLocalError(false);
        setRemainConnected(false);
        clear();
    }, [isLogin])

    useEffect(() => {
        if(isOpen) {
            setIsLogin(true);
            setIsAdmin(false);
            setLocalError(false);
            setRemainConnected(false);
            clear();
        }
    }, [isOpen])

    const handleBack = () => {
        clear();
        onCancel();  
    }

    const clear = () => {
        const timeout = setTimeout(() => {
            loginRef.current?.resetForm();
            registerRef.current?.resetForm();
        }, 500);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        clear()
        setLocalError(false);
    }, [])

    
    const loggingSchema = loginSchema();

    const loginInitialValues = {
        email: "",
        password: ""
    };

    const handleVerify = async (formData) => {
        const result = await verifyLogin(formData);
        if (result.success) {
            setLocalError(false);
            console.log(result.response.data)
            setUser(result.response.data);
            handleBack();
        }
    }


    const registerSchema = registrationSchema();

    const registerInitialValues = {
        email: "",
        name: "",
        surname: "",
        password: "",
        matchingPassword: ""
    };

    const handleRegister = async (formData) => {
        const result = await verifyRegister(formData);
        if (result.success) {
            setLocalError(false);
            setUser(result.response.data);
            handleBack();
        }
    }

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
        })
    };

    const changeForm = (toLogin) => {
        setDirection(toLogin ? -1 : 1);
        setIsLogin(toLogin);
    };

    return (
        <div className="login-wrapper">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                {isLogin ? (
                    <motion.div 
                        key="login-form"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={theme.transition.main}
                        className="login-form-container"
                    >
                        <Formik
                            innerRef={loginRef}
                            validationSchema={loggingSchema}
                            initialValues={loginInitialValues}
                            enableReinitialize={true} 
                            onSubmit={(values) => {
                                const FormData = {
                                    ...values,
                                    remainConnected: remainConnected,
                                }
                                handleVerify(FormData);
                            }}
                        >
                            {({ values, setTouched, setFieldValue, errors, touched }) => (
                                <Form className="login-form">
                                    <div className="inner-form-container-flex col center">                       
                                        <div className="login-text-wrapper">
                                            <Text variant={"h2"}>Login</Text>
                                            <div className="turn-back-login-button">
                                                <Button onlyicon={true} size={'big'} noBorder={true} iconName={'arrow-left-from-line'} onClick={(e) => {e.preventDefault();handleBack();}}/>
                                            </div>
                                        </div>
                                        {localError && isLoginError ? <Text variant={'h5'} color={theme.colors.warning}>{isLoginError.response?.data?.message || isLoginError.message}</Text> : null}
                                    </div>
                                    
                                    <div className="inner-form-container-flex col">
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
                                            placeholder="Password"
                                            name="password"
                                            errorMessage={touched.password && errors.password && errors.password}
                                        />
                                        <Checkbox isChecked={remainConnected} size={'big'} onClick={() => {setRemainConnected(!remainConnected)}}>remain connected</Checkbox>
                                        <div className="inner-form-container-flex row center">
                                            <Text variant={"subtitle"} color={theme.colors.white80}>Not registered yet?</Text>
                                            <Text variant={"subtitle"} className={'clickable-login-text'} onClick={(e) => {e.preventDefault();changeForm(false);}}>Click here</Text>
                                        </div>
                                    </div>

                                    <div className="inner-form-container-flex row right">
                                        <Loader isLoading={isLoginLoading} color={theme.colors.white} bgColor={theme.colors.primary}>
                                            <Button variant={'primary'} size={'regular'} type={"submit"}>Submit</Button>
                                        </Loader>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                ):(
                    <motion.div 
                        key="register-form"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={theme.transition.main}
                        className="login-form-container"
                    >
                        <Formik
                            innerRef={registerRef}
                            validationSchema={registerSchema}
                            initialValues={registerInitialValues}
                            enableReinitialize={true} 
                            onSubmit={(values) => {
                                const formData = {
                                    ...values,
                                    admin: isAdmin,
                                }
                                formData.name = formData.name.charAt(0).toUpperCase() + formData.name.slice(1);
                                formData.surname = formData.surname.charAt(0).toUpperCase() + formData.surname.slice(1);
                                handleRegister(formData);
                            }}
                        >
                            {({ values, setTouched, setFieldValue, errors, touched }) => (
                                <Form className="login-form register-form">
                                    <div className="inner-form-container-flex col center"> 
                                        <div className="login-text-wrapper">
                                            <Text variant={"h2"}>Register</Text>
                                            <div className="turn-back-login-button">
                                                <Button onlyicon={true} noBorder={true} size={'big'} iconName={'arrow-left-from-line'} onClick={(e) => {e.preventDefault();handleBack();}}/>
                                            </div>
                                        </div>
                                        {localError && isRegisterError?.response?.data?.message ? <Text variant={'h5'} color={theme.colors.warning}>{isRegisterError.response.data.message}</Text> : null}
                                    </div>
                                    
                                    <div className="inner-form-container-flex col">
                                        <Text variant={"subtitle"}>Insert your data</Text>
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
                                        <PasswordField 
                                            value={values.password} 
                                            onChange={(e) => setFieldValue("password", e.currentTarget.value)}
                                            onBlur={() => setTouched({ ...touched, password: true})}
                                            isCorrect={touched.password && !errors.password} 
                                            placeholder="Password"
                                            name="password"
                                            errorMessage={touched.password && errors.password && errors.password}
                                        />
                                        <PasswordField 
                                            value={values.matchingPassword} 
                                            onChange={(e) => setFieldValue("matchingPassword", e.currentTarget.value)}
                                            onBlur={() => setTouched({ ...touched, matchingPassword: true})}
                                            isCorrect={touched.matchingPassword && !errors.matchingPassword} 
                                            placeholder="Repeat password"
                                            name="matchingPassword"
                                            errorMessage={touched.matchingPassword && errors.matchingPassword && errors.matchingPassword}
                                        />
                                    </div>
                                    <div className="inner-form-container-flex col">
                                        <Text variant={"subtitle"}>Choose your role</Text>

                                        <div className="inner-form-container-flex row">
                                            <div className={`login-radio-button ${!isAdmin && 'active'}`}
                                                onClick={() => setIsAdmin(false)}>
                                                <div className="login-radio-button-inner">
                                                    <Icon name={'user'} size={24} color={!isAdmin ? theme.colors.black : theme.colors.white}/>
                                                    <Text variant={"subtitle"}>User</Text>
                                                </div>
                                            </div>
                                            <div className={`login-radio-button ${isAdmin && 'active'}`}
                                                onClick={() => setIsAdmin(true)}>
                                                <div className="login-radio-button-inner">
                                                    <Icon name={'shield'} size={24} color={isAdmin ? theme.colors.black : theme.colors.white}/>
                                                    <Text variant={"subtitle"}>Admin</Text>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="inner-form-container-flex row center">
                                            <Text variant={"subtitle"} color={theme.colors.white80}>Alredy registered?</Text>
                                            <Text variant={"subtitle"} className={'clickable-login-text'} onClick={(e) => {e.preventDefault();changeForm(true);}}>Click here</Text>
                                        </div>
                                    </div>

                                    <div className="inner-form-container-flex row right">
                                        <Loader isLoading={isRegisterLoading} color={theme.colors.white} bgColor={theme.colors.primary}>
                                            <Button variant={'primary'} size={'regular'} type={"submit"}>Submit</Button>
                                        </Loader>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}