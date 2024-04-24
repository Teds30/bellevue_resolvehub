import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/auth-context'

const Logout = () => {
    const userCtx = useContext(AuthContext)

    useEffect(() => {
        if (userCtx.user) {
            userCtx.onLogout()
        }
    }, [userCtx])
    return <div></div>
}

export default Logout
