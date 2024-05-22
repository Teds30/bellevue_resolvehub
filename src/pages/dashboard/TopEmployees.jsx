import React, { useContext, useEffect, useState } from 'react'

import useHttp from '../../hooks/http-hook'
import AuthContext from '../../context/auth-context'
import { Box } from '@mui/system'
import Dropdown from '../../components/Dropdown/Dropdown'
import { IconBuilding, IconChevronRight, IconFilter } from '@tabler/icons-react'
import DateSelector from '../../components/DateSelector/DateSelector'
import dayjs from 'dayjs'
import { IconButton } from '@mui/material'
import { IconUsersGroup } from '@tabler/icons-react'

const TopEmployees = () => {
    const userCtx = useContext(AuthContext)
    const [topEmployees, setTopEmployees] = useState()
    const [topDepartments, setTopDepartments] = useState()

    const [selectedMetric, setSelectedMetric] = useState(1)
    const [year, setYear] = useState(dayjs)
    const [month, setMonth] = useState(dayjs)

    const { sendRequest } = useHttp()
    const [selected, setSelected] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/top_employees/${
                    userCtx.department.id
                }?filter_by=daily`,
            })

            setTopEmployees(res)

            const res2 = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/top_departments/${
                    userCtx.department.id
                }?filter_by=daily`,
            })

            setTopDepartments(res2)
        }

        if (userCtx.department) loadData()
    }, [userCtx])

    useEffect(() => {
        const refreshData = async () => {
            if (selectedMetric === 1) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/top_employees/${
                        userCtx.department.id
                    }?filter_by=daily`,
                })
                setTopEmployees(res)
                const res2 = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/top_departments?filter_by=daily`,
                })
                setTopDepartments(res2)
            } else if (selectedMetric === 2) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/top_employees/${
                        userCtx.department.id
                    }?filter_by=weekly`,
                })
                setTopEmployees(res)
                const res2 = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/top_departments?filter_by=weekly`,
                })
                setTopDepartments(res2)
            } else if (selectedMetric === 3) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/top_employees/${
                        userCtx.department.id
                    }?filter_by=month&month=${dayjs(
                        month
                    ).month()}&year=${dayjs(year).year()}`,
                })
                setTopEmployees(res)
                const res2 = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/top_departments?filter_by=month&month=${dayjs(
                        month
                    ).month()}&year=${dayjs(year).year()}`,
                })
                setTopDepartments(res2)
            } else if (selectedMetric === 4) {
                const res = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/top_employees/${
                        userCtx.department.id
                    }?filter_by=year&year=${dayjs(year).year()}`,
                })
                setTopEmployees(res)

                const res2 = await sendRequest({
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/top_departments?filter_by=year&year=${dayjs(
                        year
                    ).year()}`,
                })

                setTopDepartments(res2)
            }
        }

        if (userCtx.user && selectedMetric) refreshData()
    }, [selectedMetric, month, year])

    console.log(selectedMetric)

    const handleSelectMetric = async (e) => {
        setSelectedMetric(e.target.value)
    }

    return (
        <Box sx={{ paddingInline: '12px' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <h3>Top Performing</h3>
                <span>•</span>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <IconButton
                        onClick={() => setSelected(0)}
                        sx={
                            selected === 0 && {
                                backgroundColor: 'var(--accent)',
                                color: '#fff',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: 'var(--accent-dark)',
                                },
                            }
                        }
                    >
                        <IconUsersGroup size={20} />
                    </IconButton>
                    <IconButton
                        onClick={() => setSelected(1)}
                        sx={
                            selected === 1 && {
                                backgroundColor: 'var(--accent)',
                                color: '#fff',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: 'var(--accent-dark)',
                                },
                            }
                        }
                    >
                        <IconBuilding size={20} />
                    </IconButton>
                </Box>
            </Box>

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
                        <IconFilter size={20} color="var(--fc-body)" />
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
            {selected === 0 &&
                topEmployees &&
                topEmployees?.map((emp, index) => {
                    return (
                        <Box
                            key={index}
                            sx={{
                                borderBottom: '1px solid var(--border-color)',
                                padding: '12px 0',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginRight: '8px',
                                }}
                            >
                                <p className="title">{index + 1}.</p>
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                }}
                            >
                                <p>
                                    {emp.assignee.first_name}{' '}
                                    {emp.assignee.last_name}
                                </p>
                            </Box>
                            <Box>
                                <p className="title">{emp.completed_tasks}</p>
                            </Box>
                        </Box>
                    )
                })}

            {selected === 1 &&
                topDepartments &&
                topDepartments?.map((dep, index) => {
                    return (
                        <Box
                            key={index}
                            sx={{
                                borderBottom: '1px solid var(--border-color)',
                                padding: '12px 0',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginRight: '8px',
                                }}
                            >
                                <p className="title">{index + 1}.</p>
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                }}
                            >
                                <p>{dep.department.name} </p>
                            </Box>
                            <Box>
                                <p className="title">{dep.completed_tasks}</p>
                            </Box>
                        </Box>
                    )
                })}
        </Box>
    )
}

export default TopEmployees
