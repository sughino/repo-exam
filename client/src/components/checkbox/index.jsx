import Text from '../Text';
import { motion } from 'framer-motion';
import './checkbox.css';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export const Checkbox = ({children, size, isChecked, onClick}) => {

    const theme = useContext(ThemeContext);

    const sizeMap = {
        small: '15px',
        medium: '25px',
    }
    const labelSizeMap = {
        small: 'body2',
        medium: 'body'
    }

    const style = {
        width: sizeMap[size] || sizeMap.medium,
        height: sizeMap[size] || sizeMap.medium
    }

    const checkedAnimation = {
        checked: { 
            pathLength: 1,
            pathOffset: 0,
            strokeOpacity: 1 ,
            strokeWidth: 2,
            stroke: theme.colors.white,
        },
        unChecked: {
            pathLength: 0,
            pathOffset: 1,
            strokeOpacity: 0,
            strokeWidth: 0,
        },
    }

    return (
        <div className='checkbox-wrapper'>
            <motion.div className="checkbox" style={style} onClick={onClick}
                initial={{backgroundColor: theme.colors.white, border: `2px solid ${theme.colors.white10}` }}
                whileTap={{scale: 0.9}}
                animate={isChecked ? 
                    {   
                        backgroundColor: theme.colors.primary,
                        border: `2px solid ${theme.colors.black10}`
                    } : 
                    {
                        backgroundColor: theme.colors.white10,
                        border: `2px solid ${theme.colors.white10}`
                    }
                }
                whileHover={isChecked ? {backgroundColor: theme.colors.primaryHover} : {backgroundColor: theme.colors.white20}}
                transition={theme.transition.fast}
            >
                <svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path 
                        variants={checkedAnimation} 
                        initial="unChecked"
                        transition={theme.transition.main}
                        animate={isChecked ? "checked" : "unChecked"}
                        d="M17.8311 1L6.83105 12L1.83105 7" 
                    />
                </svg>
            </motion.div>
            <Text variant={labelSizeMap[size]}>{children}</Text>
        </div>
    )
}