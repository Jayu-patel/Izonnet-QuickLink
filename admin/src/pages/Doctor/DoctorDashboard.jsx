import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'

export default function DoctorDashboard() {

  const {dToken, dashData, getDashData, completeAppointment, cancelAppointment} = useContext(DoctorContext)
  const {slotDateFormat} = useContext(AppContext)

  useEffect(()=>{
    if(dToken){
      getDashData()
    }
  },[dToken])
  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={"/earning_icon.svg"} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>$ {dashData?.earning}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={"/appointments_icon.svg"} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={"/patients_icon.svg"} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>

      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={"/list_icon.svg"} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            dashData?.latestAppointments?.map((item,index)=>(
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item?.userId?.profile} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item?.userId?.username}</p>
                  <p className='text-gray-600'>{slotDateFormat(item?.slotDate)}</p>
                </div>
                {
                  item.cancelled
                  ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> 
                  : item.isCompleted 
                    ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                    : <div className='flex'>
                        <img className='w-10 cursor-pointer' onClick={()=>{cancelAppointment(item._id)}} src={"/cancel_icon.svg"} alt="" />
                        <img className='w-10 cursor-pointer' onClick={()=>{completeAppointment(item._id)}} src={"/tick_icon.svg"} alt="" />
                      </div>
                }
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}
