import React, { useEffect, useState } from 'react'

import styles from './Departments.module.css'
import { Box, IconButton } from '@mui/material'
import { IconArrowNarrowLeft } from '@tabler/icons-react'
import { Outlet, useNavigate } from 'react-router-dom'
import useHttp from '../../hooks/http-hook'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'

const Departments = (props) => {
    const navigate = useNavigate()

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['topnav']}>
                    <IconButton
                        aria-label="delete"
                        onClick={() => {
                            navigate(-1)
                        }}
                    >
                        <IconArrowNarrowLeft color="var(--fc-strong)" />
                    </IconButton>
                    <h4 style={{ lineHeight: '1em' }}>Manage Department</h4>
                </div>
                <Outlet />
            </div>
            <BottomNavigationBar current={3} />
        </>
    )
}

export default Departments
