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
import {delPhoto, uploadFile} from '../utility/uploadFile';
import { Toastify } from '../components/Toastify';
import { extractUrlAndId } from '../utility/utils';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export const Profile = () => {
    const { user, updateUser, msg, setMsg } = useContext(UserContext);
    const [avatar, setAvatar] = useState(null); // For preview
    const [file, setFile] = useState(null); // For submission
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

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setAvatar(URL.createObjectURL(selectedFile)); // Update preview
            setFile(selectedFile); // Store file for upload
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let fileUrl = user.photoURL; // Default to the current user's photoURL
            let newFileId = null;

            // Upload the new file if it exists
            if (file) {
                // Delete the previous photo if it exists
                if (user.photoURL) {
                    const { id: currentFileId } = extractUrlAndId(user.photoURL);
                    await delPhoto(currentFileId);
                    console.log("Deleted previous photo with ID:", currentFileId);
                }

                // Upload the new file
                const uploadResponse = await uploadFile(file);
                if (uploadResponse) {
                    fileUrl = `${uploadResponse.url}/${uploadResponse.id}`;
                    newFileId = uploadResponse.id;
                    console.log("Uploaded new photo URL:", fileUrl);
                } else {
                    throw new Error("File upload failed");
                }
            }

            // Update user details
            await updateUser(data.displayName || user.displayName, fileUrl);
        } catch (error) {
            console.error("Error during profile update:", error);
            Toastify({ message: error.message, type: "error" });
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
                                type="file"
                                accept="image/png, image/jpeg"
                                {...register("file", {
                                    validate: (value) => {
                                        if (!value[0]) return true;
                                        const acceptedFormats = ["jpg", "png"];
                                        const fileExtension = value[0].name.split(".").pop().toLowerCase();
                                        if (!acceptedFormats.includes(fileExtension)) return "Invalid file format";
                                        if (value[0].size > 1 * 1024 * 1024) return "File size exceeds 1MB";
                                        return true;
                                    },
                                })}
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

                {msg && <Toastify {...msg} />}
            </Paper>
        </Box>
    );
};
