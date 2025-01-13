import React from 'react';
import { useContext } from 'react';
import { CategContext } from '../context/CategContext';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const { categories } = useContext(CategContext);
    const navigate = useNavigate();

    const handleCategoryClick = (name) => {
        navigate(`/posts?ctg=${name}`);
    };

    return (
        <Box
            sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                marginTop: '20px',
                padding: '20px',
                backgroundColor: 'background.default',
                borderRadius: '8px',
                boxShadow: 3,
            }}
        >
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Explore Categories
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Click on a category to see posts related to it.
                </Typography>
            </Box>

            {/* Categories Section */}
            <Grid container spacing={3}>
                {categories &&
                    categories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category.id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={category.photoUrl}
                                    alt={category.name}
                                />
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">
                                        {category.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
};
