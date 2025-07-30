import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function GenerateOtp() {
    const [state, setState] = useState('generate')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const formSubmit=()=>{
        setLoading(true)
        if(state === "generate"){
            if(!email) { toast.error("Please Enter your email!"); return setLoading(false)}
            if(email.includes(" ") || !emailRegex.test(email)) { toast.error("Please enter a valid email address."); return  setLoading(false)}

            axios.get(`${import.meta.env.VITE_BACKEND_URL}/doctor/generate-otp/${email}`)
            .then(res=>{
                if(res.status === 200){
                    toast.success(res.data.message)
                    setState('verify')
                }
                setLoading(false)
            })
            .catch((err) =>{
                if(err?.response?.data?.message){
                    toast.error(err?.response?.data?.message, {
                        autoClose: 2000,
                    });
                }
                setLoading(false)
            })
        }
        else{
            if(!otp){ toast.error("Please enter otp!"); return setLoading(false) }
            if(otp.length !== 6){ toast.error("OTP must be exactly 6 digits"); return setLoading(false) }

            axios.post(`${import.meta.env.VITE_BACKEND_URL}/doctor/verify`,{email, otp})
            .then(res=>{
                if(res.status === 200){
                    toast.success(res.data.message)
                    localStorage.setItem("resetToken", res.data.token)
                    navigate("/reset-password")
                }
                setLoading(false)
            })
            .catch((err) =>{
                if(err?.response?.data?.message){
                    toast.error(err?.response?.data?.message, {
                        autoClose: 2000,
                    });
                }
                setLoading(false)
            })
        }
    }
    return (
        <div className='min-h-[100vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibol'>{state === 'generate' ? 'Reset Password via OTP' : 'Verify OTP'}</p>
                <p>
                    {
                        state === 'generate'
                        ? 'Enter your registered email to get OTP'
                        : 'Enter the OTP sent to your email'
                    }
                </p>
                
                <div className='w-full'>
                    {
                        state === 'generate' ?
                        <input
                            className='border border-zinc-300 rounded w-full p-2'
                            type="email" name="email" 
                            onChange={e=>{setEmail(e.target.value)}} 
                            value={email} required 
                        /> :
                        <input
                            className='border border-zinc-300 rounded w-full p-2'
                            type="number" name="otp" 
                            onChange={e=>{setOtp(e.target.value)}}
                            value={otp} required 
                        />
                    }
                </div>
                {
                    loading 
                    ? <button disabled className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer'>Loading...</button> 
                    : <button onClick={formSubmit} className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer'>{state === 'generate' ? 'Generate OTP' : 'Verify OTP'}</button>
                }
            </div>
        </div>
    )
}
