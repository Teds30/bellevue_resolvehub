import React, { useState, useEffect, useCallback } from 'react'
import useAuth from '../hooks/auth-hook'

const AuthContext = React.createContext({
    user: {},
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
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext
