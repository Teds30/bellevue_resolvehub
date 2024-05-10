import React, { useContext, useEffect, useState } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

import styles from './TasksSection.module.css'
import { IconChevronRight } from '@tabler/icons-react'
import useHttp from '../../hooks/http-hook'
import AuthContext from '../../context/auth-context'
import { Link } from 'react-router-dom'
import Dropdown from '../../components/Dropdown/Dropdown'
import { IconBuilding } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { Box } from '@mui/material'
import DateSelector from '../../components/DateSelector/DateSelector'
import DepartmentContributions from './DepartmentContributions'

const TasksSection = () => {
    const pieParams = { height: 230, margin: { right: 5 } }

    const [metrics, setMetrics] = useState()
    const [selectedMetric, setSelectedMetric] = useState(1)
    const [year, setYear] = useState(dayjs)
    const [month, setMonth] = useState(dayjs)

    const [contributions, setContributions] = useState()

    const { sendRequest } = useHttp()
    const userCtx = useContext(AuthContext)

    useEffect(() => {
        const refreshData = async () => {
            if (selectedMetric === 1) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/tasks_metric/${userCtx.department.id}/daily`,
                    method: 'POST',
                })
                setMetrics(res)
                if (userCtx.department.id === 10000) {
                    const res2 = await sendRequest({
                        url: `${
                            import.meta.env.VITE_BACKEND_URL
                        }/api/tasks_metric_distribution/daily`,
                        method: 'POST',
                    })
                    setContributions(res2)
                }
            } else if (selectedMetric === 2) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/tasks_metric/${userCtx.department.id}/weekly`,
                    method: 'POST',
                })
                setMetrics(res)

                if (userCtx.department.id === 10000) {
                    const res2 = await sendRequest({
                        url: `${
                            import.meta.env.VITE_BACKEND_URL
                        }/api/tasks_metric_distribution/weekly`,
                        method: 'POST',
                    })
                    setContributions(res2)
                }
            } else if (selectedMetric === 3) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/tasks_metric/${userCtx.department.id}/monthly`,
                    method: 'POST',
                    body: JSON.stringify({
                        year: dayjs(year).year(),
                        month: dayjs(month).month(),
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                setMetrics(res)

                if (userCtx.department.id === 10000) {
                    const res2 = await sendRequest({
                        url: `${
                            import.meta.env.VITE_BACKEND_URL
                        }/api/tasks_metric_distribution/monthly`,
                        method: 'POST',
                        body: JSON.stringify({
                            year: dayjs(year).year(),
                            month: dayjs(month).month(),
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    setContributions(res2)
                }
            } else if (selectedMetric === 4) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/tasks_metric/${userCtx.department.id}/yearly`,
                    method: 'POST',
                    body: JSON.stringify({
                        year: dayjs(year).year(),
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                setMetrics(res)

                if (userCtx.department.id === 10000) {
                    const res2 = await sendRequest({
                        url: `${
                            import.meta.env.VITE_BACKEND_URL
                        }/api/tasks_metric_distribution/yearly`,
                        method: 'POST',
                        body: JSON.stringify({
                            year: dayjs(year).year(),
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    setContributions(res2)
                }
            }
        }

        if (userCtx.user && selectedMetric) refreshData()
    }, [userCtx, selectedMetric, month, year])

    const handleSelectMetric = async (e) => {
        setSelectedMetric(e.target.value)
    }

    return (
        <div className={styles['container']}>
            <Box
                sx={{
                    marginTop: '16px',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '16px',
                    gap: '8px',
                    display: 'flex',
                }}
            >
                <Dropdown
                    leadingIcon={
                        <IconBuilding size={20} color="var(--fc-body)" />
                    }
                    // label="Filter"
                    placeholder="Select filter"
                    items={[
                        { id: 1, name: 'Daily' },
                        { id: 2, name: 'Weekly' },
                        { id: 3, name: 'Monthly' },
                        { id: 4, name: 'Year' },
                    ]}
                    value={selectedMetric}
                    selected={selectedMetric}
                    handleSelect={handleSelectMetric}
                />
                {(selectedMetric === 3 || selectedMetric === 4) && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <IconChevronRight />
                    </Box>
                )}
                {selectedMetric === 3 ? (
                    <DateSelector
                        currentValue={month}
                        handleSetValue={setMonth}
                        defaultValue={null}
                        label={'Month'}
                        views={['month', 'year']}
                    />
                ) : selectedMetric === 4 ? (
                    <DateSelector
                        currentValue={year}
                        handleSetValue={setYear}
                        defaultValue={null}
                        label={'Year'}
                        views={['year']}
                    />
                ) : null}
            </Box>
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
                                    color: '#2d9bc0',
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
                                {
                                    value: metrics && metrics.done,
                                    label: 'Done',
                                    color: '#03b077',
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
                    <div className={styles['legend']}>
                        <div className={styles['col1']}>
                            <div
                                className={`${styles['box']} ${styles['done']}`}
                            ></div>
                            <p className="title">Done</p>
                        </div>
                        <div className={styles['col2']}>
                            {metrics ? metrics.done : '--'}
                        </div>
                    </div>
                </div>
                <Link to="/tasks">
                    <div className={styles['action']}>
                        View all <IconChevronRight size={18} />{' '}
                    </div>
                </Link>
            </div>

            {userCtx.department && userCtx.department.id === 10000 && (
                <DepartmentContributions contributions={contributions} />
            )}
        </div>
    )
}

export default TasksSection
