import axios from 'axios'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);

    const {setAToken, setId} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const navigate = useNavigate()

    const onSubmit=()=>{
        if(!email) return toast.error("Please Enter your email!");
        if(email.includes(" ") || !emailRegex.test(email)) return toast.error("Please enter a valid email address.");

        if(!password) return toast.error("Please Enter your password!");
        if(password.includes(" ")) return toast.error("Passwod cannot contain spaces");
        if(password.length < 5) return toast.error("Password must be at least 5 characters long.");
        
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
                        localStorage.setItem('adminId', data.id)
                        localStorage.removeItem('doctorToken')
                        setAToken(data.token)
                        setId(data.id)
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
                        localStorage.removeItem('adminToken')
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
                <input 
                    onChange={e=>setEmail(e.target.value)} 
                    value={email} className='border border-[#dadada] rounded w-full p-2 mt-1' 
                    type='email' 
                    required 
                    placeholder='Enter your email'
                />
            </div>
            <div className='w-full'>
                <p>Password</p>
                {/* <input onChange={e=>setPassword(e.target.value)} value={password} className='border border-[#dadada] rounded w-full p-2 mt-1' type='password' required /> */}
                <div className='relative'>
                    <input
                        type={show ? 'text' : 'password'}
                        value={password}
                        onChange={e=>{setPassword(e.target.value)}}
                        placeholder="Enter your password"
                        className="w-full border border-zinc-300 rounded p-2 mt-1"
                    />

                    <button
                        type="button"
                        onClick={() => setShow(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        aria-label={show ? 'Hide password' : 'Show password'}
                    > {show ? <EyeOff size={18} /> : <Eye size={18} />} 
                    </button>
                </div>
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
            {
                state === 'Admin' ?
                <></>:
                // <p className=''>Doctor Login? <span className='text-[#5f6fff] underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p> :
                <p className=''>Forgot Password? <span className='text-[#5f6fff] underline cursor-pointer' onClick={() => {navigate("/generate-otp")}}>Click here</span></p>
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
