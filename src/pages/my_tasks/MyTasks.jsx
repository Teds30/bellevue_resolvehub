import React, { useContext, useEffect, useState } from 'react'

import styles from './MyTasks.module.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Box, Fab, IconButton, Skeleton, Stack } from '@mui/material'
import {
    IconChevronRight,
    IconNavigationDiscount,
    IconPlus,
} from '@tabler/icons-react'

import useHttp from '../../hooks/http-hook'
import AuthContext from '../../context/auth-context'

import department_tasks from './department_tasks'
import Moment from 'react-moment'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'
import userPermission from '../../hooks/userPermission'

import { IconMapPin } from '@tabler/icons-react'
import dayjs from 'dayjs'
import PriorityTask from './PriorityTask'
import RaisedIssues from './RaisedIssues'
import DateFilter from './DateFilter'
import DoneTask from './DoneTask'
import CancelledTask from './CancelledTask'
const MyTasks = () => {
    const [active, setActive] = useState(0)
    const [tasks, setTasks] = useState([])
    const { sendRequest, isLoading } = useHttp()
    const [params, setParams] = useState('?filter_by=daily')
    const userCtx = useContext(AuthContext)
    const navigate = useNavigate()

    const {
        loadDepartmentAssigned,
        loadDepartmentOnGoing,
        loadDepartmentPending,
        loadDepartmentDone,
        loadDepartmentCancelled,
        isLoading: deptLoading,
    } = department_tasks()

    const handleActive = (id) => {
        setActive(id)
    }

    const loadAssigned = async () => {
        setTasks(null)
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/user_assigned_tasks/${
                userCtx.user.id
            }`,
        })
        setTasks(res.data)
    }
    const loadOnGoing = async () => {
        setTasks(null)
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/user_ongoing_tasks/${
                userCtx.user.id
            }`,
        })
        setTasks(res.data)
    }
    const loadPending = async () => {
        setTasks(null)
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/user_pending_tasks/${
                userCtx.user.id
            }`,
        })
        setTasks(res.data)
    }
    const loadDone = async () => {
        setTasks(null)
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/user_done_tasks/${
                userCtx.user.id
            }${params}`,
        })
        setTasks(res.data)
    }
    const loadCancelled = async () => {
        setTasks(null)
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/user_cancelled_tasks/${userCtx.user.id}${params}`,
        })
        setTasks(res.data)
    }

    useEffect(() => {
        const loadData = async () => {
            let _tasks
            //TODO: PERMISSION: Change to dynamic
            if (userCtx.hasPermission('101')) {
                setTasks(null)
                if (active === 0) _tasks = await loadDepartmentAssigned()
                if (active === 1) _tasks = await loadDepartmentOnGoing()
                if (active === 2) _tasks = await loadDepartmentPending()
                // if (active === 3) _tasks = await loadDepartmentDone(params)
                // if (active === 4) _tasks = await loadDepartmentCancelled(params)

                setTasks(_tasks)

                return
            }
            if (active === 0) await loadAssigned()
            else if (active === 1) await loadOnGoing()
            else if (active === 2) await loadPending()
            // else if (active === 3) await loadDone(params)
            // else if (active === 4) await loadCancelled(params)
        }

        if (userCtx.user) loadData()
    }, [userCtx, active, params])

    let skeletons = []

    for (let index = 0; index < 4; index++) {
        skeletons.push(
            <div
                key={index}
                className={styles['task_card']}
                style={{ width: '360px' }}
            >
                <Stack spacing={1}>
                    {/* For variant="text", adjust the height via font-size */}
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="rectangular" width={200} height={20} />
                    <Skeleton variant="rounded" width={150} height={10} />
                    <Skeleton variant="rounded" width={100} height={10} />
                </Stack>
            </div>
        )
    }

    const handleAppliedFilter = async (data) => {
        // queryClient.invalidateQueries({ queryKey: ['rows'] })

        let fetchParams = ''
        if (data) {
            if (data.selectedFilter == 1) {
                fetchParams = `?filter_by=daily`
            } else if (data.selectedFilter == 2) {
                fetchParams = `?filter_by=weekly`
            } else if (data.selectedFilter == 3) {
                fetchParams = `?filter_by=month&month=${dayjs(
                    data.month
                ).format('MMMM')}&year=${dayjs(data.month).format('YYYY')}`
            } else if (data.selectedFilter == 4) {
                fetchParams = `?filter_by=year&year=${dayjs(data.year).format(
                    'YYYY'
                )}`
            } else if (data.selectedFilter == 5) {
                // console.log(dayjs(data.custom).format('YYYY-MM-DD'))
                fetchParams = `?filter_by=custom&custom=${dayjs(
                    data.custom
                ).format('YYYY-MM-DD')}`
            }
        }

        console.log(fetchParams)
        setParams(fetchParams)
    }

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['welcome']}>
                    <h2 style={{ fontWeight: '500' }}>Welcome,</h2>
                    <h2>{userCtx.user && `${userCtx.user.first_name}!`}</h2>
                </div>

                {userCtx &&
                    userCtx.user &&
                    (userCtx.hasPermission('102') ||
                        userCtx.hasPermission('101')) && (
                        <>
                            <div className={styles['nav_container']}>
                                <div
                                    className={`${styles['nav_btn']} ${
                                        active === 0 && styles['nav_btn_active']
                                    }`}
                                    onClick={() => {
                                        handleActive(0)
                                    }}
                                >
                                    {
                                        //TODO: PERMISSION change to dynamic
                                    }
                                    {userCtx.user &&
                                    userCtx.hasPermission('104')
                                        ? 'Open Tasks'
                                        : 'Open Tasks'}
                                </div>
                                <div
                                    className={`${styles['nav_btn']} ${
                                        active === 1 && styles['nav_btn_active']
                                    }`}
                                    onClick={() => {
                                        handleActive(1)
                                    }}
                                >
                                    On-Going
                                </div>
                                <div
                                    className={`${styles['nav_btn']} ${
                                        active === 2 && styles['nav_btn_active']
                                    }`}
                                    onClick={() => {
                                        handleActive(2)
                                    }}
                                >
                                    Pending
                                </div>
                                <div
                                    className={`${styles['nav_btn']} ${
                                        active === 3 && styles['nav_btn_active']
                                    }`}
                                    onClick={() => {
                                        handleActive(3)
                                    }}
                                >
                                    Done
                                </div>
                                <div
                                    className={`${styles['nav_btn']} ${
                                        active === 4 && styles['nav_btn_active']
                                    }`}
                                    onClick={() => {
                                        handleActive(4)
                                    }}
                                >
                                    Cancelled
                                </div>
                                <div className={styles['divider']}></div>
                                <div
                                    className={`${styles['nav_btn_raised']} ${
                                        active === 5 && styles['nav_btn_active']
                                    }`}
                                    onClick={() => {
                                        handleActive(5)
                                    }}
                                >
                                    Forwarded Issues
                                </div>
                            </div>

                            {(active === 3 || active === 4 || active === 5) && (
                                <div className={styles['date_container']}>
                                    <p className="title">Filter:</p>
                                    <DateFilter
                                        handleAppliedFilter={
                                            handleAppliedFilter
                                        }
                                    />
                                </div>
                            )}
                            {/* {(active === 3 || active === 4) && (
                                <h3 style={{ textAlign: 'center' }}>Today</h3>
                            )} */}

                            {active !== 5 && active !== 3 && active !== 4 && (
                                <div className={styles['tasks_container']}>
                                    {isLoading || deptLoading ? (
                                        skeletons
                                    ) : !tasks ? (
                                        <>
                                            {active === 0 && (
                                                <p>
                                                    There are currently no
                                                    assigned tasks.
                                                </p>
                                            )}
                                            {active === 1 && (
                                                <p>
                                                    There are currently no
                                                    on-going tasks.
                                                </p>
                                            )}
                                            {active === 2 && (
                                                <p>
                                                    There are currently no
                                                    pending tasks.
                                                </p>
                                            )}
                                            {active === 3 && (
                                                <p>
                                                    There are currently no
                                                    accomplished tasks.
                                                </p>
                                            )}
                                            {active === 4 && (
                                                <p>
                                                    There are currently no
                                                    cancelled tasks.
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '32px',
                                                width: '100%',
                                            }}
                                        >
                                            <PriorityTask
                                                active={active}
                                                items={tasks}
                                                priority="high"
                                            />
                                            <PriorityTask
                                                active={active}
                                                items={tasks}
                                                priority="medium"
                                            />
                                            <PriorityTask
                                                active={active}
                                                items={tasks}
                                                priority="normal"
                                            />
                                            <PriorityTask
                                                active={active}
                                                items={tasks}
                                                priority="low"
                                            />
                                        </Box>
                                    )}
                                </div>
                            )}
                            {active === 3 && <DoneTask params={params} />}
                            {active === 4 && <CancelledTask params={params} />}
                            {active === 5 && <RaisedIssues params={params} />}
                        </>
                    )}
            </div>

            {userCtx.user && userCtx.hasPermission('108') && (
                <Fab
                    variant={'extended'}
                    sx={{
                        position: 'fixed',
                        bottom: 80,
                        right: 16,
                        color: '#fff',
                        backgroundColor: 'var(--accent)', // Specify your custom color here
                        '&:hover': {
                            backgroundColor: 'rgba(var(--accent-rgb), 0.8)', // Specify your custom hover color here
                        },
                    }}
                    onClick={() => {
                        navigate('/new-issue')
                    }}
                >
                    <IconPlus sx={{ mr: 1 }} /> new issue
                </Fab>
            )}
            <BottomNavigationBar current={1} />
        </>
    )
}

export default MyTasks
