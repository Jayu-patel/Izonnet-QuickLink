// import Link from 'next/link'
import {NavLink} from 'react-router-dom'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

export default function SideBar() {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)
    const adminNavLinks = [
        { href: '/admin-dashboard', icon: '/home_icon.svg', label: 'Dashboard' },
        { href: '/all-appointments', icon: '/appointment_icon.svg', label: 'Appointments' },
        { href: '/add-doctor', icon: '/add_icon.svg', label: 'Add Doctor' },
        { href: '/doctor-list', icon: '/people_icon.svg', label: 'Doctors List' }
    ];

    const doctorNavlinks = [
        { href: '/doctor-dashboard', icon: '/home_icon.svg', label: 'Dashboard' },
        { href: '/doctor-appointments', icon: '/appointment_icon.svg', label: 'Appointments' },
        { href: '/doctor-profile', icon: '/add_icon.svg', label: 'Profile' },
    ]
    return (
        <div className='min-h-screen bg-white border-r'>
            {
                aToken &&
                <ul className='text-[#515151] mt-5'>
                    {
                        adminNavLinks.map((link, index) => {
                            return (
                                <NavLink key={index} to={link.href} className={({isActive})=> `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-[#5f6fff]' : '' }`}>
                                    <img src={link.icon} alt={link.label} />
                                    <p className='hidden md:block'>{link.label}</p>
                                </NavLink>
                            )
                        })
                    }
                </ul>
            }
            {
                dToken &&
                <ul className='text-[#515151] mt-5'>
                    {
                        doctorNavlinks.map((link, index) => {
                            return (
                                <NavLink key={index} to={link.href} className={({isActive})=> `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-[#5f6fff]' : '' }`}>
                                    <img src={link.icon} alt={link.label} />
                                    <p className='hidden md:block'>{link.label}</p>
                                </NavLink>
                            )
                        })
                    }
                </ul>
            }
        </div>
    )
}
