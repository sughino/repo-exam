import { useEffect, useState } from "react";
import { Navbar } from '../../components/Navbar';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { useRoutes } from "../../context/RoutesContext";
import './DataLayout.css';
import { FloatingModalRoutes, ModalRoutes } from "../../components/modalRoutes";

export const DataLayout = () => {
    const routes = useRoutes();
    const { user } = useUser();

    const navigate = useNavigate(); 
    let location = useLocation().pathname.substring(1);
    const [activeText, setActiveText] = useState(location);

    const [isFloating, setIsFloating] = useState(false);

    useEffect(() => {
        const targetRoute = routes.find(r => r.name === activeText);
        if (targetRoute) {
            navigate(targetRoute.path);
        }
    }, [activeText, routes, navigate]);

    useEffect(() => {
        const newLocation = location
        setActiveText(newLocation);
    }, [location]);
    
    return (
        <div className='bg-exam-container'>
            <div className="bg-exam-navbar">
                <div className="navbar-filler left">
                    <div className="filler-curved"/>
                </div>
                <Navbar routes={routes} user={user} activeIndex={activeText} onSelect={setActiveText} onOpenMenu={() => {setIsFloating(true)}}/>
                <div className="navbar-filler right">
                    <div className="filler-curved"/>
                    <ModalRoutes routes={routes} user={user} onClick={() => {setIsFloating(true)}} isOpen={isFloating}/>
                </div>
            </div>

            <Outlet/>
            <FloatingModalRoutes routes={routes} user={user} isOpen={isFloating} closeFloating={() => {setIsFloating(false)}}/>
        </div>
    );
};

export default DataLayout;