import React from 'react'
import {auth} from '../utility/firebaseApp'
import {
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth'
import {createContext} from 'react'
import {useState} from 'react'
import {useEffect} from 'react'

export const UserContext = createContext()

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [msg, setMsg] = useState(null)

    console.log(msg);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    const signInUser = async (email, password) => {
        setMsg(null)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setMsg({...msg, signin: 'Successfully logged in'})
        } catch (error) {
            console.log(error);
            setMsg({...msg, err: error.message})

        }
    }

    const logoutUser = async () => {
        await signOut(auth)
        setMsg(null)
    }

    const signUpUser = async (email, password, displayName) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password, displayName)
            await updateProfile(auth.currentUser, {displayName})
            console.log('Successfully signed up');

        } catch (error) {
            console.log(error);
            setMsg({...msg, err: error.message})

        }
    }
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email)
            console.log('Email sent');

            setMsg({})//
            setMsg({resetPW: "Password reset email sent"})//
        } catch (error) {
            setMsg({err: error.message})//
            console.log(error);

        }
    }

    const updateCredentials = async (displayName) => {
        try {
            await updateProfile(auth.currentUser, {displayName})
            setMsg({})//
            setMsg({update: "Successfully updated"})//
        } catch (error) {
            setMsg({err: error.message})//
        }
    }
    const updateUser = async (displayName, photoURL) => {
        try {
            if (displayName && photoURL) await updateProfile(auth.currentUser, {displayName, photoURL})
            else if (displayName) await updateProfile(auth.currentUser, {displayName})
            else if (photoURL) await updateProfile(auth.currentUser, {photoURL})
            setMsg({})//
            setMsg({update: "Successfully updated"})//
        } catch (error) {
            setMsg({err: error.message})//
        }
    }

    const deleteAccount = async () => {
        try {
            await deleteUser(auth.currentUser)
            console.log("Account deleted");

        } catch (error) {
            console.log(error);

        }
    }


    return (<UserContext.Provider value={{
        user,
        signInUser,
        logoutUser,
        signUpUser,
        msg,
        setMsg,
        resetPassword,
        updateCredentials,
        updateUser,
        deleteAccount
    }}>
        {children}
    </UserContext.Provider>)
} 