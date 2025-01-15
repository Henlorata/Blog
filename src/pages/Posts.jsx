import React, { useState, useEffect } from 'react';
import { Categories } from '../components/Categories';
import { CardsContainer } from '../components/CardsContainer';
import { readPosts } from '../utility/crudUtility';
import { useSearchParams } from 'react-router-dom';
import { SearchBox } from '../components/SearchBox.jsx';
import { Box, Typography, Divider } from '@mui/material';

export const Posts = () => {
    const [searchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [selCateg, setSelCateg] = useState(
        searchParams.get('ctg') ? [searchParams.get('ctg')] : []
    );

    useEffect(() => {
        readPosts(setPosts, selCateg);
    }, [selCateg]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Column for small screens, row for larger screens
                gap: 2,
                maxWidth: '1200px',
                margin: '0 auto',
                marginTop: '20px',
                padding: '20px',
                backgroundColor: 'background.default',
                borderRadius: '8px',
                boxShadow: 3,
            }}
        >
            {/* Sidebar for Categories */}
            <Box
                sx={{
                    width: { xs: '100%', md: '250px' }, // Full width on small screens, fixed width on larger screens
                    padding: '15px',
                    backgroundColor: 'background.paper',
                    borderRadius: '8px',
                    boxShadow: 1,
                    height: 'fit-content',
                }}
            >
                <Typography variant="h6" fontWeight="bold" marginBottom="10px">
                    Categories
                </Typography>
                <Categories selCateg={selCateg} setSelCateg={setSelCateg} />
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Search Box */}
                <Box
                    sx={{
                        padding: '15px',
                        backgroundColor: 'background.paper',
                        borderRadius: '8px',
                        boxShadow: 1,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" marginBottom="10px">
                        Search Posts
                    </Typography>
                    {posts && (
                        <SearchBox
                            items={posts.map((obj) => ({ id: obj.id, name: obj.title }))}
                        />
                    )}
                </Box>

                <Divider />

                {/* Cards Section */}
                <Box>
                    {posts && posts.length > 0 ? (
                        <CardsContainer posts={posts} />
                    ) : (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            textAlign="center"
                        >
                            No posts found. Try selecting a different category or searching
                            for another topic.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
