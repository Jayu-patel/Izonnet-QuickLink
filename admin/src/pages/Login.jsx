import axios from 'axios'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';

export default function Login() {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const {setAToken} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)
    const navigate = useNavigate()

    const onSubmit=()=>{
        try{
            if(state === 'Admin'){
                setLoading(true)
                axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, 
                    {email, password},
                    {withCredentials: true}
                )
                .then(response => {
                    const {data} = response
                    if(data.success){
                        localStorage.setItem('adminToken', data.token)
                        setAToken(data.token)
                        toast.success('Login Successful')
                        navigate('/admin-dashboard')
                    }
                    else{
                        toast.error(data.message)
                    }
                    setLoading(false)
                })
                .catch((err) =>{
                    if(err?.response?.data?.message){
                        console.log(err?.response?.data?.message);
                        toast.error(err?.response?.data?.message)
                    }
                    setLoading(false)
                })
            }
            else{
                setLoading(true)
                axios.post(`${import.meta.env.VITE_BACKEND_URL}/doctor/login`, 
                    {email, password},
                    {withCredentials: true}
                )
                .then(response => {
                    const {data} = response
                    if(data.success){
                        localStorage.setItem('doctorToken', data.token)
                        setDToken(data.token)
                        toast.success('Login Successful')
                        navigate('/doctor-dashboard')
                    }
                    else{
                        toast.error(data.message)
                    }
                    setLoading(false)
                })
                .catch((err) =>{
                    if(err?.response?.data?.message){
                        console.log(err?.response?.data?.message);
                        toast.error(err?.response?.data?.message)
                    }
                    setLoading(false)
                })
            }
        }
        catch(err) {
            toast.error(err.message)
            setLoading(false)
        }
    }

    return (
    <div className='min-h-[100vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto'><span className='text-[#5f6fff]'>{state}</span> Login</p>
            <div className='w-full'>
                <p>Email</p>
                <input onChange={e=>setEmail(e.target.value)} value={email} className='border border-[#dadada] rounded w-full p-2 mt-1' type='email' required />
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input onChange={e=>setPassword(e.target.value)} value={password} className='border border-[#dadada] rounded w-full p-2 mt-1' type='password' required />
            </div>
            <button onClick={onSubmit} className={`${loading ? "bg-[#383e71]" : "bg-[#5f6fff]"} text-white w-full py-2 rounded-md text-base cursor-pointer`}>
                {
                    loading ? "Loading..." : "Login"
                }
            </button>
            {
                state === 'Admin' ? 
                <p className=''>Doctor Login? <span className='text-[#5f6fff] underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p> :
                <p className=''>Admin Login? <span className='text-[#5f6fff] underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
            }
            {/* <button 
                className='mt-1 border px-2.5 py-1 rounded-full 
                border-gray-500 text-gray-600 text-sm
                hover:transition-all duration-200
                hover:bg-gray-600
                hover:text-white
                cursor-pointer
                '
                onClick={()=>{navigate("/")}}
            ><ArrowBackIcon fontSize="inherit"/> Back to User Dashboard</button> */}
        </div>
    </div>
    )
}
