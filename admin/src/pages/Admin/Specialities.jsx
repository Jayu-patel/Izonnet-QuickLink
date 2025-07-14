import { useContext, useState } from "react"
import { AdminContext } from "../../context/AdminContext"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ConfirmationPopup from '../../components/Pop-up'
import axios from "axios"
import { toast } from "react-toastify"


export default function Specialities() {
    const {specialities, getSpecialities} = useContext(AdminContext)
    const navigate = useNavigate()

    const [showPopup, setShowPopup] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    const handleSubmit=(id)=>{
        setSelectedId(id)
        setShowPopup(true)
    }

    const handleConfirm=()=>{
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/speciality/remove-speciality/${selectedId}`)
        .then((res)=>{
            if(res?.status === 200){
                toast.success(res?.data?.message);
                getSpecialities()
                setShowPopup(false)
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
            setShowPopup(false)
        });
    }

    const handleCancel=()=>{
        setShowPopup(false)
    }
    
    useEffect(()=>{
        console.log(specialities)
    },[specialities])

    if(specialities.length === 0) return <div className='w-[100%] h-[calc(100vh-100px)] grid place-items-center'> <Loader/> </div>
    return (
        <div className="m-5 w-full">
            <ConfirmationPopup
                showPopup={showPopup}
                handleConfirm={handleConfirm}
                handleCancel={handleCancel}
                header={"Remove Speciality"}
                message={"Are you sure you want to remove this speciality?"}
                btnMessage={"Remove"}
            />
            <p className="mb-3 md:text-2xl text-xl font-semibold">Specialities</p>

            <button className="bg-[#5f6fff] px-8 py-3 mt-4 text-white rounded-full cursor-pointer" onClick={()=>{navigate(`/add-speciality`)}}>Add</button>

            <div className="w-full flex flex-wrap gap-10 pt-5 gap-y-14">
                {
                    specialities?.map((item, index)=>{
                        return (
                            <div className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden p-3" key={index}>
                                <img className="bg-indigo-50 mx-auto" src={item.image} alt="" />
                                <div className="p-4">
                                    <p className="text-neutral-800 text-lg font-medium">{item.speciality}</p>
                                </div>
                                <div className="flex gap-2 justify-around [&_button]:cursor-pointer">
                                    <button
                                        onClick={()=>{navigate(`/edit-speciality/${item._id}`)}}
                                        className="border border-blue-500 rounded-2xl px-6 py-2 text-blue-500 hover:text-white hover:bg-blue-500 transition-all duration-100"
                                    >Edit</button>
                                    <button
                                        onClick={()=>{handleSubmit(item._id)}}
                                        className="border border-red-400 rounded-2xl px-6 py-2 text-red-400 hover:text-white hover:bg-red-400 transition-all duration-100"
                                    >Delete</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}
