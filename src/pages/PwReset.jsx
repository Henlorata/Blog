import React from 'react'

import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Toastify } from '../components/Toastify'
const middleStyle={
	width:'300px',
	position:'absolute',
	top:'50%',
	left:'50%',
	transform:'translate(-50%, -50%)',
}


export const PwReset = () => {
  const {msg,resetPassword}=useContext(UserContext)

  const handleSubmit=(event)=>{
    event.preventDefault()
     const data=new FormData(event.currentTarget)
     console.log(data.get('email'));
     
   resetPassword(data.get('email'))
  }
  return (
    <div className='page'>
    <div  style={middleStyle}	>
     <h3>Jelszó módosítás</h3>
     <Form onSubmit={handleSubmit}>
       <FormGroup>
         <Label > Email  </Label>
         <Input   name="email"    placeholder="email"    type="email"    />
       </FormGroup>
       
       <Button>Set new password</Button>
     </Form>
     
     {msg && <Toastify  {...msg}/>}
    </div>
   </div>
  )
}


