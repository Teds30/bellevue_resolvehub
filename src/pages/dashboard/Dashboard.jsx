import React, { useState } from 'react'

import styles from './Dashboard.module.css'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'
import { Outlet, useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [active, setActive] = useState(0)

    const navigate = useNavigate()

    const handleActive = (id) => {
        setActive(id)
    }

    return (
        <>
            <div className={styles['container']}>
                <h2>Performances</h2>
                <div className={styles['title-content']}>
                    <p className="pre-title">DEPARTMENT</p>
                    <h4>IT Department</h4>
                </div>
                <div className={styles['nav_container']}>
                    <div
                        className={`${styles['nav_btn']} ${
                            active === 0 && styles['nav_btn_active']
                        }`}
                        onClick={() => {
                            navigate('')
                            handleActive(0)
                        }}
                    >
                        Issues
                    </div>
                    <div
                        className={`${styles['nav_btn']} ${
                            active === 1 && styles['nav_btn_active']
                        }`}
                        onClick={() => {
                            navigate('tasks')
                            handleActive(1)
                        }}
                    >
                        Tasks
                    </div>
                    {/* <div
                        className={`${styles['nav_btn']} ${
                            active === 2 && styles['nav_btn_active']
                        }`}
                        onClick={() => {
                            handleActive(2)
                        }}
                    >
                        Department
                    </div> */}
                </div>
                <Outlet />
            </div>
            <BottomNavigationBar current={0} />
        </>
    )
}

export default Dashboard
