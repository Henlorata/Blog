import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from "react-router-dom";
import {sanitizeHTML} from "../utility/utils.js";

export const Post = ({id, title, category, story, photo}) => {
    const navigate = useNavigate()
    return (
        <Card sx={{width: 345}}>
            <CardHeader
                title={title}
                subheader={category}
                onClick={() => navigate("/detail/" + id)}
            />
            <CardMedia
                component="img"
                height="194"
                image={photo['url']}
                alt={title}
                onClick={() => navigate("/detail/" + id)}
            />
            <CardContent onClick={() => navigate("/detail/" + id)}>
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    {sanitizeHTML(story).substring(0, 30)}
                </Typography>
            </CardContent>
        </Card>
    );
}