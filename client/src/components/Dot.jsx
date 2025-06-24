import { useContext } from "react"
import { ThemeContext } from "styled-components"

export const Dot = ({width, color}) => {
    const theme = useContext(ThemeContext);
    return (
        <div style={{width: width, height: width, borderRadius: '100%', background: color || theme.colors.white}}/>
    )
}