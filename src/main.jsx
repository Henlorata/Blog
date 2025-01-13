import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {UserProvider} from './context/UserContext.jsx'
import {CategProvider} from './context/CategContext.jsx'
import {ConfirmProvider} from "material-ui-confirm"
import {ThemeProvider} from "@mui/material";
import theme from "./theme.js";

createRoot(document.getElementById('root')).render(
    <ConfirmProvider>
        <CategProvider>
            <UserProvider>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>,
            </UserProvider>
        </CategProvider>
    </ConfirmProvider>
)
