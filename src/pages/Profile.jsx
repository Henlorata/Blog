import React from 'react'
import { useContext } from 'react';

import { useForm } from 'react-hook-form';
import { UserContext } from '../context/UserContext';
import { useState } from 'react';
import { uploadFile } from '../utility/uploadFile';
import { Toastify } from '../components/Toastify';
import { useEffect } from 'react';
import { extractUrlAndId } from '../utility/utils';


export const Profile = () => {
  const {user,updateUser, msg}=useContext(UserContext)
  const [photo,setPhoto]=useState(null)
  const [loading,setLoading] = useState(false)
  const [avatar,setAvatar] = useState(null)

  useEffect(()=>{
	user?.photoURL && setAvatar(extractUrlAndId(user.photoURL).url)
  },[user])

  const {register, handleSubmit, formState: { errors } } = useForm({
    defaultValues:{
      displayName:user?.displayName || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data.displayName);
    try {
        const file = data?.file ? data.file[0] : null;
        let fileUrl = null;
        let fileId = null;

        if (file) {
            const uploadResponse = await uploadFile(file);

            if (uploadResponse) {
                const { url, id } = uploadResponse;
                fileUrl = url;
                fileId = id;
            } else {
                throw new Error('File upload failed');
            }
        }

        updateUser(data.displayName, fileUrl ? `${fileUrl}/${fileId}` : user.photoURL);
    } catch (error) {
        console.log(error);
        Toastify({ message: error.message, type: 'error' });
    } finally {
        setLoading(false);
    }
};

  return (
    <div className='page'>
      <div >
        <h3>Account settings</h3>
        <form onSubmit={handleSubmit(onSubmit)}>

          <div><label >Username: </label>
            <input {...register('displayName')} placeholder='username' type='text' />
          </div>
          <div><label >Profile pic: </label>
            <input {...register('file',{
              validate:(value)=>{
                  if(!value[0]) return true
                  const acceptedFormats=['jpg','png']
                  console.log(value[0]);
                  const fileExtension=value[0].name.split('.').pop().toLowerCase()
                  if(!acceptedFormats.includes(fileExtension)) return "Invalid file format"
                  if(value[0].size>1*1000*1024) return "Maximum file size 1MB!"
                  return true    
              }
            })}  type='file'
            onChange={(e)=>setAvatar(URL.createObjectURL(e.target.files[0]))}
            />
          </div>
          <input type="submit" />
        </form>
		{loading && <p>Loading...</p>}
		{msg && <Toastify {...msg}/>}
     {avatar && <img src={avatar} />}
      </div>
      
    </div>
  )
}


