import React, { useContext, useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { UserContext } from '../context/UserContext';
import { Toastify } from '../components/Toastify';

export const PwReset = () => {
    const { msg, resetPassword } = useContext(UserContext);
    const [emailError, setEmailError] = useState('');

    const handleValidation = (event) => {
        const { value } = event.target;
        const isValid = /\S+@\S+\.\S+/.test(value);
        setEmailError(isValid ? '' : 'Please enter a valid email address');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        resetPassword(data.get('email'));
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 93px)' }}>
            <Grid item xs={11} sm={8} md={5}>
                <Paper elevation={3} sx={{ padding: '32px', textAlign: 'center', borderRadius: '8px' }}>
                    <Typography variant="h4" gutterBottom>
                        Reset Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            error={!!emailError}
                            helperText={emailError}
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            onBlur={handleValidation}
                            required
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Set New Password
                        </Button>
                    </Box>
                    {msg && <Toastify {...msg} />}
                </Paper>
            </Grid>
        </Grid>
    );
};
