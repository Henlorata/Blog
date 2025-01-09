import React, { useState } from 'react';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import { NavLink, Outlet } from 'react-router-dom';
import { FaBlog } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useEffect } from 'react';
import { extractUrlAndId } from '../utility/utils';

export const Header = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { user, logoutUser } = useContext(UserContext)
	const [avatar,setAvatar] = useState(null)

	useEffect(()=>{
		user?.photoURL && setAvatar(extractUrlAndId(user.photoURL).url)
		!user && setAvatar(null)
	  },[user,user?.photoURL])
	

	console.log(user);


	const toggle = () => setIsOpen(!isOpen);

	return (
		<div className='headerContainer'>
			<Navbar className="nav" expand="md" style={{ borderBottom: '3px solid rgb(143, 121, 121)', backgroundColor:"rgb(143, 121, 121)", fontSize:"15px" }}>
				<NavbarBrand href="/"><FaBlog /></NavbarBrand>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="me-auto" navbar>

						<NavItem>
							<NavLink className="nav-link" to='/'>Home Page</NavLink>
						</NavItem>

						<NavItem>
							<NavLink className='nav-link' to='/posts'>Posts</NavLink>
						</NavItem>
						{user &&
						<NavItem>
							<NavLink className='nav-link' to='/create'>New Post</NavLink>
						</NavItem>
						}

					</Nav>

					{/*Autorizáció*/}

					<Nav navbar>
						{!user ?
							<>
								<NavItem>
									<NavLink className='nav-link' to="/auth/in">Log In</NavLink>
								</NavItem>

								<NavItem>
									<NavLink className='nav-link' to="/auth/up">Register</NavLink>
								</NavItem>
							</>
							: <>
								<NavItem>
									<NavLink className='nav-link' to="/" onClick={()=>logoutUser()}>Log out</NavLink>
								</NavItem>
								<UncontrolledDropdown nav inNavbar>
									<DropdownToggle nav caret>
										{avatar ? <img className='myavatar' src={avatar}/> : <RxAvatar title={user.displayName}/>}
									</DropdownToggle>
									<DropdownMenu end>
										<DropdownItem >
										<NavLink className='nav-link' to="/profile">Personal data</NavLink>
										</DropdownItem>
										<DropdownItem divider />
										<DropdownItem > 
										<NavLink className='nav-link' to="/deleteAccount">Delete account</NavLink>
										</DropdownItem>
									</DropdownMenu>
								</UncontrolledDropdown>
							</>
						}


					</Nav>

				</Collapse>
			</Navbar>
			<Outlet />
		</div>
	);
}
