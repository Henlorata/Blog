import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            color: '#222222',
        },
        h2: {
            color: '#222222',
        },
        h3: {
            color: '#222222',
        },
        h4: {
            color: '#222222',
        },
        h5: {
            color: '#222222',
        },
        h6: {
            color: '#222222',
        },
        body1: {
            color: '#333333',
        },
        body2: {
            color: '#555555',
        },
    },
    palette: {
        text: {
            primary: '#333333',
            secondary: '#555555',
        },
        background: {
            default: '#f9f9f9',
            paper: '#ffffff',
        },
    },
});

export default theme;
