import React, { useContext, useEffect, useState } from 'react'

import styles from './Dashboard.module.css'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'
import { Outlet, useNavigate } from 'react-router-dom'
import AuthContext from '../../context/auth-context'
import useHttp from '../../hooks/http-hook'
import { Skeleton } from '@mui/material'
import Dropdown from '../../components/Dropdown/Dropdown'
import { IconBuilding } from '@tabler/icons-react'

const Dashboard = () => {
    const [active, setActive] = useState(0)
    // const [department, setDepartment] = useState()

    const { sendRequest } = useHttp()
    const [departments, setDepartments] = useState()
    const [selectedDepartment, setSelectedDepartment] = useState()

    const handleSelectDepartment = (e) => {
        setSelectedDepartment(e.target.value)

        userCtx.selectDepartment(e.target.value)
    }

    const navigate = useNavigate()
    const userCtx = useContext(AuthContext)

    const handleActive = (id) => {
        setActive(id)
    }

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/departments`,
            })

            let depts = [
                ...res.data?.sort((a, b) => a.name.localeCompare(b.name)),
            ]

            depts.unshift({ id: 10000, name: 'All Departments' })
            setDepartments(depts)
            setSelectedDepartment(10000)
        }

        if (userCtx && userCtx.user && userCtx.hasPermission('403')) loadData()
    }, [userCtx])

    // useEffect(() => {
    //     const loadData = async () => {
    //         setDepartment(userCtx.user.position.department)
    //     }

    //     if (userCtx.user) loadData()
    // }, [userCtx])

    return (
        <>
            <div className={styles['container']}>
                <h2>Performances</h2>
                <div className={styles['title-content']}>
                    <p className="pre-title">DEPARTMENT</p>
                    {userCtx && userCtx.hasPermission('403') ? (
                        <Dropdown
                            leadingIcon={
                                <IconBuilding
                                    size={20}
                                    color="var(--fc-body)"
                                />
                            }
                            placeholder="Select department"
                            items={departments}
                            value={selectedDepartment}
                            selected={selectedDepartment}
                            handleSelect={handleSelectDepartment}
                        />
                    ) : (
                        <h4>
                            {userCtx && userCtx.department ? (
                                userCtx.department.name
                            ) : (
                                <Skeleton
                                    variant="text"
                                    width={100}
                                    height={24}
                                />
                            )}
                        </h4>
                    )}
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
                    <div
                        className={`${styles['nav_btn']} ${
                            active === 2 && styles['nav_btn_active']
                        }`}
                        onClick={() => {
                            navigate('projects')
                            handleActive(2)
                        }}
                    >
                        Projects
                    </div>
                    <div
                        className={`${styles['nav_btn']} ${
                            active === 3 && styles['nav_btn_active']
                        }`}
                        onClick={() => {
                            navigate('top_performing')
                            handleActive(3)
                        }}
                    >
                        Top Performing
                    </div>
                </div>
                <Outlet />
            </div>
            <BottomNavigationBar current={0} />
        </>
    )
}

export default Dashboard
