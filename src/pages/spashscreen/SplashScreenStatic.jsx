import React from 'react'

import styles from './SplashScreen.module.css'
import { Box } from '@mui/material'
import BellevueLoading from '../../components/LoadingSpinner/BellevueLoading'

const SplashScreenStatic = () => {
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

export default SplashScreenStatic
