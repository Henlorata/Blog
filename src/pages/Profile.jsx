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

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            displayName: user?.displayName || '',
        },
    });

    useEffect(() => {
        if (user?.photoURL) {
            setAvatar(extractUrlAndId(user.photoURL).url);
        }
    }, [user]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setAvatar(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
        }
    };

    const onSubmit = async (data) => {
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
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (password) => {
        setDeleting(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            if (user.photoURL) {
                const { id: currentFileId } = extractUrlAndId(user.photoURL);
                await delPhoto(currentFileId);
            }

            await deleteAccount();
            toast.success('Account deleted successfully!');
        } catch (error) {
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
                <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={avatar || '/static/images/avatar/placeholder.jpg'}
                            sx={{ width: 100, height: 100, mb: 2 }}
                        />
                        <IconButton
                            color="primary"
                            component="label"
                            sx={{ position: 'relative' }}
                        >
                            <PhotoCamera />
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                hidden
                                onChange={handleFileChange}
                            />
                        </IconButton>
                        {errors.file && (
                            <Typography variant="body2" color="error">
                                {errors.file.message}
                            </Typography>
                        )}

                        <TextField
                            {...register('displayName')}
                            fullWidth
                            label="Username"
                            variant="outlined"
                            error={!!errors.displayName}
                            helperText={errors.displayName && 'Username is required'}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                        </Button>
                    </Box>
                </form>

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
                            {...register('password', { required: 'Password is required' })}
                            error={!!errors.password}
                            helperText={errors.password && 'Password is required'}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleSubmit((data) => handleDeleteAccount(data.password))}
                            disabled={deleting}
                            color="error"
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
