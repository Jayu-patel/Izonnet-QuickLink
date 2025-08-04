import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import ConfirmationPopup from '../../components/Pop-up'
import Loader from '../../components/Loader'

export default function Appointments() {
  const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext)
  const {calculateAge, slotDateFormat} = useContext(AppContext)

  const [loading, setLoading] = useState(false)

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
    const fetchAppointment=async()=>{
      setLoading(true);
      await getAllAppointments()
      setLoading(false)
    }

    if(aToken){
      fetchAppointment()
    }
  },[aToken])

  if(appointments.length == 0) return <div className='w-[100%] h-[calc(100vh-100px)] grid place-items-center'> <Loader/> </div>
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
            <div key={index} className='hidden max-sm:gap-1 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 odd:bg-gray-100'>
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
        {/* ------------------------------ mobile ------------------------------ */}
        <div className='sm:hidden bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
          {appointments?.map((item, index) => (
            <div key={index} className='border-b px-4 py-3 text-gray-700 text-sm'>
              <div className='flex justify-between mb-2'>
                <span className='font-semibold'>#{index + 1}</span>
                {item?.cancelled ? (
                  <span className='text-red-500 text-xs font-semibold'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='text-green-500 text-xs font-semibold'>Completed</span>
                ) : (
                  <img
                    onClick={() => handleSubmit(item._id)}
                    src="/cancel_icon.svg"
                    alt="Cancel"
                    className='cursor-pointer'
                  />
                )}
              </div>

              <div className='flex items-center gap-2 mb-2'>
                <img className='w-7 h-7 rounded-full' src={item?.userId?.profile} alt="" />
                <div>
                  <p className='font-medium'>{item?.userId?.username}</p>
                  <p className='text-xs text-gray-500'>Age: {calculateAge(item?.userId?.dob)}</p>
                </div>
              </div>

              <div className='mb-2'>
                <p className='text-gray-600'>🗓 {slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              </div>

              <div className='flex items-center gap-2 mb-2'>
                <img className='w-7 h-7 rounded-full bg-gray-200' src={item?.docId?.image} alt="" />
                <p>{item?.docId?.name}</p>
              </div>

              <p className='text-gray-700'> ${item?.amount}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
