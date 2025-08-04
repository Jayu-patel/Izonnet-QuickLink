import axios from "axios"
import { useState } from "react"
import { toast } from 'react-toastify'

export default function Contact() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const submit=()=>{
        if(!name) toast.error("Enter your name");
        if(!email) toast.error("Enter your email");
        if(!message) toast.error("Enter your message");

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/send-message`, {name, email, message})
        .then(res=>{
            if(res.status === 200){
                toast.success(res.data.message)
                setName("")
                setEmail("")
                setMessage("")
            }
        })
    }
    return (
        <div className="text-[#4B5563] md:mb-44 mt-10 md:w-[80%] mx-auto">
            <div className="w-full text-center my-5">
                <h1 className="mx-auto font-normal text-2xl md:text-3xl">CONTACT <span className="text-[#1F2937]">US</span></h1>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-10">
                <div className="flex-1">
                    <img className="w-full max-w-[360px] mx-auto" src="/contact_us.jpg" alt="" />
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <input className='bg-[#FFFFFF] rounded-[1.125rem] p-4 border border-[#D9D9D9]' value={name} onChange={e=>{setName(e.target.value)}} placeholder='Name' type="text" />
                    <input className='bg-[#FFFFFF] rounded-[1.125rem] p-4 border border-[#D9D9D9]' value={email} onChange={e=>{setEmail(e.target.value)}} placeholder='Your Email' type="text" />
                    <textarea className='bg-[#FFFFFF] rounded-[1.125rem] p-4 border border-[#D9D9D9] h-[40%] resize-none' value={message} onChange={e=>{setMessage(e.target.value)}} placeholder='Your Message' name="message"></textarea>
                    <button className='bg-[#5f6fff] text-white py-[2.5%] rounded-[1.125rem] cursor-pointer hover:bg-[#4a518f] transition-all duration-100'
                        onClick={()=>{submit()}}
                    >
                        Send Meassage
                    </button>
                </div>
            </div>
        </div>
    )
}
