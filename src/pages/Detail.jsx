import React from 'react'
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import parse from 'html-react-parser'
import {useContext} from 'react';
import {UserContext} from '../context/UserContext';
import {MdDelete} from 'react-icons/md';
import {useConfirm} from 'material-ui-confirm';
import {deletePost, readPost, toggleLikes} from '../utility/crudUtility';
import {delPhoto} from '../utility/uploadFile';
import {Alerts} from '../components/Alerts'

export const Detail = () => {
    const {user} = useContext(UserContext)
    const [post, setPost] = useState(null)
    const confirm = useConfirm()
    const params = useParams()
    const navigate = useNavigate()
    const [txt, setTxt] = useState(null)
    console.log(params.id);


    useEffect(() => {
        readPost(params.id, setPost)
    }, [])

    const handleDelete = async () => {
        try {
            await confirm({
                description: "Warning! This action cannot be undone",
                confirmationText: "Yes",
                cancellationText: "No",
                title: "Are you sure you want to delete your account?"
            })
            deletePost(post.id)
            delPhoto(post.photo.id)
            navigate('/posts')
        } catch (error) {
            console.log("Cancel: ", error);

        }
    }

    post && console.log(post);

    const handleLikes = () => {
        if (!user) setTxt("You must be logged in to like!")
        else toggleLikes(post.id, user.uid)
    }


    return (
        <div className='page'>
            {post && <>
                <img src={post.photo['url']} alt={post.title} style={{maxWidth: "300px"}}/>
                <p>{parse(post.story)}</p>
            </>}
            <button className='btn btn-secondary' onClick={() => navigate('/posts')}>Return</button>
            <button onClick={handleLikes}>👍</button>
            <span>Number of likes: {post?.likes.length}</span>

            {user && post && (user.uid === post.userId) &&
                <>
                    <button onClick={handleDelete}><MdDelete/></button>
                    <button onClick={() => navigate('/update/' + post.id)}>Edit</button>
                </>
            }
            {txt && <Alerts txt={txt} err={false}/>}
        </div>
    )
}
