import { useContext } from "react"
import { AdminContext } from "../../context/AdminContext"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from 'lucide-react';
import axios from "axios"
import { toast } from "react-toastify"

export default function Admin() {
    const {aToken, getAdminProfile, adminProfile, id} = useContext(AdminContext)
    const navigate = useNavigate()

    const [isEdit, setIsEdit] = useState(false)
    const [updatePass, setUpdatePass] = useState(false)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [currentPass, setCurrentPass] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)

    const editProfile=()=>{
        axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/update-profile`, {id, username, email})
        .then((res)=>{
            if(res.status === 200){
                toast.success(res.data.message)
                getAdminProfile(id)
            }
        })
        .catch((err) =>{
            if(err?.response?.data?.message){
                toast.error(err?.response?.data?.message)
            }
        })
    }

    const updatePassword=()=>{

        if(!currentPass) return toast.error("Please Enter your password!");
        if(currentPass.includes(" ")) return toast.error("Passwod cannot contain spaces");
        if(currentPass.length < 5) return toast.error("Password must be at least 5 characters long.");

        if(!password) return toast.error("Please Enter your password!");
        if(password.includes(" ")) return toast.error("Passwod cannot contain spaces");
        if(password.length < 5) return toast.error("Password must be at least 5 characters long.");

        if(password !== confirmPass) return toast.error("Please Confirm your password!");

        axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/update-password`, 
            {id, oldPassword: currentPass, newPassword: password}
        )
        .then((res)=>{
            if(res.status === 200){
                toast.success(res.data.message)
                setUpdatePass(false)
            }
        })
        .catch((err) =>{
            if(err?.response?.data?.message){
                toast.error(err?.response?.data?.message)
            }
        })
    }

    const onCancel=()=>{
        setUpdatePass(false); 
        setIsEdit(false);

        setCurrentPass('');
        setPassword('');
        setConfirmPass('');

        setShow(false);
        setShow2(false);
        setShow3(false);

        getAdminProfile(id);
    }

    useEffect(()=>{
        if(aToken){
            getAdminProfile(id)
        }
    },[aToken])

    useEffect(()=>{
        setUsername(adminProfile?.username)
        setEmail(adminProfile?.email)
    },[adminProfile])

    return (
    <div className='m-5 w-full md:w-[60%]'>
        <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-[0_8px_18px_rgba(0,0,0,0.2)]'>
                <img className='w-14' src={"/patients_icon.svg"} alt="" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>{adminProfile.totalAdmins}</p>
                    <p className='text-gray-400'>Admins</p>
                </div>
            </div>

            <div className="flex items-center">
                <button onClick={()=>{navigate("/add-new-admin")}} className="bg-[#5f6fff] px-6 py-3 mt-4 text-white rounded-full cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.2)]">Add New Admin</button>
            </div>
        </div>


        <div className="w-full mt-4">
            <h1 className="py-3 text-2xl font-medium">Account Details</h1>
            <div className="w-full md:w-[70%] flex flex-col gap-4">

                {
                    (!updatePass) ?
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p>Name</p>
                            <input value={username ?? ""} readOnly={!isEdit} onChange={(e)=>{setUsername(e.target.value)}} className={`rounded px-3 py-2 ${isEdit ? 'border-2 border-[#5f6fff]' : 'border'}`} type="text" placeholder='Username' required />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p>Email</p>
                            <input value={email ?? ""} readOnly={!isEdit} onChange={(e)=>{setEmail(e.target.value)}} className={`rounded px-3 py-2 ${isEdit ? 'border-2 border-[#5f6fff]' : 'border'}`} type="email" placeholder='Email' required />
                        </div>
                    </div>
                    : <></>
                }

                {
                    (updatePass) ?
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-col gap-1">
                            <p>Current Password</p>
                            <div className='relative'>
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={currentPass}
                                    onChange={e=>{setCurrentPass(e.target.value)}}
                                    placeholder="Current Password"
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

                        <div className="flex flex-col gap-1">
                            <p>New Password</p>
                            <div className='relative'>
                                <input
                                    type={show2 ? 'text' : 'password'}
                                    value={password}
                                    onChange={e=>{setPassword(e.target.value)}}
                                    placeholder="New Password"
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

                        <div className="flex flex-col gap-1">
                            <p>Confirm New Password</p>
                            <div className='relative'>
                                <input
                                    type={show3 ? 'text' : 'password'}
                                    value={confirmPass}
                                    onChange={e=>{setConfirmPass(e.target.value)}}
                                    placeholder="Confirm New Password"
                                    className="w-full border rounded p-2 mt-1"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShow3(prev => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                                    aria-label={show3 ? 'Hide password' : 'Show password'}
                                > {show3 ? <EyeOff size={18} /> : <Eye size={18} />} 
                                </button>
                            </div>
                        </div>
                        
                    </div>
                    : <></>
                }
                
            </div>

        </div>

        <div className="flex gap-4 mt-0.5">

            {
                (!updatePass) ?
                    (!isEdit) ?
                    <button 
                        className="bg-[#5f6fff] px-8 py-3 mt-4 text-white rounded-lg cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                        onClick={()=>{setIsEdit(!isEdit)}}>Edit</button>
                    : <button 
                        className="bg-[#5f6fff] px-8 py-3 mt-4 text-white rounded-lg cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                        onClick={()=>{editProfile(); setIsEdit(false)}}>Update</button>
                : <></>
            }

            {
                (!isEdit) ?
                    (!updatePass) ?
                    <button 
                        className="bg-[#5f6fff] px-4 py-3 mt-4 text-white rounded-lg cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                        onClick={()=>{setUpdatePass(!updatePass)}}
                    >Update Password</button>
                    : <button 
                        className="bg-[#5f6fff] px-8 py-3 mt-4 text-white rounded-lg cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                        onClick={()=>{updatePassword()}}>Update</button>
                : <></>
            }

            {
                (isEdit || updatePass) ? 
                <button 
                    className="bg-red-500 px-6 py-3 mt-4 text-white rounded-lg cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                    onClick={()=>{onCancel()}}
            >   Cancel</button> 
                : <></>
            }
        </div>

    </div>
    )
}
