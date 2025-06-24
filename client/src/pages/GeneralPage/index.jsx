import { useRef, useContext, useState, useEffect } from "react";
import { ThemeContext } from 'styled-components';
import { Button } from "../../components/buttons";
import { InputField, DateField } from "../../components/inputsField";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import Text from "../../components/Text";
import searchService from "../../services/SearchDelivery";
import { Loader } from "../../components/loader";
import { DeliveryCard } from "../../components/SpotlightCard";
import { FadeIn } from "../../components/FadeIn";
import { Login } from "../../components/Login";
import { Modal } from "../../components/modal";
import { useUser } from "../../hooks/useUser";
import { FloatingModalRoutes, ModalRoutes } from "../../components/modalRoutes";
import { useRoutes } from "../../context/RoutesContext";
import { parse, isValid, isAfter, isBefore, subYears, addYears } from 'date-fns';
import { dateFieldSchema } from "../../models/DateModels";
import "./GeneralPage.css";
import '../../components/DataForms/DataForms.css';

export const GeneralPage = () => {
    const theme = useContext(ThemeContext);
    const routes = useRoutes();
    const { user } = useUser();
    const formikRef = useRef();
    const pageRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFloating, setIsFloating] = useState(false);

    const [localError, setLocalError] = useState(false);
    const [localDelivery, setLocalDelivery] = useState(null);

    const { searchDelivery, isSearchLoading, isSearchError } = searchService.useSearch();

    const clear = () => {
        if (pageRef.current) {
            pageRef.current.scrollTop = 0;
        }
        setLocalDelivery(null);
        setLocalError(false);
        formikRef.current?.resetForm();
    }

    useEffect(() => {
        setLocalError(true);
    }, [isSearchError])

    useEffect(() => {
        if (pageRef.current && localDelivery) {
            pageRef.current.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }       
    }, [localDelivery])

    const handleSearch = async (values) => {
        const result = await searchDelivery(values.keyDelivery, values.withdrawalDate);
        if(result.success) {
            setLocalDelivery(result.response);
        }
    }

    const generalSchema = object({
        keyDelivery: string()
            .required("Required!"),
        withdrawalDate: dateFieldSchema(),
    });//TODO sia nel beck che nel front crea dei folder per i modals e inserisci gli schemi che ti servono
    const initialValues = {
        keyDelivery: "",
        withdrawalDate: "",
    };

    return (
        <>
            <FloatingModalRoutes routes={routes} user={user} isOpen={isFloating} openLoginModal={() => {setIsModalOpen(true)}} closeFloating={() => {setIsFloating(false)}}/>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Login isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)}/> 
            </Modal>
        
            <div className="hero-wrapper" ref={pageRef}>
                <div className="hero-page-fixed-button-container">
                    <ModalRoutes routes={routes} user={user} onClick={() => {setIsFloating(true)}} isOpen={isFloating}/>
                </div>
                <Formik
                    innerRef={formikRef}
                    validationSchema={generalSchema}
                    initialValues={initialValues}
                    enableReinitialize={true} 
                    onSubmit={(values) => {
                        handleSearch(values);
                    }}
                >
                    {({ values, setTouched, setFieldValue, errors, touched }) => (
                        <Form className={`hero-container form ${localDelivery ? '' : 'notSearched'}`}>
                            <div className="inner-form-container-flex col hero-form-text">
                                <Text variant={"h2"}>Search for a delivery</Text>
                                {localError && isSearchError ? <Text variant={'h5'} color={theme.colors.warning}>{isSearchError.response?.data?.message || isSearchError.message}</Text> : null}
                            </div>
                            
                            <div className="inner-form-container-flex col">
                                <div className="inner-form-container-flex col wrap">
                                    <InputField 
                                        value={values.keyDelivery} 
                                        onChange={(e) => setFieldValue("keyDelivery", e.currentTarget.value)}
                                        onBlur={() => setTouched({ ...touched, keyDelivery: true})}
                                        isCorrect={touched.keyDelivery && !errors.keyDelivery} 
                                        placeholder="Delivery key"
                                        name="keyDelivery"
                                        errorMessage={touched.keyDelivery && errors.keyDelivery && errors.keyDelivery}
                                    />
                                    <DateField 
                                        value={values.withdrawalDate} 
                                        onChange={(value) => setFieldValue("withdrawalDate", value)}
                                        onBlur={() => setTouched({ ...touched, withdrawalDate: true})}
                                        isCorrect={touched.withdrawalDate && !errors.withdrawalDate} 
                                        placeholder="Withdrawal date"
                                        name="withdrawalDate"
                                        errorMessage={touched.withdrawalDate && errors.withdrawalDate && errors.withdrawalDate}
                                    />
                                </div>
                            </div>

                            <div className="inner-form-container-flex row space">
                                <Button variant={'accent'} size={'regular'} type={"cancel"} onClick={(e) => {e.preventDefault();clear()}}>Reset</Button>
                                <Loader isLoading={isSearchLoading} color={theme.colors.white} bgColor={theme.colors.primary}>
                                    <Button variant={'primary'} size={'regular'} type={"submit"}>Search</Button>
                                </Loader>
                            </div>
                        </Form>
                    )}
                </Formik>  
                {localDelivery ?
                    <FadeIn>
                        <div className="hero-container result">
                            <DeliveryCard
                                keyDelivery={localDelivery?.keyDelivery}
                                withdrawalDate={localDelivery?.withdrawalDate}
                                deliveryDate={localDelivery?.deliveryDate}
                                state={localDelivery?.state}
                                address={localDelivery?.personalData?.address}
                                city={localDelivery?.personalData?.city}
                                province={localDelivery?.personalData?.province}
                                phoneNumber={localDelivery?.personalData?.phoneNumber}
                                note={localDelivery?.personalData?.note}
                            />
                        </div>
                    </FadeIn>
                : null}
            </div>
        </>
    )
}

export default GeneralPage;