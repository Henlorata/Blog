import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { UserContext } from '../context/UserContext';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useConfirm } from 'material-ui-confirm';
import { deletePost, readPost, toggleLikes } from '../utility/crudUtility';
import { delPhoto } from '../utility/uploadFile';
import { Alerts } from '../components/Alerts';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
} from '@mui/material';

export const Detail = () => {
    const { user } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const confirm = useConfirm();
    const params = useParams();
    const navigate = useNavigate();
    const [txt, setTxt] = useState(null);

    useEffect(() => {
        readPost(params.id, setPost);
    }, [params.id]);

    const handleDelete = async () => {
        try {
            await confirm({
                description: "Warning! This action cannot be undone.",
                confirmationText: "Yes",
                cancellationText: "No",
                title: "Are you sure you want to delete this post?",
            });
            await deletePost(post.id);
            await delPhoto(post.photo.id);
            navigate('/posts');
        } catch (error) {
            console.log("Cancel: ", error);
        }
    };

    const handleLikes = () => {
        if (!user) setTxt("You must be logged in to like!");
        else toggleLikes(post.id, user.uid);
    };

    return (
        <Box
            className="page"
            sx={{
                maxWidth: 800,
                margin: '20px auto',
                padding: '20px',
                boxShadow: 3,
                borderRadius: '8px',
                backgroundColor: '#fff',
            }}
        >
            {post && (
                <Card>
                    <CardMedia
                        component="img"
                        height="300"
                        image={post.photo['url']}
                        alt={post.title}
                    />
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {parse(post.story)}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '20px',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton onClick={handleLikes} color="primary">
                                    👍
                                </IconButton>
                                <Typography variant="body2" sx={{ marginLeft: '8px' }}>
                                    {post?.likes.length} {post?.likes.length === 1 ? 'Like' : 'Likes'}
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/posts')}
                            >
                                Return
                            </Button>
                        </Box>

                        {user && post && user.uid === post.userId && (
                            <Box sx={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<MdDelete />}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<MdEdit />}
                                    onClick={() => navigate(`/update/${post.id}`)}
                                >
                                    Edit
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {txt && <Alerts txt={txt} err={false} />}
        </Box>
    );
};
