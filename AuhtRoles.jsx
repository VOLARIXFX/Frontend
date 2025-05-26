import { Navigate, useLocation } from "react-router-dom"
import React from "react"

const ProtectRouter = ({ children, Roles }) => {
    const location = useLocation()
    const userStr = localStorage.getItem('user')
        // se recupera datos del login ☝️

    if(!userStr) {
        return <Navigate to='/' state={{from: location}} replace />
    }

    const user = JSON.parse(userStr)

    if(Roles && !Roles.includes(user.rol)) {
        return <Navigate to='/' replace/>
    }

    return children
}

export default ProtectRouter