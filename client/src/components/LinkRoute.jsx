import { useContext, useState } from "react"
import { Icon } from "./Icon"
import { ThemeContext } from "styled-components"
import { motion } from 'framer-motion';
import Text from "./Text";

export const LinkRoute = ({isWarning, children, iconName, onClick}) => {
    const theme = useContext(ThemeContext);
    const [isHover, setIsHover] = useState(false);

    const arrowVariants = {
        notHovered: {
            left: -15,
            opacity: 0
        },
        hovered: {
            left: 0,
            opacity: 1
        }
    }
    return (
        <motion.div 
            className="modal-routes-link-container"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            initial={{opacity: .6}}
            animate={isHover ? {opacity: 1} : {opacity: .6}}
            transition={theme.transition.main}
            onClick={() => {onClick()}}
        >
            <div className="modal-routes-link">
                <Icon name={iconName} color={isWarning ? theme.colors.warning : theme.colors.white} size={23} />
                <Text variant={'subtitle'}>{children}</Text>
                <motion.div 
                    className="modal-link-arrow"
                    variants={arrowVariants} 
                    initial="notHovered"
                    animate={isHover ? "hovered" : "notHovered"}
                    transition={theme.transition.main}
                >
                    <Icon name={'chevron-right'} color={theme.colors.white} size={23} />
                </motion.div>
            </div>
        </motion.div>
    )
}

export const LinkGithub = ({ onClick }) => {
    const theme = useContext(ThemeContext);
    const [isHover, setIsHover] = useState(false);

    const containerVariants = {
        notHovered: {
            backgroundColor: theme.colors.white,
        },
        hovered: {
            backgroundColor: theme.colors.white80,
        }
    };

    const iconFade = {
        hidden: { scale: 0.2, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
    };

    return (
        <motion.div 
            className="modal-routes-github-button"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            variants={containerVariants}
            initial="notHovered"
            animate={isHover ? "hovered" : "notHovered"}
            transition={theme.transition.fast}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => {onClick()}}
        >
            <div style={{ position: 'relative', width: 24, height: 24 }}>
                <motion.div
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    variants={iconFade}
                    initial="visible"
                    animate={isHover ? "hidden" : "visible"}
                    transition={theme.transition.main}
                >
                    <Icon name={'github'} color={theme.colors.black} size={23} />
                </motion.div>

                <motion.div
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    variants={iconFade}
                    initial="hidden"
                    animate={isHover ? "visible" : "hidden"}
                    transition={theme.transition.main}
                >
                    <Icon name={'square-arrow-out-up-right'} color={theme.colors.black} size={23} />
                </motion.div>
            </div>

            <Text variant={'subtitle'} color={theme.colors.black}>GitHub</Text>
        </motion.div>
    );
};