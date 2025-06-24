import { useContext } from "react";
import { ThemeContext } from "styled-components";
import { Spacer } from "../../components/Spacer";
import { Separator } from "../../components/Separator";
import { LoadingFilters } from "../../components/Filters";
import { Skeleton } from "@mui/material";
import { Button } from "../../components/buttons";
import '../DataPage/DataPage.css';

export const LoadingDataPage = () => {
    const theme = useContext(ThemeContext);

    return (
        <div className="exam-content-container">
            <div className="top-content-container">
                <Skeleton variant="text" width={300} height={115} sx={{ bgcolor: theme.colors.white05 }}/>
                <Button onlyicon={true} iconName={'plus'} variant={'primary'} size={'big'}/>
            </div>

            <Separator/>
            <Spacer height={theme.sizes.gap3}/>
            
            <LoadingFilters/>
            
            <Spacer height={theme.sizes.gap3}/>
            <div className={'data-container-scroll card'}>
                <div className="data-container card">
                    {
                        Array.from({ length: 12 }).map((_, index) => (
                            <Skeleton key={index} variant="rectangle" width={'100%'} height={259} sx={{ bgcolor: theme.colors.white05, borderRadius: '20px' }}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}