import React, { useContext } from 'react';
import { CategContext } from '../context/CategContext';
import { Box, Typography } from '@mui/material';
import { CategoryCard } from '../components/CategoryCard.jsx';

export const Home = () => {
    const { categories } = useContext(CategContext);

    return (
        <Box
            className="title"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: 2,
            }}
        >
            <h1>Take a look</h1>
            <hr className='line'></hr>
            <Box
                className="imagesContainer"
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'center',
                    maxWidth: '1400px',
                }}
            >
                {categories &&
                    categories.map((obj) => (
                        <CategoryCard
                            name={obj.name}
                            photoUrl={obj.photoUrl}
                            key={obj.name}
                        />
                    ))}
            </Box>
        </Box>
    );
};
