import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = ({ children }) => {
  const [dToken, setDToken] = useState(``)
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState([])
  const [profileData, setProfileData] = useState({})

  const getAllApointments=()=>{
    try{
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/doctor/getDoctorsAppointment`, 
        {
          withCredentials: true,
          headers: {Authorization: `Bearer ${localStorage.getItem('doctorToken')}`}
        }
      )
      .then(res=>{
        if(res.status === 200){
          setAppointments(res.data.appointments)
          console.log(res.data.appointments)
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
    }
    catch(error){
      toast.error(error.message)
    }
  }

  const completeAppointment=(appointmentId)=>{
    try{
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/doctor/complete-appointment`, 
        {appointmentId},
        {
          headers : {Authorization: `Bearer ${localStorage.getItem('doctorToken')}`}
        }
      )
      .then(res=>{
        if(res.status === 200){
          toast.success(res.data.message)
          getAllApointments()
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
      
    }
    catch(error){
      toast.error(error.message)
    }
  }

  const cancelAppointment=(appointmentId)=>{
    try{
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/doctor/cancel-appointment`, 
        {appointmentId},
        {
          headers : {Authorization: `Bearer ${localStorage.getItem('doctorToken')}`}
        }
      )
      .then(res=>{
        if(res.status === 200){
          toast.success(res.data.message)
          getAllApointments()
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
      
    }
    catch(error){
      toast.error(error.message)
    }
  }

  const getDashData=()=>{
    try{
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/doctor/dashboard`,
        {
          headers : {Authorization: `Bearer ${localStorage.getItem('doctorToken')}`}
        }
      )
      .then(res=>{
        if(res.status === 200){
          setDashData(res.data.dashData)
          console.log(res.data.dashData)
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
    }
    catch(error){
      toast.error(error.message)
    }

  }

  const getProfileData=()=>{
    try{
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/doctor/profile`,
        {
          headers : {Authorization: `Bearer ${localStorage.getItem('doctorToken')}`}
        }
      )
      .then(res=>{
        if(res.status === 200){
          setProfileData(res.data.profileData)
          console.log(res.data.profileData)
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
      
    }
    catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    const token = localStorage.getItem('doctorToken') || '';
      setDToken(token);
  },[])

  const value = {
    dToken, setDToken,
    appointments, getAllApointments,
    completeAppointment,
    cancelAppointment,
    dashData, getDashData,
    profileData, getProfileData, setProfileData
  }
  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
}

export default DoctorContextProvider;