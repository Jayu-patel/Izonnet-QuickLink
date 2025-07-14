import { useContext, useEffect, useState } from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom'
import './App.css'
import { AppContext } from './context/Appcontext'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import PaymentSuccess from './components/PaymentSuccess'
import GenerateOtp from './pages/GenerateOtp'
import ResetPassword from './pages/ResetPassword'
import { jwtDecode } from 'jwt-decode'
import CancelPayment from './components/CancelPayment'

function App() {
  const {setToken, setUserId} = useContext(AppContext)
  useEffect(() => {
    const newToken = new URLSearchParams(window.location.search).get("token");
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken)
      setUserId(jwtDecode(newToken)?.id)

      const cookie = document.cookie.split("; ").find((row) => row.startsWith("temp_auth_token="))?.split("=")[1];
      console.log("my-cookie", cookie)
    }
  }, []);

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/my-appointment' element={<MyAppointment/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>} />
        <Route path='/generate-otp' element={<GenerateOtp/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />

        <Route path='/success-payment' element={<PaymentSuccess/>} />
        <Route path='/cancel-payment' element={<CancelPayment/>} />
      </Routes>
    </div>
  )
}

export default App
