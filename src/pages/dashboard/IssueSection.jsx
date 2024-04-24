import { LineChart } from '@mui/x-charts'
import React, { useEffect, useState } from 'react'
import useHttp from '../../hooks/http-hook'

import styles from './IssueSection.module.css'
import Dropdown from '../../components/Dropdown/Dropdown'
import { IconBuilding } from '@tabler/icons-react'

const IssueSection = () => {
    const { sendRequest } = useHttp()

    const [graphData, setGraphData] = useState()
    const [selectedMetric, setSelectedMetric] = useState(1)
    const [reports, setReports] = useState()

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/issues_metric/week`,
            })

            const res2 = await sendRequest({
                url: `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/issues_most_reported`,
            })

            setGraphData(res)
            setReports(res2)
        }
        loadData()
    }, [])

    const handleSelectMetric = async (e) => {
        if (e.target.value === 1) {
            const res = await sendRequest({
                url: `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/issues_metric/week`,
            })

            setGraphData(res)
        } else if (e.target.value === 2) {
            const res = await sendRequest({
                url: `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/issues_metric/month`,
            })

            setGraphData(res)
        }
        setSelectedMetric(e.target.value)
    }

    return (
        <section className={styles['container']}>
            <Dropdown
                leadingIcon={<IconBuilding size={20} color="var(--fc-body)" />}
                label="Filter"
                placeholder="Select filter"
                items={[
                    { id: 1, name: 'Weekly' },
                    { id: 2, name: 'Monthly' },
                ]}
                value={selectedMetric}
                selected={selectedMetric}
                handleSelect={handleSelectMetric}
            />

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
