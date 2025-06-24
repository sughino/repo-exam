import { useContext, useRef } from "react";
import { Icon } from "../Icon";
import { Separator } from "../Separator";
import Text from "../Text";
import { ThemeContext } from "styled-components";
import { LinkGithub, LinkRoute } from "../LinkRoute";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useClickOutside, useMediaQuery } from 'react-haiku';
import authServices from "../../services/authServices";
import './modalRoutes.css';

export const ModalRoutes = ({isInNavbar, user, onClick, isOpen}) => {
    const theme = useContext(ThemeContext);

    const labelVariants = {
        open: {
            opacity: 1,
            scale: 1
        },
        closed: {
            opacity: 0,
            scale: 0.8,
        }
    }

    return (
        <div className={`modal-routes-wrapper ${isInNavbar && 'navbar'}`} onClick={() => {onClick()}}>
            <motion.div 
                className={`open-modal-wrapper ${isInNavbar && 'navbar'}`}
                variants={labelVariants}
                initial="open"
                animate={isOpen ? "closed" : "open"}
                transition={theme.transition.main}
            >
                {isInNavbar ? (
                    <div className="open-modal-text-in-navbar">
                        <Icon name={'menu'} size={18} width={1} />
                        <div className="open-modal-text-wrapper">
                            <Text variant={'subtitle'}>Menù</Text>
                        </div>  
                    </div>
                ) : (
                    <>
                        <div className="open-modal-text">
                            <Text variant={'subtitle'}>Hello</Text>
                            <Text variant={'h4'} className={'text-ellipsis'}>{user ? user.name : 'Login'}</Text>
                        </div>
                        <div className="open-modal-user-image" style={{"--size": "50px"}}>
                            <Icon name={'user-round'} size={50} width={1} />
                        </div>
                    </>
                )}
            </motion.div>        
        </div>
    )
}

export const FloatingModalRoutes = ({ routes, user, openLoginModal, isOpen, closeFloating}) => {
    const theme = useContext(ThemeContext);
    const ref = useRef(null);
    const navigate = useNavigate(); 
    const { featchLogout } = authServices.useLogout();

    const isMobile = useMediaQuery('(max-width:900px)');

    let location = useLocation().pathname;

    const handleClickOutside = () => {
        closeFloating();
    };
    useClickOutside(ref, handleClickOutside);

    const handleLogout = async () => {
        if (routes.some(r => location === r.path && (r.visibleTo.includes('user') || r.visibleTo.includes('admin')))) {
            navigate('/');
        }
        await featchLogout();
    };

    const modalVariants = {
        open: {
            display: "flex",
            opacity: 1,
            top: isMobile ? 0 : 30,
            right: isMobile ? 0 : 30,
            scale: 1
        },
        closed: {
            display: "none",
            opacity: 0,
            top: isMobile ? 100 : -40,
            right: isMobile ? 0 : 30,
            scale: 0.8,
        }
    }
    
    return (
        <motion.div 
            className="modal-routes-container"
            variants={modalVariants}
            initial="closed"
            animate= {isOpen ? "open" : "closed"}
            transition={theme.transition.main}
            ref={ref}
        >
            <div className="modal-routes-user-container">
                <div className="modal-routes-user-title">
                    <div className="close-icon" onClick={() => {handleClickOutside()}}><Icon name={'x'} size={25} width={1.5} /></div>
                    <div className="open-modal-user-image" style={{"--size": "30px"}}>
                        <Icon name={'user-round'} size={50} width={1.5} />
                    </div>
                    <Text variant={'h6'} className={'text-ellipsis'}>{user ? `${user.name} ${user.surname}` : 'Login to explore'}</Text>
                </div>
                
                <Separator color={theme.colors.white10}/>

                <div className="modal-routes-link-wrapper">
                    <Text variant={'body2'} color={theme.colors.white50}>User</Text>
                    {user ? 
                        <>
                            {routes.filter(r => r.name === 'userProfile').map((r) => (
                                <LinkRoute key={r.name} iconName={r.icon} onClick={() => {navigate(r.path)}}>{r.label}</LinkRoute>
                            ))}
                            <LinkRoute iconName={'log-out'} isWarning={true} onClick={() => {handleLogout()}}>Logout</LinkRoute>
                        </>
                    : 
                        <LinkRoute iconName={'user-round'} onClick={() => {handleClickOutside();openLoginModal()}}>Login</LinkRoute>
                    }
                    
                </div>
            </div>
            <div className="modal-routes-route-container">
                {user &&
                    <>
                        <div className="modal-routes-link-wrapper">
                            <Text variant={'body2'} color={theme.colors.white50}>Private</Text>
                            {user.admin && routes.filter(r => r.visibleTo.includes('admin')).map((r) => (
                                <LinkRoute key={r.name} iconName={r.icon} onClick={() => {navigate(r.path)}}>{r.label}</LinkRoute>
                            ))}
                            {routes.filter(r => r.visibleTo.includes('user') && r.name !== 'userProfile').map((r) => (
                                <LinkRoute key={r.name} iconName={r.icon} onClick={() => {navigate(r.path)}}>{r.label}</LinkRoute>
                            ))}
                        </div>

                        <Separator color={theme.colors.white10}/>
                    </>
                }

                <div className="modal-routes-link-wrapper">
                    <Text variant={'body2'} color={theme.colors.white50}>Public</Text>
                    {routes.filter(r => r.visibleTo.includes('guest')).map((r) => (
                        <LinkRoute key={r.name} iconName={r.icon} onClick={() => {navigate(r.path)}}>{r.label}</LinkRoute>
                    ))}
                </div>

                <div className="modal-routes-link-wrapper">
                    <Text variant={'body2'} color={theme.colors.white50}>Other</Text>
                    <LinkGithub/>
                </div>
            </div>
        </motion.div>
    )
}