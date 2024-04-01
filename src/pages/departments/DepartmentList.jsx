import React, { useEffect, useState } from 'react'
import useHttp from '../../hooks/http-hook'

import styles from './Departments.module.css'
import { useNavigate } from 'react-router-dom'
const DepartmentList = () => {
    const navigate = useNavigate()
    const { sendRequest, isLoading } = useHttp()
    const [departments, setDepartments] = useState([])

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/departments`,
            })

            setDepartments(res.data)
        }

        loadData()
    }, [])

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
