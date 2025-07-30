import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import ConfirmationPopup from '../../components/Pop-up'

export default function EditDoctor() {
    const {docId} = useParams()
    const {aToken, doctors, getDoctorsData} = useContext(AdminContext)

    const [docData, setDocData] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showPopup, setShowPopup] = useState(false)

    const navigate = useNavigate()

    const fetchDocInfo=()=>{
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocData(docInfo)
    }

    const updateDoctor=()=>{
        const formData = new FormData()

        formData.append('id', docId)
        formData.append('fees', docData.fees)
        formData.append('address', JSON.stringify(docData.address))
        formData.append('available', docData.available)
        formData.append('about', docData.about)
        formData.append('name', docData.name)
        formData.append('image', image)

        setLoading(true)
        axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/update-doctor`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            }
        )
        .then(res=>{
            if(res.status === 200){
                toast.success(res.data.message)
                setIsEdit(false)
            }
        })
        .catch((err)=>{
            if(err?.response?.data?.message){
                toast.error(err?.response?.data?.message);
            }
        })
        .finally(()=>{
            setLoading(false)
            getDoctorsData()
        })
    }

    const removeDoctor=(id)=>{
        setLoading(true)
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/remove-doctor/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            }
        )
        .then(res=>{
            if(res.status === 200){
                toast.success(res.data.message)
                setIsEdit(false)
                navigate('/doctor-list')
            }
        })
        .catch((err)=>{
            if(err?.response?.data?.message){
                toast.error(err?.response?.data?.message);
            }
        })
        .finally(()=>{
            setLoading(false)
            getDoctorsData()
        })
    }

    const cancelPopUp=()=> setShowPopup(false)

    useEffect(()=>{
        fetchDocInfo()
    },[docId,doctors])

    useEffect(()=>{
        if(aToken){
            getDoctorsData()
        }
    },[aToken])
    return docData && (
        <div className='h-[100vh] overflow-y-scroll no-scrollbar'>
            <div className='absolute'>
                <ConfirmationPopup
                    showPopup={showPopup}
                    handleConfirm={()=>{removeDoctor(docData._id)}}
                    handleCancel={cancelPopUp}
                    header={"Remove Doctor?"}
                    message={"Once removed, this account cannot be recovered."} 
                    btnMessage={"Remove"} 
                />
            </div>
            <h1 className='m-5 md:text-2xl text-xl font-semibold'>Edit Doctor</h1>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                {
                    isEdit ?
                    <label htmlFor="image">
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-full sm:max-w-64 rounded-lg opacity-75' src={image ? URL.createObjectURL(image) : docData.image} alt="" />
                        <img className='w-[50%] absolute bottom-[25%] right-[25%]' src={image ? "/img" : '/upload_icon.png'} alt="" />
                    </div>
                    <input type="file" id="image" hidden onChange={e=> setImage(e.target.files[0])} />
                </label> :
                    <img className='bg-[#5f6fff] w-full sm:max-w-64 rounded-lg' src={docData.image} alt="" />
                }
                </div>

                <div className='flex-1 border-stone-100 rounded-lg p-8 py-7 bg-white'>
                <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                    {
                    isEdit ?
                    <input 
                        type='text' 
                        className='border-2 border-blue-600' 
                        value={docData.name}
                        onChange={(e)=>{setDocData(prev => ({...prev, name: e.target.value}))}}
                    /> :
                    docData.name
                    }
                </p>
                <div className='flex items-center gap-2 mt-1 text-gray-600'>
                    <p>{docData.degree} - {docData.speciality}</p>
                    <button className='py-0.5 px-2 border text-xs rounded-full'>{docData.experience}</button>
                </div>

                <div>
                    <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
                    <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                    {
                        isEdit ?
                        <textarea className='w-[700px] h-[80px] border-2 border-blue-600' 
                        type='text' 
                        value={docData.about}
                        onChange={(e)=>{setDocData(prev => ({...prev, about: e.target.value}))}}
                        /> :
                        docData.about
                    }
                    </p>
                </div>

                <p className='text-gray-600 font-medium mt-4'>
                    Appointment fee: 
                    <span className='text-gray-800'>
                    $ {isEdit ? <input className='border-2 border-blue-600' type="number" value={docData.fees} onChange={(e)=>{setDocData(prev => ({...prev, fees: e.target.value}))}} /> : docData.fees}
                    </span>
                </p>

                <div className='flex gap-2 py-2'>
                    <p>Address:</p>
                    <p className='text-sm'>
                    {
                        isEdit ? <input className='border-2 border-blue-600' type="text" value={docData?.address?.line1} onChange={(e)=>{setDocData(prev=>({...prev, address : {...prev.address, line1: e.target.value}}))}} /> :
                        docData?.address?.line1
                    }
                    <br />
                    {
                        isEdit ? <input className='border-2 border-blue-600' type="text" value={docData?.address?.line2} onChange={(e)=>{setDocData(prev=>({...prev, address : {...prev.address, line2: e.target.value}}))}} /> :
                        docData?.address?.line2
                    }
                    </p>
                </div>

                <div className='flex gap-2 pt-2'>
                    <input className={`${isEdit ? "cursor-pointer" : ""}`} checked={!!docData.available} onChange={()=> isEdit && setDocData(prev=> ({...prev, available: !prev.available})) } type="checkbox" />
                    <label htmlFor="">Available</label>
                </div>

                {
                    isEdit ?
                    <button
                        onClick={()=>{updateDoctor()}}
                        className='px-8 py-2 border border-[#5f6fff] text-sm rounded-full mt-5 hover:bg-[#5f6fff] hover:text-white transition-all cursor-pointer'>
                            {loading ? "Loading..." : "Save"}
                    </button> :
                    <button
                        onClick={()=>{setIsEdit(true)}}
                        className='px-8 py-2 border border-[#5f6fff] text-sm rounded-full mt-5 hover:bg-[#5f6fff] hover:text-white transition-all cursor-pointer'>
                            Edit
                    </button>
                }
                {
                    isEdit
                    ? <button className='cursor-pointer border border-red-400 px-8 py-2 ml-2 rounded-full hover:bg-red-400 hover:text-white transition-all' onClick={()=>{setIsEdit(false); getDoctorsData()}}>Cancel</button>
                    : <></>
                }
                <br />

                {
                    isEdit ?
                    <></> :
                    <button onClick={()=>{setShowPopup(true)}} className='cursor-pointer border border-red-400 px-8 py-2 mt-3 rounded-full hover:bg-red-400 hover:text-white transition-all'>Remove Doctor</button>
                }
                
                </div>
            </div>

        </div>
    )
}
