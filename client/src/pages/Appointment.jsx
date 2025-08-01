import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/Appcontext'

export default function Appointment() {
    const {docId} = useParams()
    const {doctors, currencySymbol, userId, getDoctorsData} = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const fetchDocInfo =async()=>{
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
    }

    const bookAppointment = async ()=>{

        if(!userId){
            navigate("/login")
            toast.warn("Log in to book appointment")
        }
        else{
            if(!slotTime) return toast.error("Please select appointment time")
            setLoading(true)
            try{
                const date = docSlots[slotIndex][0].datetime

                let day = date.getDate()
                let month = date.getMonth()
                let year = date.getFullYear()

                const slotDate = day + "_" + month + "_" + year

                axios.post(`${import.meta.env.VITE_BACKEND_URL}/appointment/book_appointment`,{
                        userId,
                        docId,
                        slotDate,
                        slotTime
                    },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
                    }
                )
                .then(res=>{
                    if(res?.status === 200){
                        toast.success(res?.data?.message)
                        getDoctorsData()
                        navigate("/my-appointment")
                    }
                    setLoading(false)
                })
                .catch((err) => {
                    if(err?.response?.data?.message){
                        toast.error(err?.response?.data?.message);
                    }
                    setLoading(false)
                });
            }
            catch(error){
                toast.error(error?.message)
                setLoading(false)
            }
        }
    }

    const getAvailableSlots = async()=>{
        setDocSlots([])
        let today = new Date()

        for(let i=0; i<7; i++){
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate()+i)
            
            let endTime = new Date()
            endTime.setDate(today.getDate()+i)
            endTime.setHours(21,0,0,0)
            
            if(today.getDate() === currentDate.getDate()){
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1: 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            }
            else{
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []
            while(currentDate < endTime){
                let formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

                let day = currentDate.getDate()
                let month = currentDate.getMonth()
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo?.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

                if(isSlotAvailable){
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }
            setDocSlots(prev =>([...prev, timeSlots]))
        }
    }

    useEffect(()=>{
        fetchDocInfo()
    },[doctors,docId])

    useEffect(()=>{
        getAvailableSlots()
    },[docInfo])

    useEffect(()=>{
    },[docSlots])
    return docInfo && (
        <div>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-[#5f6fff] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name}
                        <img className='w-5' src={"/verified_icon.svg"} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About 
                            <img src={"/info_icon.svg"}  alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking Slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {
                        docSlots.length && docSlots.map((item,index)=>(
                            <div onClick={()=>{setSlotIndex(index)}} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-[#5f6fff] text-white' : 'border bprder-gray-200'}`}>
                                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))
                    }
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mt-4'>
                    {
                        docSlots.length && docSlots[slotIndex].map((item,index)=>(
                            <p onClick={()=>{setSlotTime(item.time)}} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-[#5f6fff] text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                                {item.time.toLowerCase()}
                            </p>
                        ))
                    }
                </div>
                {
                    loading ?
                    <button disabled className='bg-[#061ace] text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer'>Loading...</button> :
                    <button onClick={bookAppointment} className='bg-[#5f6fff] text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer'>book an Appointment</button>
                }
            </div>

            <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
        </div>
    )
}
