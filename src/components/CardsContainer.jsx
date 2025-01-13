import React from 'react';
import { Box } from '@mui/material';
import { Post } from './Post.jsx';

export const CardsContainer = ({ posts }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center',
            }}
        >
            {posts.map((obj) => (
                <Post key={obj.id} {...obj} />
            ))}
        </Box>
    );
};
