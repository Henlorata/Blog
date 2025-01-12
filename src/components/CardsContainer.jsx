import React from 'react'
import {MyCard} from './MyCard'
import {Post} from "./Post.jsx";


export const CardsContainer = ({posts}) => {
    return (
        <div className='cardsContainer'>
            {posts && posts.map(obj => <Post key={obj.id} {...obj}/>)}
        </div>
    )
}

