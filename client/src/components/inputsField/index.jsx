import { motion } from 'framer-motion';
import { Icon } from '../Icon';
import { Text } from '../Text';
import './inputField.css';
import { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from 'styled-components';

export const InputField = ({
    onChange, 
    value, 
    placeholder, 
    type, 
    isCorrect, 
    onBlur, 
    name, 
    errorMessage, 
    style, 
    isDisabled,
    isRequired = true
}) => {
    const theme = useContext(ThemeContext);
    const inputRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(!!value);

    const shouldFloat = isFocused || hasContent;

    useEffect(() => {
        setHasContent(!!value);
    }, [value]);

    const labelColor = isCorrect === undefined || isCorrect === null
    ? theme.colors.white 
    : isCorrect 
        ? theme.colors.success
        : theme.colors.warning;

    const textVariants = {
        down: { y: 3, scale: 1.2, originX: 0, originY: 0 },
        up: { y: -5, scale: 0.8, originX: 0, originY: 0 }
    };

    return (
        <div className="inputContainer-wrapper" style={{opacity: isDisabled ? .5 : 1}} onClick={() => {inputRef.current?.focus()}}>
            <div className={`inputField-main-container ${isCorrect === undefined ? '' : !isCorrect ? 'error' : ''}`}>
                <div className="inputField-container">
                    <motion.div
                        variants={textVariants}
                        initial={value ? "up" : "down"}
                        animate={shouldFloat ? "up" : "down"}
                        transition={theme.transition.main}
                    >
                        <Text
                            variant="body1"
                            className={`inputField-text ${!shouldFloat && isRequired ? 'required' : ''}`}
                            style={{color: labelColor}}
                        >
                            {placeholder}
                        </Text>
                    </motion.div>
                    <input 
                        ref={inputRef}
                        onChange={(e) => {
                            onChange(e);
                            setHasContent(!!e.target.value);
                        }}
                        name={name}
                        value={value} 
                        type={type || 'text'} 
                        className='inputField'
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setIsFocused(false); 
                            onBlur();
                        }}
                        autoComplete="off"
                        style={style}
                        disabled={isDisabled}
                    />
                </div>
                {isCorrect !== undefined && (
                    <Icon 
                        name={isCorrect ? 'check' : 'x'} 
                        size={24} 
                        className="inputField-feedback"
                        color={isCorrect ? theme.colors.success : theme.colors.warning}
                    />
                )}
            </div>
            <div className="error-message">
                <Text variant={'body2'} >{errorMessage}</Text>
            </div>
        </div>
    )
}

