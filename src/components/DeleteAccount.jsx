import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useConfirm } from 'material-ui-confirm'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const DeleteAccount = () => {
	const {user,logoutUser,deleteAccount} = useContext(UserContext)
	const confirm=useConfirm()
	const navigate=useNavigate()

	useEffect(()=>{
		!user && navigate('/')
	},[user])

	const handleDelete=async()=>{
		try {
			await confirm({
				description:"Warning! This action cannot be undone",
				confirmationText:"Yes",
				cancellationText:"No",
				title: "Are you sure you want to delete your account?"
			})
			await deleteAccount()
			logoutUser()
		} catch (error) {
			console.log("Cancel: ", error);
			
		}
	}

  return (
	<div className='page'>
		<button className="btn btn-danger" onClick={handleDelete}>Delete account</button>
	  
	</div>
  )
}