import React, { useState, useEffect, useCallback } from 'react'
import useAuth from '../hooks/auth-hook'

const AuthContext = React.createContext({
    user: {},
    department: {},
    token: '',
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: (user, token) => {},
    hasPermission: (code) => {},
})

export const AuthContextProvider = (props) => {
    const {
        user,
        token,
        loginHandler,
        logoutHandler,
        isLoggedIn,
        hasPermission,
        fetchUserData,
        department,
        selectDepartment,
    } = useAuth()

    return (
        <AuthContext.Provider
            value={{
                user: user,
                token: token,
                isLoggedIn: isLoggedIn,
                onLogout: logoutHandler,
                onLogin: loginHandler,
                hasPermission: hasPermission,
                fetchUserData: fetchUserData,
                department: department,
                selectDepartment: selectDepartment,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext
