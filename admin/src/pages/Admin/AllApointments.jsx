import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import ConfirmationPopup from '../../components/Pop-up'

export default function Appointments() {
  const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext)
  const {calculateAge, slotDateFormat} = useContext(AppContext)

  const [showPopup, setShowPopup] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)

  const handleSubmit = (appointmentId) => {
    setSelectedAppointmentId(appointmentId)
    setShowPopup(true)
  }

  const handleConfirm=()=>{
    cancelAppointment(selectedAppointmentId)
    setShowPopup(false)
  }
  const handleCancel=()=>{
    setShowPopup(false)
  }
  

  useEffect(()=>{
    if(aToken){
      getAllAppointments()
    }
  },[aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <ConfirmationPopup
          showPopup={showPopup}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          header={"Cancel Appointment"}
          message={"Are you sure you want to cancel this appointment?"}
          btnMessage={"Proceed"}
      />
      <p className='mb-3 md:text-2xl text-xl font-semibold'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {
          appointments?.map((item,index)=>(
            <div key={index} className='flex flex-wrap justify-between max-sm:gap sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
              <p>{index+1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item?.userId?.profile} alt="" />
                <p>{item?.userId?.username}</p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item?.userId?.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full bg-gray-200' src={item?.docId?.image} alt="" />
                <p>{item?.docId?.name}</p>
              </div>
              <p> ${item?.amount}</p>
              {
                item?.cancelled ? 
                <p className='text-red-400 text-xs font-medium'>Cancelled</p> :
                  item.isCompleted ?
                  <p className='text-green-400 text-xs font-medium'>Completed</p> :
                  <img onClick={()=>{handleSubmit(item._id)}} src="/cancel_icon.svg" alt="X"  className='cursor-pointer'/>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}
