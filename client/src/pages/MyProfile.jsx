import { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { AppContext } from '../context/Appcontext';
import {Navigate} from 'react-router-dom'

export default function MyProfile() {
  const {reloadProfile: loadUserProfileData, userData : data, isLoading, token} = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [userData, setUserData] = useState({
    username: "Enter you details",
    image: "Enter you details",
    email: "Enter you details",
    phone: 1111111111,
    gender: 'Enter you details',
    dob: 'Enter you details',
    address: {
      line1: "Enter you details",
      line2: "Enter you details",
    }
  })

  

  const updateUserProfile=async()=>{
    setLoading(true)
    const formData = new FormData()

    formData.append('username', userData.username)
    formData.append('mobile', userData.phone)
    formData.append('dob', userData.dob)
    formData.append('gender', userData.gender)
    formData.append('address', JSON.stringify(userData.address))
    formData.append('image', image)

    axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/update/${data?.id}`, 
      formData,
      {
        headers: {
          // Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then(async(res)=>{
      if(res.status !== 200){
        if(err?.response?.data?.message){
            toast.error(err?.response?.data?.message);
        }
      }
      else{
        toast.success(res?.data?.message,{
          autoClose: 2000,
        })
        localStorage.removeItem("currentUser")
        setImage(false)
      }
      setLoading(false)
      await loadUserProfileData()
    })
    .catch(async(err) =>{
        if(err?.response?.data?.message){
            toast.error(err?.response?.data?.message, {
                autoClose: 2000,
            });
        }
        setLoading(false)
    })
  }

  useEffect(() => {
    if (!data) return;
    setUserData(prev => ({
      ...prev,
      username: data.username || "Enter your details",
      image: data.profile || "Enter your details",
      email: data.email || "Enter your details",
      phone: data.mobile || 1111111111,
      gender: data.gender || "Enter your details",
      dob: data.dob || "Enter your details",
      address: data.address || { line1: "Enter your details", line2: "Enter your details" }
    }));
  }, [data]);

  if(!token) return <Navigate to={'/'} />

  if(isLoading || loading) return <div className='w-[100%] h-[calc(100vh-100px)] grid place-items-center'> <Loader/> </div>
  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {
        isEdit ? 
        <label htmlFor="image">
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
            {/* <img className='w-10 absolute bottom-12 right-12' src={image ? "/img" : '/upload_icon.png'} alt="" /> */}
            <img className='w-10 absolute bottom-12 right-12' src={image ? "/img" : '/upload_icon.png'} alt="" />
          </div>
          <input type="file" id="image" hidden onChange={e=> setImage(e.target.files[0])} />
        </label> :
        <img className='w-36 rounded' src={userData.image} alt="" />
      }
      {
        isEdit
        ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type='text' value={userData.username ?? ""} onChange={e=> setUserData(prev=> ({...prev, username: e.target.value}))} />
        : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.username}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone: </p>
          {
            isEdit
            ? <input className='bg-gray-100 max-w-52' type='text' value={userData.phone ?? ""} onChange={e=> setUserData(prev=> ({...prev, phone: e.target.value}))} />
            : <p className='text-blue-400'>{userData.phone}</p>
          }

          <p className='font-medium'>Address</p>
          {
            isEdit ?
            <p>
              <input className='bg-gray-50' onChange={e=>{setUserData(prev=> ({...prev, address: {...prev.address, line1: e.target.value}}))}} value={userData.address.line1} type="text" />
              <br/>
              <input className='bg-gray-50' onChange={e=>{setUserData(prev=> ({...prev, address: {...prev.address, line2: e.target.value}}))}} value={userData.address.line2} type="text" />
            </p> :
            <p className='text-gray-500'>
              {userData?.address?.line1}
              <br />
              {userData?.address?.line2}
            </p>
          }
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit
            ? <select value={userData.gender} className='max-w-20 bg-gray-100' onChange={e=> setUserData(prev=> ({...prev, gender: e.target.value}))}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            : <p className='text-gray-400'>{userData.gender}</p>
          }

          <p className='font-medium'>Birthday:</p>
          {
            isEdit
            ? <input className='max-w-28 bg-gray-100' type='date' value={userData.dob ?? ""} onChange={e=> setUserData(prev=> ({...prev, dob: e.target.value}))} />
            : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>

      <div className='mt-10'>
        {
          isEdit
          ? <button className='cursor-pointer border border-[#5f6fff] px-8 py-2 rounded-full hover:bg-[#5f6fff] hover:text-white transition-all' onClick={()=>{setIsEdit(false); updateUserProfile()}}>Save Information</button>
          : <button className='cursor-pointer border border-[#5f6fff] px-8 py-2 rounded-full hover:bg-[#5f6fff] hover:text-white transition-all' onClick={()=>setIsEdit(true)}>Edit</button>
        }
        {
          isEdit
          ? <button className='cursor-pointer border border-red-400 px-8 py-2 ml-2 rounded-full hover:bg-red-400 hover:text-white transition-all' onClick={()=>{setIsEdit(false); loadUserProfileData()}}>Cancel</button>
          : <></>
        }
      </div>
    </div>
  )
}
