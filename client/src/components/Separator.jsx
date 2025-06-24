import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export const Separator = ({color}) => {
    const theme = useContext(ThemeContext);

    const style = {
        width: '100%',
        borderRadius: 50,
        border: '1.5px solid',
        borderColor: color || theme.colors.white
    }

    return (
        <div style={style}/>
    )
}