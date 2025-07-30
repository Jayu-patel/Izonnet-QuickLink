import removeCookie from '../utils/removeCookie'
import { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'
import ConfirmationPopup from './Pop-up'

export default function AdminNavbar() {
    const {aToken, setAToken} = useContext(AdminContext)
    const {dToken, setDToken} = useContext(DoctorContext)

    const [showPopup, setShowPopup] = useState(false)
    const navigate = useNavigate()

    const logout=()=>{
        aToken && setAToken('')
        aToken && localStorage.removeItem('adminToken')
        removeCookie('adminToken')

        dToken && setDToken('')
        dToken && localStorage.removeItem('doctorToken')
        removeCookie('doctorToken')
        navigate('/')
    }

    const cancelLogout=()=>{
        setShowPopup(false)
    }
    
    return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className='absolute'>
            <ConfirmationPopup
                showPopup={showPopup}
                handleConfirm={logout}
                handleCancel={cancelLogout}
                header={"Logout Confirmation"}
                message={"Are you sure you want to logout?"} 
                btnMessage={"Log Out"} 
            />
        </div>
        <div className='flex items-center gap-2'>
            <h1 onClick={()=>{aToken ? navigate('/admin-dashboard') : navigate('/doctor-dashboard')}} className='text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold cursor-pointer'>QuickClinic</h1>
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 text-xs'>{aToken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick={()=>{setShowPopup(true)}} className='cursor-pointer bg-[#5f6fff] text-white text-sm px-10 py-2 rounded-full shadow-[1px_4px_12px_rgba(0,0,0,0.2)]'>Logout</button>
    </div> 
    )
}
