import Text from "../Text";
import { motion } from 'framer-motion';
import "./filters.css";
import "../DataForms/DataForms.css";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "styled-components";
import { Separator } from "../Separator";
import { Select } from "../Select";
import { Button } from "../buttons";
import { dateFieldSchema } from "../../models/DateModels";
import * as yup from 'yup';
import { Form, Formik } from "formik";
import { DateField } from "../inputsField";
import { Chip } from "../Chip";
import { format } from "date-fns";

export const SettingsFilter = ({onCloseSettings, onSubmit, onCLose}) => {
    const theme = useContext(ThemeContext);

    const formikRef = useRef();
    const [reset, setReset] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [changedElement, setChangedElement] = useState({
        dateRange: false,
        role: false,
    })

    const [selectedItem ,setSelectedItem] = useState('Select');
    const filtersSelect = ['Select', 'User', 'Admin'];

    useEffect(() => {
        if (reset) {
            setTimeout(() => {
                setReset(false);
            }, 200);
        }
    }, [reset])

    useEffect(() => {
        formikRef.current?.resetForm();
        setChangedElement({
            dateRange: false,
            role: false,
        });
        setIsChanged(false);
        setReset(false);
    }, [])
    
    useEffect(() => {
        const currentValues = formikRef.current?.values;
        if (!currentValues) return;

        const isDateChanged =
            currentValues.startDate !== initialValues.startDate ||
            currentValues.endDate !== initialValues.endDate;

        const isRoleSelected = selectedItem !== 'Select';

        setChangedElement({
            dateRange: isDateChanged,
            role: isRoleSelected,
        });

        setIsChanged(isDateChanged || isRoleSelected);
    }, [formikRef.current?.values, selectedItem]);//TODO ESAME aggiungi nell'hook tutto ciò che vuoi vedere quando cambia

    //TODO sistema tutto questo codice, non cambia immediatamente il change delle date, sistema le chip

    const handleReset = () => {
        if (!isChanged) return 

        setReset(true);
        setSelectedItem('Select');
        formikRef.current?.resetForm();
        setIsChanged(false);
        setChangedElement({
            dateRange: false,
            role: false,
        });
        onSubmit({});
    }

    const handleApply = (values) => {
        console.log(values);
        onCLose();
        //if (isChanged) onSubmit({"role": selectedItem.toLocaleLowerCase()})
    }

    const filtersSchema = yup.object({
        startDate: dateFieldSchema(false, false, true),
        endDate: dateFieldSchema(false, false, true),
        }).test('both-or-none', 'Both dates must be provided together', function (values) {
            const { startDate, endDate } = values;
            const oneFilled = !!startDate || !!endDate;
            const bothFilled = !!startDate && !!endDate;
            return !oneFilled || bothFilled;
    });
    const initialValues = {
        startDate: "",
        endDate: "",
    };

    return (
        <div className="setting-filters-container">
            <div className="modal-filters-text-wrapper">
                <Button onlyicon={true} size={'big'} noBorder={true} iconName={'arrow-left-from-line'} onClick={(e) => {e.preventDefault();onCloseSettings()}}/>
                <Text variant={'h6'}>Filter</Text>
            </div>
            
            <Separator color={theme.colors.white10}/>

            <Formik
                innerRef={formikRef}
                validationSchema={filtersSchema}
                initialValues={initialValues}
                enableReinitialize={true} 
                onSubmit={(values) => {
                    handleApply(values);
                }}
            >
                {({ values, setTouched, setFieldValue, errors, touched }) => (
                    <Form className="modal-filters-form">
                        <div className="modal-filters-input-container">
                            <div className="inner-form-container-flex space vertical-center">
                                <Text variat={'subtitle'}>Date range</Text>
                                {changedElement.dateRange && (
                                    <div className="reset-text-container" onClick={() => {handleReset()}}>
                                        <Text variant={'subtitle'} color={theme.colors.warning}>Reset</Text>
                                    </div> 
                                )}
                            </div>

                            <div className="modal-filters-chip-container">
                                <Chip onClick={() => {
                                    const today = format(new Date(), 'yyyy/MM/dd');
                                    setFieldValue("startDate", today);
                                    setFieldValue("endDate", today);
                                }}>Today</Chip>
                                <Chip onClick={() => {
                                    const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy/MM/dd');
                                    setFieldValue("startDate", yesterday);
                                    setFieldValue("endDate", yesterday);
                                }}>Yesterday</Chip>
                                <Chip onClick={() => {
                                    const today = new Date();
                                    const firstDay = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy/MM/dd');
                                    const lastDay = format(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'yyyy/MM/dd');
                                    setFieldValue("startDate", firstDay);
                                    setFieldValue("endDate", lastDay);
                                }}>This Month</Chip>
                            </div>
                            
                            <div className="inner-form-container-flex row">
                                <DateField 
                                    value={values.startDate} 
                                    onChange={(value) => setFieldValue("startDate", value)}
                                    onBlur={() => setTouched({ ...touched, startDate: true})}
                                    isCorrect={touched.startDate && !errors.startDate} 
                                    placeholder="Start date"
                                    name="startDate"
                                    errorMessage={touched.startDate && errors.startDate && errors.startDate}
                                />
                                <DateField 
                                    value={values.endDate} 
                                    onChange={(value) => setFieldValue("endDate", value)}
                                    onBlur={() => setTouched({ ...touched, endDate: true})}
                                    isCorrect={touched.endDate && !errors.endDate} 
                                    placeholder="End date"
                                    name="endDate"
                                    errorMessage={touched.endDate && errors.endDate && errors.endDate}
                                />
                            </div>
                        </div>

                        <div className="modal-filters-input-container">
                            <div className="inner-form-container-flex space vertical-center">
                                <Text variat={'subtitle'}>Role</Text>
                                {changedElement.role && (
                                    <div className="reset-text-container" onClick={() => {handleReset()}}>
                                        <Text variant={'subtitle'} color={theme.colors.warning}>Reset</Text>
                                    </div> 
                                )}
                            </div>
                            <Select selectElements={filtersSelect} onSelectedItems={setSelectedItem} inputField={true} reset={reset}/>
                        </div>

                        <div className="inner-form-container-flex space">
                            <Button variant={'accent'} size={'regular'} type={"cancel"} disabled={!isChanged} onClick={() => {handleReset()}}>Reset all</Button>
                            <Button variant={'primary'} size={'regular'} type={"submit"} disabled={!isChanged}>Apply now</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}