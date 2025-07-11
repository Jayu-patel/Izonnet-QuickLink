import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

export default function DoctorAppointment() {
  const {dToken, appointments, getAllApointments, completeAppointment, cancelAppointment} = useContext(DoctorContext)
  const {calculateAge, slotDateFormat} = useContext(AppContext)

  useEffect(()=>{
    if(dToken){
      getAllApointments()
    }
  },[dToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <h1 className='mb-3 font-medium text-lg'>Appointments</h1>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {
          appointments?.map((item,index)=>(
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b' key={index}>

              <p className='max-sm:hidden'>{index+1}</p>

              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item?.userId?.profile} alt="" />
                <p>{item?.userId?.username}</p>
              </div>

              <div>
                <p className='text-xs inline border border-[#5f6fff] px-2 rounded-full'>{item.payment ? "Online" : "CASH"}</p>
              </div>

              <p className='max-sm:hidden'>{calculateAge(item?.userId?.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>${item.amount}</p>
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
  )
}
