import React, { useContext, useEffect, useState } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

import styles from './TasksSection.module.css'
import { IconChevronRight } from '@tabler/icons-react'
import useHttp from '../../hooks/http-hook'
import AuthContext from '../../context/auth-context'
import { Link } from 'react-router-dom'

const TasksSection = () => {
    const pieParams = { height: 230, margin: { right: 5 } }

    const [metrics, setMetrics] = useState()

    const { sendRequest } = useHttp()
    const userCtx = useContext(AuthContext)

    useEffect(() => {
        const loadData = async () => {
            console.log('asdsssssssss')
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks_metric/${
                    userCtx.user.position.department_id
                }`,
            })

            setMetrics(res)
        }
        if (userCtx.user) loadData()
    }, [userCtx])

    // console.log(metrics)

    return (
        <div className={styles['container']}>
            <div className={styles['pie-container']}>
                <PieChart
                    className={styles['pie']}
                    {...pieParams}
                    series={[
                        {
                            data: [
                                {
                                    value: metrics && metrics.unassigned,
                                    label: 'Unassigned',
                                    color: '#FD4D8F',
                                },
                                {
                                    value: metrics && metrics.ongoing,
                                    label: 'On-Going',
                                    color: '#62CE94',
                                },
                                {
                                    value: metrics && metrics.pending,
                                    label: 'Pending',
                                    color: '#6266CE',
                                },
                                {
                                    value: metrics && metrics.cancelled,
                                    label: 'Cancelled',
                                    color: '#CB3E01',
                                },
                            ],
                            innerRadius: 80,
                            outerRadius: 100,
                            paddingAngle: 2,
                            cornerRadius: 10,
                            startAngle: 0,
                            endAngle: 360,
                            highlightScope: {
                                faded: 'global',
                                highlighted: 'item',
                            },
                            faded: {
                                innerRadius: 30,
                                additionalRadius: -30,
                                color: 'gray',
                            },
                        },
                    ]}
                    slotProps={{ legend: { hidden: true } }}
                />
                <div className={styles['pie-title']}>
                    <h1>{metrics ? metrics.total : '--'}</h1>
                    <p style={{ fontWeight: 600 }}>TASKS</p>
                </div>
            </div>
            <div className={styles['legends-container']}>
                <div className={styles['legends']}>
                    <div className={styles['legend']}>
                        <div className={styles['col1']}>
                            <div
                                className={`${styles['box']} ${styles['unassigned']}`}
                            ></div>
                            <p className="title">Unassigned</p>
                        </div>
                        <div className={styles['col2']}>
                            {metrics ? metrics.unassigned : '--'}
                        </div>
                    </div>
                    <div className={styles['legend']}>
                        <div className={styles['col1']}>
                            <div
                                className={`${styles['box']} ${styles['ongoing']}`}
                            ></div>
                            <p className="title">On-Going</p>
                        </div>
                        <div className={styles['col2']}>
                            {metrics ? metrics.ongoing : '--'}
                        </div>
                    </div>
                    <div className={styles['legend']}>
                        <div className={styles['col1']}>
                            <div
                                className={`${styles['box']} ${styles['pending']}`}
                            ></div>
                            <p className="title">Pending</p>
                        </div>
                        <div className={styles['col2']}>
                            {metrics ? metrics.pending : '--'}
                        </div>
                    </div>
                    <div className={styles['legend']}>
                        <div className={styles['col1']}>
                            <div
                                className={`${styles['box']} ${styles['cancelled']}`}
                            ></div>
                            <p className="title">Cancelled</p>
                        </div>
                        <div className={styles['col2']}>
                            {metrics ? metrics.cancelled : '--'}
                        </div>
                    </div>
                </div>
                <Link to="/tasks">
                    <div className={styles['action']}>
                        View all <IconChevronRight size={18} />{' '}
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default TasksSection