export const DateField = ({
    onChange, 
    value, 
    placeholder,
    isCorrect, 
    onBlur, 
    name, 
    errorMessage, 
    style, 
    isDisabled,
    isRequired = true
}) => {
    const theme = useContext(ThemeContext);
    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const [isFocused, setIsFocused] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    
    const refMap = {
        day: dayRef,
        month: monthRef,
        year: yearRef
    }

    const shouldFloat = focusedField !== null || day || month || year || isFocused;

    const labelColor = isCorrect === undefined || isCorrect === null
        ? theme.colors.white 
        : isCorrect 
        ? theme.colors.success 
        : theme.colors.warning;

    const textVariants = {
        down: { y: 3, scale: 1.2, originX: 0, originY: 0 },
        up: { y: -5, scale: 0.8, originX: 0, originY: 0 }
    };
    const inputVariants = {
        notVisible: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    const handleBlur = () => {
        if (
            document.activeElement !== dayRef.current &&
            document.activeElement !== monthRef.current &&
            document.activeElement !== yearRef.current
        ) {
            setIsFocused(false);
            setFocusedField(null);
        }
    };

    useEffect(() => {
        if(!isFocused) onBlur()
    }, [isFocused])

    useEffect(() => {
       if (!value) {
            setDay('');
            setMonth('');
            setYear('');
       }
    }, [value]);

    useEffect(() => {
        if (year.length === 4) {
            monthRef.current?.focus();
        }
    }, [year]);

    useEffect(() => {
        if (month.length === 2) {
            dayRef.current?.focus();
        }
    }, [month]);

    useEffect(() => {
        const rawDate = `${year}/${month}/${day}`;
        const isEmpty = !year && !month && !day;

        const finalValue = isEmpty ? "" : rawDate;

        if (finalValue !== value) {
            onChange(finalValue);
        }
    }, [day, month, year, onChange, value]);

    return (
        <div className="inputContainer-wrapper" style={{opacity: isDisabled ? .5 : 1}} onClick={() => { !focusedField ? yearRef.current?.focus() : refMap[focusedField].current?.focus() }}>
            <div className={`inputField-main-container ${isCorrect === undefined ? '' : !isCorrect ? 'error' : ''}`}>
                <div className="inputField-container">
                    <motion.div
                        variants={textVariants}
                        initial={value ? "up" : "down"}
                        animate={shouldFloat ? "up" : "down"}
                        transition={theme.transition.main}
                    >
                        <Text
                            variant="body1"
                            className={`inputField-text ${!shouldFloat && isRequired ? 'required' : ''}`}
                            style={{color: labelColor}}
                        >
                            {placeholder}
                        </Text>
                    </motion.div>
                    <motion.div className="inputSplit-container"
                        variants={inputVariants}
                        initial={value ? "visible" : "notVisible"}
                        animate={shouldFloat ? "visible" : "notVisible"}
                        transition={theme.transition.main}
                    >
                        <input 
                            ref={yearRef}
                            onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            name={`${name}-year`}
                            value={year}
                            type="text"
                            className="inputField year"
                            onFocus={() => {setFocusedField('year'); setIsFocused(true)}}
                            onBlur={() => handleBlur() }
                            autoComplete="off"
                            style={style}
                            disabled={isDisabled}
                            placeholder="YYYY"
                        />
                        <Text variant={'p'}>/</Text>
                        <input 
                            ref={monthRef}
                            onChange={(e) => setMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                            name={`${name}-month`}
                            value={month}
                            type="text"
                            className="inputField month"
                            onFocus={() => {setFocusedField('month'); setIsFocused(true)}}
                            onBlur={() => handleBlur() }
                            autoComplete="off"
                            style={style}
                            disabled={isDisabled}
                            placeholder="MM"
                        />
                        <Text variant={'p'}>/</Text>
                        <input 
                            ref={dayRef}
                            onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                            name={`${name}-day`}
                            value={day}
                            type="text"
                            className="inputField day"
                            onFocus={() => {setFocusedField('day');setIsFocused(true)}}
                            onBlur={() => handleBlur() }
                            autoComplete="off"
                            style={style}
                            disabled={isDisabled}
                            placeholder="DD"
                        />
                    </motion.div>
                </div>
                <div className="container-feedback">
                    <div className='inputField-feedback'>
                        <Icon 
                            name={'calendar'} 
                            size={24} 
                            color={theme.colors.white}
                        />
                    </div>
                    {isCorrect !== undefined && (
                        <Icon 
                            name={isCorrect ? 'check' : 'x'} 
                            size={24} 
                            className="inputField-feedback"
                            color={isCorrect ? theme.colors.success : theme.colors.warning}
                        />
                    )}
                </div>
            </div>
            <div className="error-message">
                <Text variant={'body2'}>{errorMessage}</Text>
            </div>
        </div>
    );
};

export const PasswordField = ({
    onChange, 
    value, 
    placeholder,
    isCorrect, 
    onBlur, 
    name, 
    errorMessage, 
    style, 
    isDisabled,
    isRequired = true
}) => {
    const theme = useContext(ThemeContext);
    const inputRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false); 
    const [hasContent, setHasContent] = useState(!!value);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const shouldFloat = isFocused || hasContent;

    useEffect(() => {
        setHasContent(!!value);
    }, [value]);

    const labelColor = isCorrect === undefined || isCorrect === null
    ? theme.colors.white 
    : isCorrect 
        ? theme.colors.success 
        : theme.colors.warning;

    const textVariants = {
        down: { y: 3, scale: 1.2, originX: 0, originY: 0 },
        up: { y: -5, scale: 0.8, originX: 0, originY: 0 }
    };

    return (
        <div className="inputContainer-wrapper" style={{opacity: isDisabled ? .5 : 1}}>
            <div className={`inputField-main-container ${isCorrect === undefined ? '' : !isCorrect ? 'error' : ''}`}>
                <div className="inputField-container">
                    <motion.div
                        variants={textVariants}
                        initial={value !== "//" ? "up" : "down"}
                        animate={shouldFloat ? "up" : "down"}
                        transition={theme.transition.main}
                    >
                        <Text
                            variant="body1"
                            className={`inputField-text ${!shouldFloat && isRequired ? 'required' : ''}`}
                            style={{color: labelColor}}
                        >
                            {placeholder}
                        </Text>
                    </motion.div>
                    <input 
                        ref={inputRef}
                        onChange={(e) => {
                            onChange(e);
                            setHasContent(!!e.target.value);
                        }}
                        name={name}
                        value={value} 
                        type={isPasswordVisible ? 'text' : 'password'} 
                        className='inputField'
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setIsFocused(false); 
                            onBlur();
                        }}
                        autoComplete="off"
                        style={style}
                        disabled={isDisabled}
                    />
                </div>
                <div className="container-feedback">
                    <div onClick={() => setIsPasswordVisible(!isPasswordVisible)} style={{cursor: 'pointer'}} className='inputField-feedback'>
                        <Icon 
                            name={!isPasswordVisible ? 'eye' : 'eye-closed'} 
                            size={24} 
                            color={theme.colors.white}
                        />
                    </div>
                    {isCorrect !== undefined && (
                        <Icon 
                            name={isCorrect ? 'check' : 'x'} 
                            size={24} 
                            color={isCorrect ? theme.colors.success : theme.colors.warning}
                        />
                    )}
                </div>
            </div>
            <div className="error-message">
                <Text variant={'body2'} >{errorMessage}</Text>
            </div>
        </div>
    )
}

