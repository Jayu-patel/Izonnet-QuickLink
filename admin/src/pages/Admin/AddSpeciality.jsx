import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';

export default function AddSpeciality() {

    const {getSpecialities} = useContext(AdminContext);
    const [image, setImage] = useState(null);
    const [speciality, setSpeciality] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit=()=>{
        if(!image){
            toast.error("Please upload an image");
            return;
        }
        if(!speciality){
            toast.error("Please enter a speciality");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);
        formData.append('speciality', speciality);

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/speciality/add-speciality`, formData, {headers: {Authorization: `Bearer ${localStorage.getItem('adminToken')}`}})
        .then((res)=>{
            if(res?.status === 200){
                toast.success(res?.data?.message);
                setImage(null);
                setSpeciality('');
                getSpecialities()
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
        })
        .finally(()=>{
            setLoading(false)
        })
    }

    return (
        <div className='m-5 w-full'>
            
            <p className='mb-3 md:text-2xl text-xl font-semibold'>Add Speciality</p>

            <div className='bg-white px-8 pt-8 pb-4 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="image">
                        <img className={`w-16 bg-gray-100 ${image ? "p-0" : "p-4"} rounded-full cursor-pointer`} src={image ? URL.createObjectURL(image) : `/people_icon.svg`} alt="" />
                    </label>
                    <input onChange={(e)=>{setImage(e.target.files[0])}} type="file" id="image" hidden />
                    <p>Upload Speciality <br/> Picture</p>
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p>Speciality</p>
                    <input value={speciality} onChange={(e)=>{setSpeciality(e.target.value)}} className='sm:w-1/2 border rounded px-3 py-2' type="text" placeholder='Speciality' required />
                </div>

                {
                    loading 
                    ? <button disabled className='bg-[#7882d6] px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>Loading...</button>
                    :<button onClick={()=>{handleSubmit()}} className='bg-[#5f6fff] px-6 py-3 mt-4 text-white rounded-full cursor-pointer'>Add Speciality</button>
                }
            </div>

        </div>
    )
}