import React, { useContext, useEffect } from 'react'

import styles from './SplashScreen.module.css'
import { Box } from '@mui/material'
import BellevueLoading from '../../components/LoadingSpinner/BellevueLoading'
import AuthContext from '../../context/auth-context'
import { useNavigate } from 'react-router-dom'

const SplashScreen = () => {
    const userCtx = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (userCtx.isLoggedIn !== 'initial') {
            if (userCtx.user) {
                navigate('/tasks')
            } else {
                navigate('/login')
            }
        }
    }, [userCtx.user])

    return (
        <div className={styles['container']}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '32px',
                }}
            >
                <BellevueLoading />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        // gap: '32px',
                    }}
                >
                    <h2>THE BELLEVUE MANILA</h2>
                    <h3>Operations Management System</h3>
                </Box>
            </Box>
        </div>
    )
}

export default SplashScreen
