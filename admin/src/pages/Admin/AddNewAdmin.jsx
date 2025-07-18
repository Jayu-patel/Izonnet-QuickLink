import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddNewAdmin() {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [loading, setLoading] = useState(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const submit=()=>{
        if(!username) return toast.error("Please Enter username!");

        if(!email) return toast.error("Please Enter your email!");
        if(email.includes(" ") || !emailRegex.test(email)) return toast.error("Please enter a valid email address.");

        if(!password) return toast.error("Please Enter your password!");
        if(password.includes(" ")) return toast.error("Passwod cannot contain spaces");
        if(password.length < 5) return toast.error("Password must be at least 5 characters long.");

        if(password !== confirmPass) return toast.error("Please Confirm your password!");


        try{
            setLoading(true)
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/register`, {username, email, password})
            .then(res=>{
                if(res.status === 200){
                    toast.success(res.data.message)

                    setUsername("")
                    setEmail("")
                    setPassword("")
                    setConfirmPass("")
                }
            })
            .catch((err) =>{
                if(err?.response?.data?.message){
                    toast.error(err?.response?.data?.message)
                }
            })
            .finally(()=>{
                setLoading(false)
            })
        }
        catch(err) {
            toast.error(err.message)
            setLoading(false)
        }
    }
    return (
    <div className="m-5 w-full">
        <p className='mb-3 md:text-2xl text-xl font-semibold'>Add New Admin</p>

        <div className="w-full sm:w-[50%]">
            <div className='w-full lg:flex-1 flex flex-col gap-4'>

                <div className='flex-1 flex flex-col gap-1'>
                    <p>Username</p>
                    <input onChange={(e)=>{setUsername(e.target.value)}} value={username} className='border rounded p-2' type="text" placeholder='Enter username' required />
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p>Email</p>
                    <input onChange={(e)=>{setEmail(e.target.value)}} value={email} className='border rounded p-2' type="email" placeholder='Enter email' required />
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p>Password</p>
                    <div className='relative'>
                        <input
                            type={show ? 'text' : 'password'}
                            value={password}
                            onChange={e=>{setPassword(e.target.value)}}
                            placeholder="Enter password"
                            className="w-full border rounded p-2 mt-1"
                        />

                        <button
                            type="button"
                            onClick={() => setShow(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                            aria-label={show ? 'Hide password' : 'Show password'}
                        > {show ? <EyeOff size={18} /> : <Eye size={18} />} 
                        </button>
                    </div>
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p>Confirm Password</p>
                    <div className='relative'>
                        <input
                            type={show2 ? 'text' : 'password'}
                            value={confirmPass}
                            onChange={e=>{setConfirmPass(e.target.value)}}
                            placeholder="Confirm password"
                            className="w-full border rounded p-2 mt-1"
                        />

                        <button
                            type="button"
                            onClick={() => setShow2(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                            aria-label={show2 ? 'Hide password' : 'Show password'}
                        > {show2 ? <EyeOff size={18} /> : <Eye size={18} />} 
                        </button>
                    </div>
                </div>

            </div>
            <button onClick={submit} className={`${loading ? "bg-[#383e71]" : "bg-[#5f6fff]"} px-8 py-3 mt-4 text-white rounded-sm cursor-pointer`}>
                { loading ? "Loading.." : "Add"}
            </button>
        </div>
    </div>
    )
}
