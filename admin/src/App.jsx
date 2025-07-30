import { ToastContainer } from 'react-toastify'
import './App.css'
import Login from './pages/Login'
import { useContext, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import {Route, Routes} from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import AllApointments from './pages/Admin/AllApointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import SideBar from './components/SideBar'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointment from './pages/Doctor/DoctorAppointment'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'
import ProtectedRoute from './components/ProtectedRoute'
import EditDoctor from './pages/Admin/EditDoctor'
import AddSpeciality from './pages/Admin/AddSpeciality'
import Specialities from './pages/Admin/Specialities'
import EditSpeciality from './pages/Admin/EditSpeciality'
import Admin from './pages/Admin/Admin'
import AddNewAdmin from './pages/Admin/AddNewAdmin'
import GenerateOtp from './pages/Doctor/GenerateOtp'
import ResetPassword from './pages/Doctor/ResetPassword'

function App() {
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {setIsMounted(true);}, []);
  if (!isMounted) return null;

  return (aToken || dToken) ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <SideBar/>
        <Routes>
          <Route path='/' element={<ProtectedRoute><></></ProtectedRoute>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-appointments' element={<AllApointments/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/edit-doctor/:docId' element={<EditDoctor/>} />
          <Route path='/doctor-list' element={<DoctorsList/>} />
          <Route path='/specialities' element={<Specialities/>} />
          <Route path='/add-speciality' element={<AddSpeciality/>} />
          <Route path='/edit-speciality/:id' element={<EditSpeciality/>} />
          <Route path='/admin' element={<Admin/>} />
          <Route path='/add-new-admin' element={<AddNewAdmin/>} />

          <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-appointments' element={<DoctorAppointment/>} />
          <Route path='/doctor-profile' element={<DoctorProfile/>} />
        </Routes>
      </div>
    </div>
  )
  : (
    <>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/generate-otp' element={<GenerateOtp />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App
