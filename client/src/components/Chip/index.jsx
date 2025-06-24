import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import Text from '../Text';
import "./chip.css";

export const Chip = ({children, selected = false, onClick}) => {
    const theme = useContext(ThemeContext);

    return (
        <div className='chip-wrapper' style={selected ? { background: theme.colors.white30 } : {}} onClick={() => {onClick()}}>
            <Text variant={'body'}>{children}</Text>
        </div>
    )
}