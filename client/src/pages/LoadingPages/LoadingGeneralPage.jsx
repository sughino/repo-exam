import { useContext } from "react";
import { ThemeContext } from 'styled-components';
import { Skeleton } from "@mui/material";
import '../GeneralPage/GeneralPage.css';

export const LoadingGeneralPage = () => {
    const theme = useContext(ThemeContext);

    return (
        <div className="hero-wrapper">
            <div className="hero-page-fixed-button-container">
                <Skeleton variant="rectangle" width={200} height={50} sx={{ bgcolor: theme.colors.white05 }}/>
            </div>
            <Skeleton className="hero-container form loader" variant="rectangle" height={320} sx={{ bgcolor: theme.colors.white05, borderRadius: '20px' }}/>
        </div>
    )
}