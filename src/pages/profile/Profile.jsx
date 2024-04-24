import React, { useContext } from 'react'
import AuthContext from '../../context/auth-context'

import styles from './Profile.module.css'
import { Outlet } from 'react-router-dom'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'

const Profile = () => {
    const userCtx = useContext(AuthContext)

    return (
        <div className={styles['container']}>
            <Outlet />
            <BottomNavigationBar current={5} />
        </div>
    )
}

export default Profile
