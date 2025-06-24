import { DynamicIcon } from 'lucide-react/dynamic';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export const Icon = ({
    name,
    color,
    size = 18,
    width = 2
}) => {
  const theme = useContext(ThemeContext);
  return( <DynamicIcon name={name} color={color || theme.colors.white} size={size} strokeWidth={width}/> )
};