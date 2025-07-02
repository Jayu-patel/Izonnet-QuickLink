import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function page() {
    const [state, setState] = useState('Sign Up')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUserName] = useState('')
    const [mobile, setMobile] = useState('')
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);

    const navigate = useNavigate()

    const formSubmit =async(e)=>{
      if(state === "Sign Up"){
          if(!username) return toast.error("Please Enter your name!");
          // if(username.includes(" ")) return toast.error("Username cannot contain spaces. Please use only letters, numbers, or allowed symbols");

          if(!email) return toast.error("Please Enter your email!");
          if(email.includes(" ") || !emailRegex.test(email)) return toast.error("Please enter a valid email address.");

          if(!mobile) return toast.error("Please Enter your mobile!");
          if(mobile.length != 10) return toast.error("Enter valid mobile number");

          if(!password) return toast.error("Please Enter your password!");
          if(password.includes(" ")) return toast.error("Passwod cannot contain spaces");
          if(password.length < 5) return toast.error("Password must be at least 5 characters long.");
          
          setLoading(true)

          axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`,{username, email, password, mobile},{withCredentials: true})
          .then((res)=>{
              if(res.status !== 200){
                  toast.error(res.data.message);
              }
              else{                    
                  setEmail("");
                  setPassword("");
                  setUserName("");
                  setMobile("");
                  toast.success("New profile is created!!")
                  setState("Login")
              }
              setLoading(false)
          }).catch((err) =>{
                if(err?.response?.data?.message){
                    toast.error(err?.response?.data?.message);
                    setLoading(false)
                }
          })
      }
      else{
          if(!email) return toast.error("Please Enter your email!");
          if(email.includes(" ") || !emailRegex.test(email)) return toast.error("Please enter a valid email address.");
          if(!password) return toast.error("Please Enter your password!");
          if(password.includes(" ")) return toast.error("Passwod cannot contain spaces");
          if(password.length < 5) return toast.error("Password must be at least 5 characters long.");

          setLoading(true)

          axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`,{email,password},{withCredentials: true})
          .then((res)=>{
              if(res.status !== 200){
                  toast.error(res.data.message);
              }
              else{                    
                  setEmail("");
                  setPassword("");
                  toast.success("logged in...")
                  localStorage.setItem("userId", res?.data?.id);
                  localStorage.setItem("token", res?.data?.token)
                  navigate("/")
                }
          })
          .then(()=>{
              setLoading(false)
              window.location.reload()
          })
          .catch((err) =>{
              if(err?.response?.data?.message){
                  toast.error(err?.response?.data?.message);
                  setLoading(false)
              }
          })
      }
    }
    return (
    <div className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
            <p className='text-2xl font-semibol'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
            <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

            <div className='w-full grid place-items-center p-1'>
                    <GoogleButton onClick={()=>{window.location.href = "http://localhost:8000/auth/google";}} label={state === 'Sign Up' ? 'Sign up with Google' : 'Sign in with Google'} style={{scale: "0.8"}}/>
            </div>
            <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 font-medium whitespace-nowrap">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            {
                state === 'Sign Up' &&
                <div className='w-full'>
                    <p>Username</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type="text" name="username" 
                        onChange={e=>{setUserName(e.target.value)}}
                        placeholder="Enter your username"
                        value={username} required 
                        />
                </div>
            }
            
            <div className='w-full'>
                <p>Email</p>
                <input
                    className='border border-zinc-300 rounded w-full p-2 mt-1'
                    type="email" name="email" 
                    onChange={e=>{setEmail(e.target.value)}}
                    placeholder="Enter your email" 
                    value={email} required 
                />
            </div>
            {
                state === 'Sign Up' &&
                <div className='w-full'>
                    <p>Mobile Number</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type="text" name="mobile" 
                        onChange={e=>{setMobile(e.target.value)}}
                        placeholder="Enter your mobile no."
                        value={mobile} required 
                    />
                </div>
            }

            <div className="w-full">
                <p>Password</p>
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
            {
                loading 
                ? <button disabled className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer'>Loading...</button> 
                : <button onClick={formSubmit} className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>
            }
            {
                state === 'Sign Up'
                ? <p>Already have an account? <span onClick={()=>setState('Login')} className='text-[#5f6fff] underline cursor-pointer'>Login</span></p>
                : <p>Create an new account? <span onClick={()=>setState('Sign Up')} className='text-[#5f6fff] underline cursor-pointer'>click here</span></p>
            }
            {
                state === "Sign Up"
                ? <></>
                : <p>Forgot Password? <span onClick={()=>{navigate("/generate-otp")}} className='text-[#5f6fff] underline cursor-pointer'>click here</span> </p>
            }
        </div>
    </div>
    )
}
