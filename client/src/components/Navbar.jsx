import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/Appcontext';
import ConfirmationPopup from './Pop-up';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate()
  const {reloadProfile: loadUserProfileData, userData : data, logout, userId, token} = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const confirmLogout=()=>{
    navigate("/")
    logout();
    removeCookie("user_token")
    setShowPopup(false)
  }
  const cancelLogout=()=>{
    setShowPopup(false)
  }
  

  const links = [
    {name: "HOME", href: "/"},
    {name: "ALL DOCTORS", href: "/doctors"},
    {name: "ABOUT", href: "/about"},
    {name: "CONTACT", href: "/contact"},
  ]

  const removeCookie=(name)=>{
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`
  }

  useEffect(()=>{
    if(token){
      loadUserProfileData()
    }
  },[userId,token])



  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <div className='absolute'>
        <ConfirmationPopup
          showPopup={showPopup}
          handleConfirm={confirmLogout}
          handleCancel={cancelLogout}
          header={"Logout confirmation"}
          message={"Are you sure you want to logout?"} 
          btnMessage={"Log Out"} 
        />
      </div>
      <h1 onClick={()=>{navigate('/')}} className='text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold cursor-pointer'>QuickClinic</h1>
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        {
          links.map(({name, href})=>{
            
            return (
              <NavLink key={name} to={href}>
                <li className='py-1'>{name}</li>
                <hr className={`border-none outline-none h-0.5 bg-[#5f6fff] w-3/5 m-auto hidden`} />
              </NavLink>
            )
          })
        }
        <a href={`${import.meta.env.VITE_ADMIN_URL}`} target="_blank" className='border my-auto px-2.5 py-0.5 rounded-full border-gray-500'>Admin panel</a>
      </ul>
      <div className='flex items-center gap-4'>
        {
          token ? 
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 rounded-full' src={data?.profile || '/profile_pic.png'} alt='loading...'/>
            <img className='w-2.5' src='/dropdown_icon.svg' alt='dropdown'/>
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={()=>{navigate("/my-profile")}} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={()=>{navigate("/my-appointment")}} className='hover:text-black cursor-pointer'>My Apointments</p>
                <p onClick={()=>{setShowPopup(true);}} className='hover:text-black cursor-pointer'>Logout</p>
              </div>
            </div>
          </div>
          :
          <button onClick={()=>{navigate('/login')}} className='bg-[#5f6fff] text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer'>Create account</button>
        }
        {
          token ? 
          <div>
            <img onClick={()=>{setShowMenu(true)}} className='w-6 md:hidden' src="/menu_icon.svg" alt="" />
            <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
              <div className='flex items-center justify-between px-5 py-6'>
                <h1 className='text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold'>QuickClinic</h1>
                <img className='w-7' onClick={()=>{setShowMenu(false)}} src="/cross_icon.png" alt="" />
              </div>
              <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                <NavLink className='px-4 py-2 rounded inline-block' onClick={()=>setShowMenu(false)} to={"/"}>HOME</NavLink>
                <NavLink className='px-4 py-2 rounded inline-block' onClick={()=>setShowMenu(false)} to={"/doctors"}>ALL DOCTORS</NavLink>
                <a href={`${import.meta.env.VITE_ADMIN_URL}`} target="_blank" className='border my-auto px-2.5 py-0.5 rounded-full border-gray-500'>Admin panel</a>
              </ul>
            </div>
          </div> :
          <button onClick={()=>{navigate('/login')}} className='md:hidden bg-[#5f6fff] text-white px-8 py-3 rounded-full font-light cursor-pointer'>Create account</button>
        }

      </div>
    </div>
  )
}
