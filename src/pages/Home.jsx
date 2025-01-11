import React from 'react'
import {useContext} from 'react'
import {CategContext} from '../context/CategContext'
import {Card, CardBody, CardTitle} from 'reactstrap'
import {NavLink} from 'react-router-dom'
import {CategoryCard} from "../components/CategoryCard.jsx";


export const Home = () => {

    const {categories} = useContext(CategContext)
    console.log(categories);

    return (
        <div className='title'>
            <h1>Take a look</h1>
            <hr className='line'></hr>
            <div className='imagesContainer'>
                {categories && categories.map(obj =>
                    <CategoryCard name={obj.name} photoUrl={obj.photoUrl} key={obj.name}/>
                )}
            </div>
        </div>
    )
}
