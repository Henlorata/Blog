import React, {useContext, useEffect, useState} from 'react';
import {useLocation, NavLink} from 'react-router-dom';
import {Box, TextField, Button, Typography, Grid, Paper, LinearProgress} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import zxcvbn from 'zxcvbn';
import {UserContext} from '../context/UserContext';
import {Toastify} from '../components/Toastify';

export const Auth = () => {
    const {signInUser, signUpUser, msg, setMsg} = useContext(UserContext);
    const location = useLocation();
    const isSignin = location.pathname === '/auth/in';
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        setMsg(null);
    }, []);

    const handleValidation = (event) => {
        const {name, value} = event.target;

        if (name === 'email') {
            const isValid = /\S+@\S+\.\S+/.test(value);
            setEmailError(isValid ? '' : 'Please enter a valid email address');
        }

        if (name === 'password') {
            const isValid = value.length >= 6;
            setPasswordError(isValid ? '' : 'Password must be at least 6 characters long');
        }
    };

    const handlePasswordChange = (event) => {
        const password = event.target.value;
        const result = zxcvbn(password);
        setPasswordStrength(result.score * 25);
        setPasswordFeedback(result.feedback.suggestions[0] || 'Password looks good!');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMsg({...msg, err: null});
        const data = new FormData(event.currentTarget);

        if (isSignin) {
            await signInUser(data.get('email'), data.get('password'));
        } else {
            await signUpUser(data.get('email'), data.get('password'), data.get('displayName'));
        }

        setIsLoading(false);
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{minHeight: 'calc(100vh - 93px)'}}>
            <Grid item xs={11} sm={8} md={5}>
                <Paper elevation={3} sx={{padding: '32px', textAlign: 'center', borderRadius: '8px'}}>
                    <Typography variant="h4" gutterBottom>
                        {isSignin ? 'Sign In' : 'Sign Up'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
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
                        <TextField
                            error={!!passwordError}
                            helperText={passwordError}
                            fullWidth
                            margin="normal"
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            onBlur={handleValidation}
                            onChange={handlePasswordChange}
                            required
                        />
                        <LinearProgress variant="determinate" value={passwordStrength} sx={{mt: 1}}/>
                        <Typography
                            variant="body2"
                            color={passwordStrength < 50 ? 'error' : 'text.secondary'}
                            sx={{mt: 1}}
                        >
                            {passwordFeedback}
                        </Typography>
                        {!isSignin && (
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Username"
                                name="displayName"
                                type="text"
                                variant="outlined"
                                required
                            />
                        )}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{mt: 3, mb: 2}}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24}/> : 'Submit'}
                        </Button>
                    </Box>
                    {isSignin && (
                        <NavLink to="/pwReset" style={{textDecoration: 'none'}}>
                            <Button color="secondary">Forgot Password?</Button>
                        </NavLink>
                    )}
                    <Typography variant="body2" sx={{mt: 2}}>
                        {isSignin ? (
                            <>
                                Don't have an account?{' '}
                                <NavLink to="/auth/up" style={{textDecoration: 'none', color: 'blue'}}>
                                    Sign Up
                                </NavLink>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <NavLink to="/auth/in" style={{textDecoration: 'none', color: 'blue'}}>
                                    Sign In
                                </NavLink>
                            </>
                        )}
                    </Typography>
                    {msg && <Toastify {...msg} />}
                </Paper>
            </Grid>
        </Grid>
    );
};
