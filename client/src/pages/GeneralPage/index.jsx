import { useState } from "react";
import { Login } from "../../components/Login";
import { Modal } from "../../components/modal";
import { useUser } from "../../hooks/useUser";
import { FloatingModalRoutes, ModalRoutes } from "../../components/modalRoutes";
import { useRoutes } from "../../context/RoutesContext";
import "./GeneralPage.css";
import '../../components/DataForms/DataForms.css';
import Text from "../../components/Text";
import { Button } from "../../components/buttons";

export const GeneralPage = () => {
    const routes = useRoutes();
    const { user } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFloating, setIsFloating] = useState(false);

    return (
        <>
            <FloatingModalRoutes routes={routes} user={user} isOpen={isFloating} openLoginModal={() => {setIsModalOpen(true)}} closeFloating={() => {setIsFloating(false)}}/>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Login isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)}/> 
            </Modal>
        
            <div className="hero-wrapper">
                <div className="hero-page-fixed-button-container">
                    <ModalRoutes routes={routes} user={user} onClick={() => {setIsFloating(true)}} isOpen={isFloating}/>
                </div>
                <div className="hero-page">
                    {user ?
                        <>
                            <Text variant={'h1'}>Go to the pages</Text>
                            <div className="hero-button-container">
                                <Button variant={'accent'}>User</Button>
                            </div>
                        </>
                    :
                        <Text variant={'h1'}>Need to login to access the features</Text>
                    }
                </div>
            </div>
        </>
    )
}

export default GeneralPage;