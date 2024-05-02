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

const ProjectsSection = () => {
    const pieParams = { height: 230, margin: { right: 5 } }

    const [metrics, setMetrics] = useState()
    const [selectedMetric, setSelectedMetric] = useState(1)
    const [year, setYear] = useState(dayjs)
    const [month, setMonth] = useState(dayjs)

    const { sendRequest } = useHttp()
    const userCtx = useContext(AuthContext)

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/projects_metric/${
                    userCtx.user.position.department_id
                }/daily`,
                method: 'POST',
            })

            setMetrics(res)
        }
        if (userCtx.user) loadData()
    }, [userCtx])

    const handleSelectMetric = async (e) => {
        if (e.target.value === 1) {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/projects_metric/${
                    userCtx.user.position.department_id
                }/daily`,
                method: 'POST',
            })
            setMetrics(res)
        } else if (e.target.value === 2) {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/projects_metric/${
                    userCtx.user.position.department_id
                }/weekly`,
                method: 'POST',
            })
            setMetrics(res)
        } else if (e.target.value === 3) {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/projects_metric/${
                    userCtx.user.position.department_id
                }/monthly`,
                method: 'POST',
                body: JSON.stringify({
                    month: dayjs(month).month() + 1,
                    year: dayjs(month).year(),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            setMetrics(res)
        } else if (e.target.value === 4) {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/projects_metric/${
                    userCtx.user.position.department_id
                }/yearly`,
                method: 'POST',
                body: JSON.stringify({
                    year: dayjs(year).year(),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            setMetrics(res)
        }
        setSelectedMetric(e.target.value)
    }

    useEffect(() => {
        const refetchData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/projects_metric/${
                    userCtx.user.position.department_id
                }/monthly`,
                method: 'POST',
                body: JSON.stringify({
                    month: dayjs(month).month() + 1,
                    year: dayjs(month).year(),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            setMetrics(res)
        }
        if (selectedMetric === 3) refetchData()
    }, [month])

    useEffect(() => {
        const refetchData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/projects_metric/${
                    userCtx.user.position.department_id
                }/yearly`,
                method: 'POST',
                body: JSON.stringify({
                    year: dayjs(year).year(),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            setMetrics(res)
        }
        if (selectedMetric === 4) refetchData()
    }, [year])

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
                                    label: 'Request',
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
                                    value: metrics && metrics.done,
                                    label: 'Done',
                                    color: '#03b077',
                                },
                                {
                                    value: metrics && metrics.cancelled,
                                    label: 'Cancelled',
                                    color: '#CB3E01',
                                },
                                {
                                    value: metrics && metrics.rejected,
                                    label: 'Rejected',
                                    color: '#555',
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
                            <p className="title">Request</p>
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
                                className={`${styles['box']} ${styles['done']}`}
                            ></div>
                            <p className="title">Done</p>
                        </div>
                        <div className={styles['col2']}>
                            {metrics ? metrics.done : '--'}
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
                                className={`${styles['box']} ${styles['rejected']}`}
                            ></div>
                            <p className="title">Rejected</p>
                        </div>
                        <div className={styles['col2']}>
                            {metrics ? metrics.rejected : '--'}
                        </div>
                    </div>
                </div>
                <Link to="/projects">
                    <div className={styles['action']}>
                        View all <IconChevronRight size={18} />{' '}
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default ProjectsSection
