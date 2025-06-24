import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export const FadeIn = ({children, size}) => {

    const theme = useContext(ThemeContext);

    const motionVariants = {
        hidden: { 
            y: -15,
            opacity: 0,
            scale: .8,
        },
        show: {
            scale: 1,
            y: 0,
            opacity: 1,
        }
    }

    return (
        <motion.div
            variants={motionVariants} 
            initial="hidden"
            animate="show"
            transition={theme.transition.main}
            style={{width: size || 'fit-content'}}
        >
            {children}
        </motion.div>
    )

}