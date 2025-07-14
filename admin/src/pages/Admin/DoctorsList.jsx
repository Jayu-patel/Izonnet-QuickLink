import Loader from '../../components/Loader';
import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function DoctorsList() {

  const {doctors, getDoctorsData, changeAvailablity} = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    getDoctorsData();
  }, [])
  if(doctors.length === 0) return <div className='w-[100%] h-[calc(100vh-100px)] grid place-items-center'> <Loader/> </div>
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='md:text-2xl text-xl font-semibold'>Doctors List</h1>

      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors?.map((doctor, index) =>{
            return (
              <div onClick={()=>{navigate(`/edit-doctor/${doctor._id}`)}} className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                <img className='bg-indigo-50 group-hover:bg-[#5f6fff] transition-all duration-500' src={doctor.image} alt="" />
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium'>{doctor.name}</p>
                  <p className='text-zinc-600 text-sm'>{doctor.speciality}</p>
                  <div className='mt-2 flex items-center gap-1 text-sm'>
                    <input onChange={()=>changeAvailablity(doctor._id)} type="checkbox" checked={doctor.available} id="" />
                    <p className=''>Available</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
