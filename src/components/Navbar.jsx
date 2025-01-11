import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {NavLink, Outlet} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext.jsx";
import {extractUrlAndId} from "../utility/utils.js";

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const {user, logoutUser} = useContext(UserContext)
    const [avatar, setAvatar] = useState(null)

    useEffect(() => {
        user?.photoURL && setAvatar(extractUrlAndId(user.photoURL).url)
        !user && setAvatar(null)
    }, [user, user?.photoURL])

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <div>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            BLOG
                        </Typography>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{display: {xs: 'block', md: 'none'}}}
                            >
                                {<MenuItem key={'Posts'} onClick={handleCloseNavMenu}>
                                    <Typography sx={{textAlign: 'center'}}>{'Pages'}</Typography>
                                </MenuItem>}
                                {<MenuItem key={'New Post'} onClick={handleCloseNavMenu}>
                                    <Typography sx={{textAlign: 'center'}}>{'New Post'}</Typography>
                                </MenuItem>}
                            </Menu>
                        </Box>
                        <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                        {/*<Typography*/}
                        {/*    variant="h5"*/}
                        {/*    noWrap*/}
                        {/*    component="a"*/}
                        {/*    href="#app-bar-with-responsive-menu"*/}
                        {/*    sx={{*/}
                        {/*        mr: 2,*/}
                        {/*        display: {xs: 'flex', md: 'none'},*/}
                        {/*        flexGrow: 1,*/}
                        {/*        fontFamily: 'monospace',*/}
                        {/*        fontWeight: 700,*/}
                        {/*        letterSpacing: '.3rem',*/}
                        {/*        color: 'inherit',*/}
                        {/*        textDecoration: 'none',*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    LOGO*/}
                        {/*</Typography>*/}
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            <Button
                                key={'Posts'}
                                onClick={handleCloseNavMenu}
                                sx={{my: 2, color: 'white', display: 'block'}}
                                href={'/posts'}
                            >
                                {'Posts'}
                            </Button>
                            {user && <Button
                                key={'New Post'}
                                onClick={handleCloseNavMenu}
                                sx={{my: 2, color: 'white', display: 'block'}}
                                href={'/create'}
                            >
                                {'New Post'}
                            </Button>}
                        </Box>
                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {user ?
                                    <>
                                        <MenuItem key={'Profile'} onClick={handleCloseUserMenu}>
                                            <NavLink to={'/profile'} style={{textDecoration: 'none', color: 'black', textAlign: 'center'}}>Profile</NavLink>
                                        </MenuItem>
                                        <MenuItem key={'Account'} onClick={handleCloseUserMenu}>
                                            <NavLink style={{textDecoration: 'none', color: 'black', textAlign: 'center'}}>Account</NavLink>
                                        </MenuItem>
                                        <MenuItem key={'Logout'} onClick={() => {
                                            handleCloseUserMenu();
                                            logoutUser()
                                        }}>
                                            <NavLink to={'/'} style={{textDecoration: 'none', color: 'black', textAlign: 'center'}}>Logout</NavLink>
                                        </MenuItem>
                                    </> : <></>}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Outlet/>
        </div>
);
}