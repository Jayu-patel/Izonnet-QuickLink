import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = ({ children }) => {

  const [dToken, setDToken] = useState(``);
  const [appointments, setAppointments] = useState([])

  const getAllApointments=()=>{
    try{
      axios.get(`http://localhost:3000/api/doctor/appointment`, {headers: {Authorization: `Bearer ${localStorage.getItem('doctorToken')}`}})
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

  useEffect(()=>{
    const token = localStorage.getItem('doctorToken') || '';
      setDToken(token);
  },[])

  const value = {
    dToken,
    setDToken,
    appointments,
    getAllApointments
  }

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
}

export default DoctorContextProvider;