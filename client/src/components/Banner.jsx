import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/Appcontext'

export default function Banner() {
  const {token} = useContext(AppContext)
  const navigate = useNavigate()

  if(token) return <></>
  return (
    <div className='flex bg-[#5f6fff] rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
            <div className='text-xl sm:text-2xl md:text-3xl lg:5xl font-semibold text-white'>
                <p>Book Appointment</p>
                <p className='mt-4'>With 100+ Trusted Doctors</p>
            </div>
            <button
              onClick={()=>{navigate("/login")}}
              className='cursor-pointer bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'
            >
              Create Account
            </button>
        </div>

        <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
            <img className='absolute w-full bottom-0 right-0 max-w-md' src={"/appointment_img.png"} alt="" />
        </div>
    </div>
  )
}
