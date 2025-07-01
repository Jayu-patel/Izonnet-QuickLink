import removeCookie from '../utils/removeCookie'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

export default function AdminNavbar() {
    const {aToken, setAToken} = useContext(AdminContext)
    const {dToken, setDToken} = useContext(DoctorContext)
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
    return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className='flex items-center gap-2'>
            <h1 onClick={()=>{aToken ? navigate('/admin-dashboard') : navigate('/doctor-dashboard')}} className='text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold cursor-pointer'>QuickClinic</h1>
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 text-xs'>{aToken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick={logout} className='cursor-pointer bg-[#5f6fff] text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div> 
    )
}
