import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export default function ResetPassword() {
    const [password, setPassword] = useState(``)
    const [confirmPassword, setConfirmPassword] = useState(``)
    const [loading, setLoading] = useState(false)
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const navigate = useNavigate()

    const formSubmit=()=>{
        if(!password) return toast.error("Please Enter your password!");
        if(password.includes(" ")) return toast.error("Passwod cannot contain spaces");
        if(password.length < 5) return toast.error("Password must be at least 5 characters long.");

        if(!confirmPassword) return toast.error("Please Enter confirm password!");
        if(confirmPassword.includes(" ")) return toast.error("Passwod cannot contain spaces");
        if(confirmPassword.length < 5) return toast.error("Password must be at least 5 characters long.");

        if(password !== confirmPassword) return toast.error("Password and Confirm password should be same");

        setLoading(true)
        axios.put(`${import.meta.env.VITE_BACKEND_URL}/doctor/reset-password`, 
            {
                token: localStorage.getItem('resetToken'),
                newPassword: password
            }
        )
        .then(res=>{
            if(res.status === 200) toast.success(res.data.message);
            setPassword("")
            setConfirmPassword("")
            navigate("/")
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

    useEffect(()=>{
        const token = localStorage.getItem('resetToken');

        if (!token) {
            toast.warn("Reset-password session is expired")
            navigate('/');
            return
        }

        try {
            const decoded = jwtDecode(token);

            const currentTime = Date.now() / 1000; // in seconds
            if (decoded.exp < currentTime) {
                localStorage.removeItem('resetToken');
                navigate('/generate-otp');
            }
        } catch (err) {
            localStorage.removeItem('resetToken');
            navigate('/generate-otp');
        }
    },[])
    return (
    <div className='min-h-[100vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
            <p className='text-2xl font-semibol'>Reset Password</p>
            <p>
            </p>
            
            <div className='w-full'>
                <p>Password</p>
                <div className='relative'>
                    <input
                        type={show1 ? 'text' : 'password'}
                        value={password}
                        onChange={e=>{setPassword(e.target.value)}}
                        placeholder="Enter your password"
                        className="w-full border border-zinc-300 rounded p-2 mt-1"
                    />

                    <button
                        type="button"
                        onClick={() => setShow1(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        aria-label={show1 ? 'Hide password' : 'Show password'}
                    > {show1 ? <EyeOff size={18} /> : <Eye size={18} />} 
                    </button>
                </div>
            </div>

            <div className='w-full mt-1'>
                <p>Confirm Password</p>
                <div className='relative'>
                    <input
                        type={show2 ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e=>{setConfirmPassword(e.target.value)}}
                        placeholder="Confirm your password"
                        className="w-full border border-zinc-300 rounded p-2 mt-1"
                    />

                    <button
                        type="button"
                        onClick={() => setShow2(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        aria-label={show2 ? 'Hide password' : 'Show password'}
                    > {show2 ? <EyeOff size={18} /> : <Eye size={18} />} 
                    </button>
                </div>
            </div>
            {
                loading 
                ? <button disabled className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer'>Loading...</button> 
                : <button onClick={formSubmit} className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer'>Reset Password</button>
            }
        </div>
    </div>
    )
}
