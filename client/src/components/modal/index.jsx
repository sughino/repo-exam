import { motion } from 'framer-motion';
import { ThemeContext } from 'styled-components';
import { useContext, useRef } from 'react';
import { useClickOutside } from 'react-haiku';
import './modal.css';

export const Modal = ({children, isOpen, onClose}) => {

    const theme = useContext(ThemeContext);
    const ref = useRef(null);

    const handleClickOutside = () => {
        onClose();
    };
    useClickOutside(ref, handleClickOutside);
    
    const bgVariants = {
        hidden: { 
            opacity: 0,
            display: 'none',
            transition: {
                delay: .5
            }
        },
        show: {
            opacity: 1,
            display: 'flex',
        }
    }

    const ModalVariants = {
        closed: {
            y: -15,
            opacity: 0,
            scale: .3,
        },
        open: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                delay: .5
            }
        }
    }
    
    return (
        <motion.div
            className={'modal-wrapper'}
            variants={bgVariants} 
            initial="hidden"
            transition={theme.transition.main}
            animate={isOpen ? "show" : "hidden"}
        >
            <motion.div
                variants={ModalVariants} 
                initial="closed"
                transition={theme.transition.main}
                animate={isOpen ? "open" : "closed"}
                ref={ref}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}