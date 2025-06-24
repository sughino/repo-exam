import { Zoomies } from 'ldrs/react';
import './loader.css';
import 'ldrs/react/Zoomies.css';

export const Loader = ({children, color, isLoading, bgColor}) => {
    return (
        <div className="form-loading-container">
            <div className="form-loading" style={{display: isLoading ? "flex" : "none", background: bgColor}}>
                <Zoomies
                    size="80"
                    stroke="5"
                    bgOpacity="0.1"
                    speed="1.4"
                    color={color} 
                />
            </div>
            {children}
        </div>
    )
}