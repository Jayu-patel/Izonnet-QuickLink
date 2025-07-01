import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

export default function ProtectedRoute() {
    const {aToken} = useContext(AdminContext)
    const {dToken} = useContext(DoctorContext)

    if(aToken) return <Navigate to={"/admin-dashboard"} />
    if(dToken) return <Navigate to={"/doctor-dashboard"} />
    return (
        <div>
            <Outlet />
        </div>
    )
}
