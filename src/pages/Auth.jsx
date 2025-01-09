import React from 'react'
import { useContext } from 'react'
import { Form, NavLink, useLocation } from 'react-router-dom'
import { Button, FormGroup, Input, Label } from 'reactstrap'
import { UserContext } from '../context/UserContext'
import { Toastify } from '../components/Toastify'
import { useEffect } from 'react'

const middleStyle={
	width:'300px',
	position:'absolute',
	top:'50%',
	left:'50%',
	transform:'translate(-50%, -50%)',
}

export const Auth = () => {
	const {user,signInUser, msg, setMsg, signUpUser}=useContext(UserContext)

	const location = useLocation()
	console.log(location.pathname);
	const isSignin = location.pathname == '/auth/in' //true
	

	console.log(msg);
	
useEffect(()=>{
	setMsg(null)
},[])
	const handleSubmit=(event)=>{
		event.preventDefault
		setMsg({...msg,err:null})
		const data = new FormData(event.currentTarget)
		console.log(data.get('email'), data.get('password'), data.get('displayName'));
		//signInUser(data.get('email'), data.get('password'))
		if(isSignin){
			signInUser(data.get('email'),data.get('password'))
		} else {
			signUpUser(data.get('email'),data.get('password'), data.get('displayName'))
		}
		
	}

	console.log(user);
	

	return (
		<div className='page'>
			<div style={middleStyle}>
				<h3>{isSignin ? 'Sign In' : 'Sign Up'}</h3>
				<Form onSubmit={handleSubmit}>
					<FormGroup>
						<Label>Email</Label>
						<Input
							name="email"
							placeholder="email"
							type="email"
						/>

					</FormGroup>
					<FormGroup>
						<Label>
							Password
						</Label>
						<Input
							name="password"
							placeholder="password"
							type="password"
						/>

					</FormGroup>
					{!isSignin &&
					<FormGroup>
						<Label>
							Username
						</Label>
						<Input name="displayName" type="text" placeholder='username'
						/>
					</FormGroup>
					}
					<Button>
						Submit
					</Button>
				</Form>
				{isSignin && (
					<NavLink to="/pwReset">
						<Button>Forgotten password</Button>
					</NavLink>

				)}
				{msg && <Toastify {...msg}/>}
			</div>
		</div>
	)
}