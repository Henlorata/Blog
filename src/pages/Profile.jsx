import React, { useContext, useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    CircularProgress,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { UserContext } from '../context/UserContext';
import { useForm } from 'react-hook-form';
import { delPhoto, uploadFile } from '../utility/uploadFile';
import { extractUrlAndId } from '../utility/utils';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Profile = () => {
    const { user, updateUser, deleteAccount } = useContext(UserContext);
    const [avatar, setAvatar] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Separate forms for name change and delete account
    const { register: registerName, handleSubmit: handleSubmitName, formState: { errors: errorsName }, reset: resetName } = useForm({
        defaultValues: {
            displayName: user?.displayName || '',
        },
    });

    const { register: registerDelete, handleSubmit: handleSubmitDelete, formState: { errors: errorsDelete } } = useForm();

    useEffect(() => {
        if (user?.photoURL) {
            setAvatar(extractUrlAndId(user.photoURL).url);
        }
        if (user?.displayName) {
            resetName({ displayName: user.displayName });
        }
    }, [user, resetName]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setAvatar(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
        }
    };

    const onSubmit = async (data) => {
        console.log("Name change form submitted:", data.displayName);
        setLoading(true);
        try {
            let fileUrl = user.photoURL;
            if (file) {
                if (user.photoURL) {
                    const { id: currentFileId } = extractUrlAndId(user.photoURL);
                    await delPhoto(currentFileId);
                }
                const uploadResponse = await uploadFile(file);
                if (uploadResponse) {
                    fileUrl = `${uploadResponse.url}/${uploadResponse.id}`;
                } else {
                    throw new Error('File upload failed');
                }
            }
            await updateUser(data.displayName || user.displayName, fileUrl);
            console.log("User updated with:", data.displayName, fileUrl);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error("Error in name change:", error.message);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (password) => {
        console.log("Delete account triggered with password:", password);
        setDeleting(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            if (user.photoURL) {
                const { id: currentFileId } = extractUrlAndId(user.photoURL);
                await delPhoto(currentFileId);
            }

            await deleteAccount();
            console.log("Account deleted successfully");
            toast.success('Account deleted successfully!');
        } catch (error) {
            console.error("Error in account deletion:", error.message);
            toast.error(`Error: ${error.message}`);
        } finally {
            setDeleting(false);
            setOpenDialog(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 93px)',
                backgroundColor: 'background.default',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    maxWidth: 400,
                    width: '100%',
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Account Settings
                </Typography>
                {/* Name Change Form */}
                <form onSubmit={handleSubmitName(onSubmit)} style={{ marginTop: '20px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Avatar src={avatar || '/static/images/avatar/placeholder.jpg'} sx={{ width: 100, height: 100, mb: 2 }} />
                        <IconButton
                            color="primary"
                            component="label"
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <PhotoCamera />
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </IconButton>
                        <TextField
                            {...registerName('displayName', { required: 'Username is required' })}
                            fullWidth
                            label="Username"
                            variant="outlined"
                            error={!!errorsName.displayName}
                            helperText={errorsName.displayName && errorsName.displayName.message}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </form>
                {/* Delete Account Button and Dialog */}
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => setOpenDialog(true)}
                >
                    Delete Account
                </Button>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please confirm your password to delete your account. This action is irreversible.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            {...registerDelete('password', { required: 'Password is required' })}
                            error={!!errorsDelete.password}
                            helperText={errorsDelete.password && 'Password is required'}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleSubmitDelete((data) => handleDeleteAccount(data.password))}
                            color="error"
                            disabled={deleting}
                        >
                            {deleting ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
            <ToastContainer />
        </Box>
    );
};
