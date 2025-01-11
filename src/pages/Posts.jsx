import React from 'react'
import {Categories} from '../components/Categories'
import {CardsContainer} from '../components/CardsContainer'
import {useState} from 'react'
import {useEffect} from 'react'
import {readPosts} from '../utility/crudUtility'
import {useSearchParams} from 'react-router-dom'
import {SearchBox} from "../components/SearchBox.jsx";

export const Posts = () => {
    const [searchParams] = useSearchParams()
    const [posts, setPosts] = useState([])
    const [selCateg, setSelCateg] = useState(searchParams.get('ctg') ? [searchParams.get('ctg')] : [])

    console.log(searchParams.get('ctg'));
    console.log(selCateg);

    useEffect(() => {
        readPosts(setPosts, selCateg)
    }, [selCateg])
    posts && console.log(posts);

    return (<div className='page'>
        <Categories selCateg={selCateg} setSelCateg={setSelCateg}/>
        {posts && <SearchBox items={posts.map(obj => ({id: obj.id, name: obj.title}))}/>}
        <CardsContainer posts={posts}/>
    </div>)
}