export const TextAreaField = ({
    onChange, 
    value, 
    placeholder, 
    type, 
    isCorrect, 
    onBlur, 
    name, 
    errorMessage, 
    style, 
    isDisabled,
    isRequired = true
}) => {
    const theme = useContext(ThemeContext);
    const inputRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(!!value);

    const shouldFloat = isFocused || hasContent;

    useEffect(() => {
        setHasContent(!!value);
    }, [value]);

    const labelColor = isCorrect === undefined || isCorrect === null
    ? theme.colors.white 
    : isCorrect 
        ? theme.colors.success
        : theme.colors.warning;

    const textVariants = {
        down: { y: 3, scale: 1.2, originX: 0, originY: 0 },
        up: { y: -5, scale: 0.8, originX: 0, originY: 0 }
    };

    return (
        <div className="inputContainer-wrapper" style={{opacity: isDisabled ? .5 : 1}} onClick={() => {inputRef.current?.focus()}}>
            <div className={`inputField-main-container textarea ${isCorrect === undefined ? '' : !isCorrect ? 'error' : ''}`}>
                <div className="inputField-container">
                    <motion.div
                        variants={textVariants}
                        initial={value ? "up" : "down"}
                        animate={shouldFloat ? "up" : "down"}
                        transition={theme.transition.main}
                    >
                        <Text
                            variant="body1"
                            className={`inputField-text ${!shouldFloat && isRequired ? 'required' : ''}`}
                            style={{color: labelColor}}
                        >
                            {placeholder}
                        </Text>
                    </motion.div>
                    <textarea
                        ref={inputRef}
                        onChange={(e) => {
                            onChange(e);
                            setHasContent(!!e.target.value);
                        }}
                        name={name}
                        value={value} 
                        type={type || 'text'} 
                        className='inputField textarea'
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setIsFocused(false); 
                            onBlur();
                        }}
                        autoComplete="off"
                        style={style}
                        disabled={isDisabled}
                    />
                </div>
                {isCorrect !== undefined && (
                    <Icon 
                        name={isCorrect ? 'check' : 'x'} 
                        size={24} 
                        className="inputField-feedback"
                        color={isCorrect ? theme.colors.success : theme.colors.warning}
                    />
                )}
            </div>
            <div className="error-message">
                <Text variant={'body2'} >{errorMessage}</Text>
            </div>
        </div>
    )
}