import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function EditSpeciality() {

    const {id} = useParams()
    const {specialities, getSpecialities} = useContext(AdminContext);
    const [image, setImage] = useState(null);
    const [specialityData, setSpecialityData] = useState(null);
    const [loading, setLoading] = useState(false);

    const getSpeciality=()=>{
        const data = specialities.find(item => item._id === id);
        setSpecialityData(data);
    }

    const updateSpeciality=()=>{
        setLoading(true);

        const formData = new FormData();
        formData.append('speciality', specialityData?.speciality);
        formData.append('id', id);
        formData.append('image', image);

        axios.put(`${import.meta.env.VITE_BACKEND_URL}/speciality/update-speciality`, formData)
        .then(res=>{
            if(res?.status === 200){
                setLoading(false);
                toast.success(res?.data?.message);
                getSpecialities()
            }
        })
        .catch(err => {
            if(err?.response?.data?.message){
                toast.error(err?.response?.data?.message);
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }

    useEffect(()=>{
        getSpeciality()
    },[specialities,id])

    return (
        <div className='m-5 w-full'>
                
            <p className='mb-3 md:text-2xl text-xl font-semibold'>Update Speciality</p>

            <div className='bg-white px-8 pt-8 pb-4 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="image">
                        <img className={`w-16 bg-gray-100 ${(image || specialityData?.image) ? "p-0" : "p-4"} rounded-full cursor-pointer`} src={image ? URL.createObjectURL(image) : specialityData?.image } alt="" />
                    </label>
                    <input onChange={(e)=>{setImage(e.target.files[0])}} type="file" id="image" hidden />
                    <p>Select Speciality <br/> Picture</p>
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p>Speciality</p>
                    <input value={specialityData?.speciality ?? ""} onChange={(e)=>{setSpecialityData(prev=>({...prev, speciality: e.target.value}))}} className='sm:w-1/2 border rounded px-3 py-2' type="text" placeholder='Speciality' required />
                </div>

                {
                    loading 
                    ? <button disabled className='bg-[#7882d6] px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>Loading...</button>
                    :<button onClick={()=>{updateSpeciality()}} className='bg-[#5f6fff] px-6 py-3 mt-4 text-white rounded-full cursor-pointer'>Update Speciality</button>
                }
            </div>

        </div>
    )
}
