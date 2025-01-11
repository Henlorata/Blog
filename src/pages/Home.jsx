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
        <div className='title' style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center'}}>
            <h1>Take a look</h1>
            <hr className='line'></hr>
            <div className='imagesContainer' style={{maxWidth: '1400px'}}>
                {categories && categories.map(obj =>
                    <CategoryCard name={obj.name} photoUrl={obj.photoUrl} key={obj.name}/>
                )}
            </div>
        </div>
    )
}
