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
} from '@mui/material';
import { UserContext } from '../context/UserContext';
import { useForm } from 'react-hook-form';
import { uploadFile } from '../utility/uploadFile';
import { Toastify } from '../components/Toastify';
import { extractUrlAndId } from '../utility/utils';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export const Profile = () => {
    const { user, updateUser, msg, setMsg } = useContext(UserContext);
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            displayName: user?.displayName || '',
        },
    });

    useEffect(() => {
        if (user?.photoURL) {
            setAvatar(extractUrlAndId(user.photoURL).url);
        }
    }, [user]);

    const onSubmit = async (data) => {
        const newUsername = data.displayName.trim();
        const file = data?.file ? data.file[0] : null;
        let fileUrl = null;
        let fileId = null;

        // Check if any changes are made
        if (!newUsername && !file) {
            setMsg({ err: 'No changes to save' });
            return;
        }

        setLoading(true);

        try {
            if (file) {
                const uploadResponse = await uploadFile(file);

                if (uploadResponse) {
                    const { url, id } = uploadResponse;
                    fileUrl = url;
                    fileId = id;
                } else {
                    throw new Error('File upload failed');
                }
            }

            const updatedUsername = newUsername || user.displayName;
            const updatedPhotoURL = fileUrl ? `${fileUrl}/${fileId}` : user.photoURL;

            updateUser(updatedUsername, updatedPhotoURL);
        } catch (error) {
            console.error(error);
            Toastify({ message: error.message, type: 'error' });
        } finally {
            setLoading(false);
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
                                {...register('file', {
                                    validate: (value) => {
                                        if (!value[0]) return true;
                                        const acceptedFormats = ['jpg', 'png'];
                                        const fileExtension = value[0].name.split('.').pop().toLowerCase();
                                        if (!acceptedFormats.includes(fileExtension)) return 'Invalid file format';
                                        if (value[0].size > 1 * 1000 * 1024) return 'Maximum file size 1MB!';
                                        return true;
                                    },
                                })}
                                type="file"
                                hidden
                                onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
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

                {msg && <Toastify {...msg} />}
            </Paper>
        </Box>
    );
};
