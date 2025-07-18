// import Link from 'next/link'
import {NavLink} from 'react-router-dom'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export default function SideBar() {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    const adminNavLinks = [
        { href: '/admin-dashboard', icon: <DashboardIcon/>, label: 'Dashboard' },
        { href: '/all-appointments', icon: <BookOnlineIcon/>, label: 'Appointments' },
        { href: '/add-doctor', icon: <AddBoxIcon/>, label: 'Add Doctor' },
        { href: '/doctor-list', icon: <FormatListNumberedIcon/>, label: 'Doctors List' },
        { href: '/specialities', icon: <BloodtypeIcon/>, label: 'Specialities' },
        { href: '/admin', icon: <AdminPanelSettingsIcon/>, label: 'Admin' }
    ];

    const doctorNavlinks = [
        { href: '/doctor-dashboard', icon: <DashboardIcon/>, label: 'Dashboard' },
        { href: '/doctor-appointments', icon: <BookOnlineIcon/>, label: 'Appointments' },
        { href: '/doctor-profile', icon: <AccountBoxIcon/>, label: 'Profile' },
    ]
    return (
        <div className='min-h-screen bg-white border-r'>
            {
                aToken &&
                <ul className='text-[#515151] mt-5'>
                    {
                        adminNavLinks.map((link, index) => {
                            return (
                                <NavLink key={index} to={link.href} className={({isActive})=> `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#f2f3ff] transition-all ${isActive ? 'bg-[#f2f3ff] border-r-4 border-[#5f6fff] [&_span]:text-[#5f6fff] [&_p]:text-[#5f6fff]' : '' }`}>
                                    <span>{link.icon}</span>
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
                                <NavLink key={index} to={link.href} className={({isActive})=> `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#f2f3ff] transition-all ${isActive ? 'bg-[#f2f3ff] border-r-4 border-[#5f6fff] [&_span]:text-[#5f6fff] [&_p]:text-[#5f6fff]' : '' }`}>
                                    <span>{link.icon}</span>
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
