import React, { useEffect, useState } from 'react'

import styles from './Department.module.css'
import Positions from './Positions'
import { useLocation, useParams } from 'react-router-dom'
import useHttp from '../../hooks/http-hook'
import People from './People'

const Department = (props) => {
    let { id } = useParams()

    const [active, setActive] = useState(0)
    const [department, setDepartment] = useState()

    const { sendRequest } = useHttp()

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/departments/${id}`,
            })

            setDepartment(res.data)
        }

        loadData()
    }, [])

    const handleActive = (id) => {
        setActive(id)
    }

    return (
        department && (
            <div className={styles['container']}>
                <div className={styles['title-container']}>
                    <p className="pre-title">DEPARTMENT</p>
                    <h2>{department.name}</h2>
                </div>
                <div className={styles['nav_container']}>
                    <div
                        className={`${styles['nav_btn']} ${
                            active === 0 && styles['nav_btn_active']
                        }`}
                        onClick={() => {
                            handleActive(0)
                        }}
                    >
                        Positions
                    </div>
                    <div
                        className={`${styles['nav_btn']} ${
                            active === 1 && styles['nav_btn_active']
                        }`}
                        onClick={() => {
                            handleActive(1)
                        }}
                    >
                        People
                    </div>
                </div>
                {active === 0 ? <Positions department_id={id} /> : <></>}
                {active === 1 ? <People department_id={id} /> : <></>}
            </div>
        )
    )
}

export default Department
