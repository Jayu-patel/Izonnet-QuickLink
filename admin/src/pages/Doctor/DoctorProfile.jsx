import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function DoctorProfile() {
  const {dToken, profileData, getProfileData, setProfileData} =  useContext(DoctorContext)
  const [isEdit, setIsEdit] = useState(false)

  const updateProfile=()=>{
    try{
      axios.put(`${import.meta.env.VITE_BACKEND_URL}/doctor/update-profile`,
        {
          address: profileData.address,
          fees: profileData.fees,
          available: profileData.available,
          about: profileData.about,
          name: profileData.name,
        },
        {
          headers : {Authorization: `Bearer ${localStorage.getItem('doctorToken')}`}
        }
      )
      .then(res=>{
        if(res.status === 200){
          toast.success(res.data.message)
          setIsEdit(false)
          getProfileData()
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
    }
    catch(error){
      toast.error(error.message)
    }
  }
  
  useEffect(()=>{
    if(dToken){
      getProfileData()
    }
  },[dToken])
  return profileData && (
    <div>

      <div className='flex flex-col gap-4 m-5'>
        <div>
          <img className='bg-[#5f6fff] w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
        </div>

        <div className='flex-1 border-stone-100 rounded-lg p-8 py-7 bg-white'>
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {
              isEdit ?
              <input 
                type='text' 
                className='border-2 border-blue-600' 
                value={profileData.name}
                onChange={(e)=>{setProfileData(prev => ({...prev, name: e.target.value}))}}
              /> :
              profileData.name
            }
          </p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
              {
                isEdit ?
                <textarea className='w-[700px] h-[80px] border-2 border-blue-600' 
                  type='text' 
                  value={profileData.about}
                  onChange={(e)=>{setProfileData(prev => ({...prev, about: e.target.value}))}}
                /> :
                profileData.about
              }
            </p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: 
            <span className='text-gray-800'>
              $ {isEdit ? <input className='border-2 border-blue-600' type="number" value={profileData.fees} onChange={(e)=>{setProfileData(prev => ({...prev, fees: e.target.value}))}} /> : profileData.fees}
            </span>
          </p>

          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {
                isEdit ? <input className='border-2 border-blue-600' type="text" value={profileData?.address?.line1} onChange={(e)=>{setProfileData(prev=>({...prev, address : {...prev.address, line1: e.target.value}}))}} /> :
                profileData?.address?.line1
              }
              <br />
              {
                isEdit ? <input className='border-2 border-blue-600' type="text" value={profileData?.address?.line2} onChange={(e)=>{setProfileData(prev=>({...prev, address : {...prev.address, line2: e.target.value}}))}} /> :
                profileData?.address?.line2
              }
            </p>
          </div>

          <div className='flex gap-2 pt-2'>
            <input checked={!!profileData.available} onChange={()=> isEdit && setProfileData(prev=> ({...prev, available: !prev.available})) } type="checkbox" />
            <label htmlFor="">Available</label>
          </div>

          {
            isEdit ?
            <button
              onClick={()=>{updateProfile()}}
              className='px-8 py-2 border border-[#5f6fff] text-sm rounded-full mt-5 hover:bg-[#5f6fff] hover:text-white transition-all cursor-pointer'>
                Save
            </button> :
            <button
              onClick={()=>{setIsEdit(true)}}
              className='px-8 py-2 border border-[#5f6fff] text-sm rounded-full mt-5 hover:bg-[#5f6fff] hover:text-white transition-all cursor-pointer'>
                Edit
            </button>
          }
          {
            isEdit
            ? <button className='cursor-pointer border border-red-400 px-8 py-2 ml-2 rounded-full hover:bg-red-400 hover:text-white transition-all' onClick={()=>{setIsEdit(false); getProfileData()}}>Cancel</button>
            : <></>
          }
          
        </div>
      </div>

    </div>
  )
}
