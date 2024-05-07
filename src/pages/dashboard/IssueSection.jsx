import { LineChart } from '@mui/x-charts'
import React, { useContext, useEffect, useState } from 'react'
import useHttp from '../../hooks/http-hook'

import styles from './IssueSection.module.css'
import Dropdown from '../../components/Dropdown/Dropdown'
import { IconBuilding, IconChevronCompactRight } from '@tabler/icons-react'
import { Box } from '@mui/material'
import DateSelector from '../../components/DateSelector/DateSelector'
import dayjs from 'dayjs'
import { IconChevronRight } from '@tabler/icons-react'
import AuthContext from '../../context/auth-context'

const IssueSection = () => {
    const { sendRequest } = useHttp()

    const userCtx = useContext(AuthContext)

    const [graphData, setGraphData] = useState()
    const [selectedMetric, setSelectedMetric] = useState(1)
    const [reports, setReports] = useState()
    const [year, setYear] = useState(dayjs)
    const [month, setMonth] = useState(dayjs)

    useEffect(() => {
        const refreshData = async () => {
            if (selectedMetric === 1) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/issues_metric/week/${userCtx.department.id}`,
                })

                const res2 = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/issues_most_reported/week/${userCtx.department.id}`,
                })
                setReports(res2)

                setGraphData(res)
            } else if (selectedMetric === 2) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/issues_metric/month/${userCtx.department.id}`,
                    method: 'POST',
                    body: JSON.stringify({
                        month: dayjs(month).month() + 1,
                        year: dayjs(month).year(),
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const res2 = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/issues_most_reported/month/${userCtx.department.id}`,
                    method: 'POST',
                    body: JSON.stringify({
                        year: dayjs(year).year(),
                        month: dayjs(month).month(),
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                setReports(res2)

                setGraphData(res)
            } else if (selectedMetric === 3) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/issues_metric/year/${userCtx.department.id}`,
                    method: 'POST',
                    body: JSON.stringify({
                        year: dayjs(year).year(),
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const res2 = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/issues_most_reported/year/${userCtx.department.id}`,
                    method: 'POST',
                    body: JSON.stringify({
                        year: dayjs(year).year(),
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                setReports(res2)

                setGraphData(res)
            }
        }

        if (userCtx.user && selectedMetric) refreshData()
    }, [userCtx, selectedMetric, month, year])

    // useEffect(() => {
    //     const refetchData = async () => {
    //         console.log('month')

    //         const res = await sendRequest({
    //             url: `${
    //                 import.meta.env.VITE_BACKEND_URL
    //             }/api/issues_metric/month/${
    //                 userCtx.user.position.department_id
    //             }`,
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 month: dayjs(month).month() + 1,
    //                 year: dayjs(month).year(),
    //             }),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         })

    //         const res2 = await sendRequest({
    //             url: `${
    //                 import.meta.env.VITE_BACKEND_URL
    //             }/api/issues_most_reported/month/${
    //                 userCtx.user.position.department_id
    //             }`,
    //         })
    //         setReports(res2)

    //         setGraphData(res)
    //     }
    //     if (selectedMetric === 2 && userCtx.user) refetchData()
    // }, [month, userCtx])

    // useEffect(() => {
    //     const refetchData = async () => {
    //         console.log('year')
    //         const res = await sendRequest({
    //             url: `${
    //                 import.meta.env.VITE_BACKEND_URL
    //             }/api/issues_metric/year/${
    //                 userCtx.user.position.department_id
    //             }`,
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 year: dayjs(year).year(),
    //             }),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         })

    //         const res2 = await sendRequest({
    //             url: `${
    //                 import.meta.env.VITE_BACKEND_URL
    //             }/api/issues_most_reported/year/${
    //                 userCtx.user.position.department_id
    //             }`,
    //         })
    //         setReports(res2)

    //         setGraphData(res)
    //     }
    //     if (selectedMetric === 3 && userCtx.user) refetchData()
    // }, [year, userCtx])

    const handleSelectMetric = async (e) => {
        setSelectedMetric(e.target.value)
    }

    return (
        <section className={styles['container']}>
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
                        { id: 1, name: 'This Week' },
                        { id: 2, name: 'Month' },
                        { id: 3, name: 'Year' },
                    ]}
                    value={selectedMetric}
                    selected={selectedMetric}
                    handleSelect={handleSelectMetric}
                />
                {(selectedMetric === 2 || selectedMetric === 3) && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <IconChevronRight />
                    </Box>
                )}
                {selectedMetric === 2 ? (
                    <DateSelector
                        currentValue={month}
                        handleSetValue={setMonth}
                        defaultValue={null}
                        label={'Month'}
                        views={['month', 'year']}
                    />
                ) : selectedMetric === 3 ? (
                    <DateSelector
                        currentValue={year}
                        handleSetValue={setYear}
                        defaultValue={null}
                        label={'Year'}
                        views={['year']}
                    />
                ) : null}
            </Box>

            {graphData && (
                <LineChart
                    sx={{
                        '& .MuiAreaElement-root': {
                            // strokeWidth: 4,
                            fill: 'red',
                            // borderColor: 'red',
                            stroke: 'red',
                            // fill: 'rgba(var(--accent-rgb), 0.2)',
                        },
                        '& .MuiLineElement-root': {
                            stroke: 'var(--accent)',
                        },
                        '& .MuiMarkElement-root': {
                            stroke: 'var(--accent)',
                        },

                        '& .MuiAreaElement-series': {
                            stroke: 'red',
                            fill: 'red',
                        },
                    }}
                    series={[
                        { data: graphData.series[0].data, label: 'Issue' },
                    ]}
                    xAxis={[
                        { scaleType: 'point', data: graphData.xAxis[0].data },
                    ]}
                    width={360}
                    height={300}
                />
            )}

            <div className={styles['most-reported']}>
                <h4>Most reported issues</h4>
                <div className={styles['reports']}>
                    {reports?.map((report, index) => {
                        return (
                            <div className={styles['report']} key={index}>
                                <p>{report.issue}</p>
                                <p className="title">{report.total}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default IssueSection
