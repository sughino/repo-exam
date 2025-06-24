import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

let theme = createTheme();
theme = responsiveFontSizes(theme);

theme.typography.h1 = {
  fontWeight: 800,
  fontSize: '3.5rem',
  '@media (min-width:600px)': {
    fontSize: '4.712875rem',
  },
  '@media (min-width:900px)': {
    fontSize: '5.355625rem',
  },
  '@media (min-width:1200px)': {
    fontSize: ' 5.9983125rem',
  },
};
theme.typography.h2 = {
  fontWeight: 800,
  fontSize: '2.375rem',
  '@media (min-width:600px)': {
    fontSize: '3.125rem',
  },
  '@media (min-width:900px)': {
    fontSize: '3.333125rem',
  },
  '@media (min-width:1200px)': {
    fontSize: '3.75rem',
  },
};

const style = {
  margin: 0,
  padding: 0,
  wordWrap: 'break-word',
  overflowWrap: 'break-word'
}

const buttonSizeMap = {
  big: 18.6666666667,
  regular: 16,
  small: 12
}

//h1, h2, h3, h4, h5, h6, subtitle1, subtitle2, body1, body2 
export const Text = ({children, color, variant, ...others}) => {
  return (
    <ThemeProvider theme={theme}>
      <Typography variant={variant} sx={{ color: color, ...style }} {...others}>{children}</Typography>
    </ThemeProvider>
  )
}

export const SmallButton = ({ children, color }) => {
  return (
    <p style={{ color: color, fontSize: buttonSizeMap['small'] }}>{children}</p>
  );
};
export const RegularButton = ({ children, color }) => {
  return (
    <p style={{ color: color, fontSize: buttonSizeMap['regular'] }}>{children}</p>
  );
};
export const BigButton = ({ children, color }) => {
  return (
    <p style={{ color: color, fontSize: buttonSizeMap['big'] }}>{children}</p>
  );
};

export default Text