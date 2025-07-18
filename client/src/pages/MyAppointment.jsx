import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { AppContext } from '../context/Appcontext'
import { loadStripe } from '@stripe/stripe-js';

export default function MyAppointment() {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    const {userId, getDoctorsData} = useContext(AppContext)
    const [appointments, setAppointsments] = useState([])
    const [loading, setLoading] = useState(false)
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const navigate = useNavigate()

    const slotDateFormat =(slotDate)=>{
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const getAppointsments=async()=>{
        setLoading(true)
        try{
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/appointment/get_user_appointment`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            .then(res=>{
                if(res?.status === 200){
                    setAppointsments(res?.data?.appointments?.reverse())
                }
                else{
                    toast.error("Can't find any appointments");
                }
            })
            .catch((err) => {
                if(err?.response?.data?.message){
                    toast.error(err?.response?.data?.message);
                }
            });
            setLoading(false)
        }
        catch(err){
            console.log(err?.message)
            setLoading(false)
        }
    }

    const cancelAppointment=async(appointmentId)=>{
        try{
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/appointment/cancel_appointment`,
                {appointmentId},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            .then(res=>{
                if(res.status === 200){
                    toast.success(res.data.message)
                    getAppointsments()
                    getDoctorsData()
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
            setLoading(false)
        }
    }

    const makePayment=async(amount,appointmentId,name)=>{
        try{
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/create-checkout-session`, 
                {appointmentId, amount, name},
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            .then(async(res)=>{
                if(res.status === 200){
                    const stripe = await stripePromise;
                    localStorage.setItem("sessionID", res.data.id)
                    stripe.redirectToCheckout({ sessionId: res.data.id });
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
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(userId) getAppointsments();
        else{
            navigate("/")
        }
    },[userId])

    useEffect(()=>{
        console.log(appointments)
    },[appointments])


    if(loading) return <div className='w-[100%] h-[calc(100vh-100px)] grid place-items-center'> <Loader/> </div>
    if(!loading && appointments.length === 0){
        return (
            <div>
                <h1 className='text-2xl font-semibold'>No appointments found. Book your first appointment now!</h1>
                <button 
                    onClick={()=>{navigate('/doctors')}}
                    className='mt-3 px-4 py-2 border border-black rounded-md cursor-pointer'
                >Book Appointment</button>
            </div>
        )
    }
    return (
    <div>
        <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
        <div>
            {
                appointments?.map((item,index)=>(
                    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-6 border-b' key={index}>
                        <div>
                            <img className='w-32 bg-indigo-50' src={item?.docId?.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='text-neutral-800 font-semibold'>{item?.docId?.name}</p>
                            <p>{item?.docId?.speciality}</p>
                            <p className='text-zinc-700 font-medium mt-1'>Address: </p>
                            <p className='text-xs'>{item?.docId?.address?.line1}</p>
                            <p className='text-xs'>{item?.docId?.address?.line2}</p>
                            <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item?.slotDate)} | {item?.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end'>
                            { !item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                            { !item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>{makePayment(item.amount,item._id, item.docId.name)}} className='cursor-pointer text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6fff] hover:text-white transition-all duration-300'>Pay Online</button> }
                            { !item.cancelled && !item.isCompleted && <button onClick={()=>{cancelAppointment(item._id)}} className='cursor-pointer text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button> }
                            { item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appontment Cancelled</button>}
                            { item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button> }
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
    )
}
