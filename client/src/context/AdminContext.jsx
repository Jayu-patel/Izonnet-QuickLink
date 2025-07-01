import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = ({ children }) => {

  const [aToken, setAToken] = useState(``);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([])
  const [dashData, setDeshData] = useState([])

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat =(slotDate)=>{
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

  const calculateAge=(dob)=>{
    const today = new Date()
    const birthDate = new Date(dob)
    
    let age = today.getFullYear() - birthDate.getFullYear()
    return age
  }

  const getDoctorsData = async () => {
    try{
      axios.get('/api/admin/doctor')
      .then((res)=>{
        if(res?.status === 200){
          console.log(res?.data?.doctors);
          setDoctors(res?.data?.doctors);
        }
        else {
          if(res?.response?.data?.message){
            toast.error(res?.response?.data?.message);
          }
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
    }
    catch(err){
      console.error("Error fetching doctors data:", err);
    }
  }

  const changeAvailablity=async(docId)=>{
    try{
      axios.put(`/api/admin/doctor/availablity`,{docId},{headers: {Authorization: `Bearer ${localStorage.getItem('adminToken')}`}})
      .then(res=>{
        if(res.status === 200){
          toast.success(res.data.message)
          getDoctorsData()
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
    }
    catch(err){
      toast.error(err.message)
    }
  }

  const getAllAppointments=async()=>{
    try{
      axios.get(`/api/admin/appointment`, {headers: {Authorization: `Bearer ${localStorage.getItem('adminToken')}`}})
      .then(res=>{
        if(res.status === 200){
          setAppointments(res.data.appointments)
        }
      })
      .catch((err)=>{
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
    }
    catch(err){
      toast.error(err.message)
    }
  }

  const cancelAppointment=async(appointmentId)=>{
      try{
          axios.post(`/api/admin/appointment/cancel`,
              {appointmentId},
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                  }
              }
          )
          .then(res=>{
              if(res.status === 200){
                  toast.success(res.data.message)
                  getAllAppointments()
              }
          })
          .catch((err) => {
              if(err?.response?.data?.message){
                  toast.error(err?.response?.data?.message);
              }
          });
      }
      catch(err){
          console.log(err?.message)
      }
  }

  const getDashData=async()=>{
    try{
      axios.get(`/api/admin/dashboard`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
        }
      )
      .then(res=>{
        if(res.status === 200){
          setDeshData(res.data.dashData)
        }
      })
      .catch((err) => {
          if(err?.response?.data?.message){
              toast.error(err?.response?.data?.message);
          }
      });
    }
    catch(err){
        toast.error(err?.message)
    }
  }

  const value = {
    aToken,
    setAToken,
    doctors,
    getDoctorsData,
    changeAvailablity,
    appointments,
    getAllAppointments,
    calculateAge,
    slotDateFormat,
    cancelAppointment,
    dashData,
    getDashData
  };

  useEffect(()=>{
    const token = localStorage.getItem('adminToken') || '';
    setAToken(token);
  },[])

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContextProvider;