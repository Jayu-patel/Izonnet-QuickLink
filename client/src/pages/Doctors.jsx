import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/Appcontext'
import { useNavigate, useParams } from 'react-router-dom'

export default function Doctors() {
    const {doctors, speciality: specialities, getSpeciality} = useContext(AppContext)
    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const {speciality} = useParams()
    const navigate = useNavigate()

    const applyFilter=()=>{
        if(speciality){
          setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
        }
        else{
          setFilterDoc(doctors)
        }
    }

    useEffect(()=>{
        applyFilter()
    },[doctors,speciality])

    return (
    <div>
        <p className='text-gray-600'>Browse through the doctors specialist.</p>
        <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
            <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-[#5f6fff] text-white' : ''}`} onClick={()=>{setShowFilter(prev=> !prev)}}>Filters</button>
            <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                {
                    specialities?.map((element, index)=>{
                        return (
                            <p 
                                key={index}
                                onClick={()=> speciality === element?.speciality ? navigate('/doctors') : navigate(`/doctors/${element?.speciality}`)}
                                className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === element?.speciality ? "bg-indigo-100" : "text-black"}`}
                            >{element?.speciality}</p>
                        )
                    })
                }
            </div>
            <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6'>
                {
                    filterDoc?.map((item,id)=>(
                    <div onClick={()=>{navigate(`/appointment/${item?._id}`)}} key={id} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                        <img className='bg-blue-50' src={item?.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item?.name}</p>
                            <p className='text-gray-600 text-sm'>{item?.speciality}</p>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    </div>
    )
}
