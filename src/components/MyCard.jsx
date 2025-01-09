import React from 'react'
import { sanitizeHTML } from '../utility/utils'
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap'
import './MyCard.css'
import { useNavigate } from 'react-router-dom'

export const MyCard = ({ id, title, category, story, photo }) => {
	const navigate=useNavigate()
	return (
		<Card className='myCard'
			style={{
				width: '18rem'
			}}
			onClick={()=>navigate("/detail/"+id)}
		>
			<img className='img-fluid'
				alt={title}
				src={photo['url']}
			/>
			<CardBody>
				<CardTitle tag="h5">
					{title}
				</CardTitle>
				<CardSubtitle className="mb-2 text-muted" tag="h6">
					{category}
				</CardSubtitle>
				<CardText>
					{sanitizeHTML(story).substring(0,30)}
				</CardText>
			</CardBody>
		</Card>
	)
}

