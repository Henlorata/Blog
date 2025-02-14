import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';

export const CategoryCard = ({ name, photoUrl }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/posts?ctg=${name}`);
  };

  return (
      <Card
          sx={{
            maxWidth: 345,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          className="hover-underline-animation"
      >
        <CardActionArea onClick={handleCardClick}>
          <CardMedia
              component="img"
              height="140"
              image={photoUrl}
              alt="Category photo"
          />
          <CardContent>
            <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="hover-bold"
            >
              {name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
  );
};
