import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { UserContext } from '../context/UserContext';
import { CategContext } from '../context/CategContext';
import { uploadFile } from '../utility/uploadFile';
import { addPost, readPost, updatePost } from '../utility/crudUtility';
import { Alerts } from '../components/Alerts';
import { Story } from '../components/Story';

export const AddEditPost = () => {
    const { user } = useContext(UserContext);
    const { categories } = useContext(CategContext);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [story, setStory] = useState('');
    const [selCateg, setSelCateg] = useState('');
    const [post, setPost] = useState(null);
    const [isAuthor, setIsAuthor] = useState(true); // Track if user is the author
    const navigate = useNavigate();
    const params = useParams();

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

    useEffect(() => {
        if (params.id) {
            readPost(params.id, (retrievedPost) => {
                setPost(retrievedPost);
                if (retrievedPost?.userId !== user?.uid) {
                    setIsAuthor(false);
                }
            });
        }
    }, [params.id, user]);

    useEffect(() => {
        if (post && isAuthor) {
            setValue('title', post.title);
            setSelCateg(post.category);
            setStory(post.story);
            if (post.photo?.url) setPhotoPreview(post.photo.url);
        }
    }, [post, isAuthor, setValue]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const acceptedFormats = ['jpg', 'png'];
            const extension = selectedFile.name.split('.').pop().toLowerCase();
            if (!acceptedFormats.includes(extension)) {
                alert('Invalid file format. Only JPG and PNG are allowed.');
                return;
            }
            if (selectedFile.size > 1 * 1024 * 1024) {
                alert('File size cannot exceed 1MB.');
                return;
            }
            setFile(selectedFile);
            setPhotoPreview(URL.createObjectURL(selectedFile));
        }
    };

    const onSubmit = async (data) => {
        if (!isAuthor) {
            alert('You are not authorized to edit this post.');
            return;
        }

        setLoading(true);
        try {
            let photo = post?.photo || {};

            if (!params.id && !file) {
                throw new Error('A cover photo is required when creating a new post.');
            }

            if (file) {
                const { url, id } = await uploadFile(file);
                photo = { url, id };
            }

            const newPostData = {
                title: data.title,
                story,
                category: selCateg,
                author: user.displayName,
                userId: user.uid,
                photo,
                likes: post?.likes || [],
            };

            if (params.id) {
                await updatePost(params.id, newPostData);
            } else {
                await addPost(newPostData);
                setUploaded(true);
                reset();
                setStory('');
                setPhotoPreview(null);
                setFile(null);
            }
        } catch (error) {
            console.error('Error saving post:', error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Box textAlign="center" mt={5}>
                <Typography variant="h5" color="text.secondary">
                    Please log in to create or edit posts.
                </Typography>
            </Box>
        );
    }

    if (!isAuthor && params.id) {
        return (
            <Box textAlign="center" mt={5}>
                <Typography variant="h5" color="error">
                    You are not authorized to edit this post.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/posts')}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: '800px',
                margin: 'auto',
                padding: '32px',
                backgroundColor: 'background.default',
                borderRadius: '8px',
                boxShadow: 3,
                mt: 3,
            }}
        >
            <Paper elevation={3} sx={{ padding: '24px' }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    {params.id ? 'Edit Post' : 'Create a New Post'}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Post Title */}
                    <TextField
                        {...register('title', { required: 'Post title is required' })}
                        label="Post Title"
                        fullWidth
                        margin="normal"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                    {/* Category Selection */}
                    <TextField
                        select
                        label="Category"
                        fullWidth
                        margin="normal"
                        value={selCateg}
                        onChange={(e) => setSelCateg(e.target.value)}
                        error={!selCateg}
                        helperText={!selCateg && 'Please select a category'}
                    >
                        {categories?.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Story Editor */}
                    <Box mt={3}>
                        <Typography variant="body1" gutterBottom>
                            Story
                        </Typography>
                        <Story story={story} setStory={setStory} />
                        {!story && (
                            <Typography color="error" variant="body2" mt={1}>
                                A story is required.
                            </Typography>
                        )}
                    </Box>

                    {/* File Upload */}
                    {!params.id && (
                        <Box mt={3}>
                            <Typography variant="body1" gutterBottom>
                                Upload Cover Photo
                            </Typography>
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                            />
                            {photoPreview && (
                                <Box mt={2} textAlign="center">
                                    <img src={photoPreview} alt="Preview" style={{ maxWidth: '100%' }} />
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Submit Button */}
                    <Box mt={4} textAlign="center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!selCateg || !story || loading}
                        >
                            {loading ? <CircularProgress size={24} /> : params.id ? 'Update Post' : 'Create Post'}
                        </Button>
                    </Box>
                </form>
                {uploaded && <Alerts txt="Successfully uploaded!" />}
            </Paper>
        </Box>
    );
};
