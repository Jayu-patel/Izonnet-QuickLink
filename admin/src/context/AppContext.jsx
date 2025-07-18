import { createContext, useEffect, useState, useMemo } from "react";
import {toast} from "react-toastify"
import axios from "axios"

export const AppContext = createContext()

const AppContextProvider=({children})=>{

    const [specialities, setSpecialities] = useState([])

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

    const getSpeciality=async()=>{
        try{
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/speciality/get-all-specialities`)
            .then(res=>{
                if(res?.status === 200){
                    setSpecialities(res?.data?.specialities)
                    console.log(res?.data?.specialities)
                }
            })
            .catch((err) => {
                if(err?.response?.data?.message){
                    toast.error(err?.response?.data?.message);
                }
            });
        }
        catch(err) {
            toast.error(err.message)
        }
    }

    useEffect(()=>{getSpeciality()},[])

    const value = useMemo(()=>({
        slotDateFormat,
        calculateAge,
        specialities
    }),[specialities])
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider