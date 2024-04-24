import React, { useContext, useEffect, useState } from 'react'
import useHttp from '../../hooks/http-hook'

import styles from './Departments.module.css'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/auth-context'

const DepartmentList = () => {
    const userCtx = useContext(AuthContext)
    const navigate = useNavigate()
    const { sendRequest, isLoading } = useHttp()
    const [departments, setDepartments] = useState([])

    const loadAllDepartments = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/departments`,
        })

        setDepartments(res.data)
    }

    const loadUserDepartment = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/departments/${
                userCtx.user.position.department_id
            }`,
        })

        setDepartments([res.data])
    }

    useEffect(() => {
        const loadData = async () => {
            if (userCtx.hasPermission('302')) {
                loadAllDepartments()
            } else {
                loadUserDepartment()
            }
        }

        if (userCtx.user) loadData()
    }, [userCtx])

    return (
        <div>
            {departments ? (
                <div className={styles['departments-container']}>
                    {departments.map((dept, index) => {
                        return (
                            <div
                                className={styles['department']}
                                key={index}
                                onClick={() => navigate(`${dept.id}`)}
                            >
                                <h3>{dept.name}</h3>
                                <p>{dept.employee_count} people</p>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <Box></Box>
            )}
        </div>
    )
}

export default DepartmentList
