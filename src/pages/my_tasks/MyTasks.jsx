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
const MyTasks = () => {
    const [active, setActive] = useState(0)
    const [tasks, setTasks] = useState([])
    const { sendRequest, isLoading } = useHttp()
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
            }`,
            method: 'POST',
            body: JSON.stringify({ today: true }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userCtx.token}`,
            },
        })
        setTasks(res.data)
    }
    const loadCancelled = async () => {
        setTasks(null)
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/user_cancelled_tasks/${userCtx.user.id}`,
            method: 'POST',
            body: JSON.stringify({ today: true }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userCtx.token}`,
            },
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
                if (active === 3) _tasks = await loadDepartmentDone()
                if (active === 4) _tasks = await loadDepartmentCancelled()

                setTasks(_tasks)

                return
            }
            if (active === 0) await loadAssigned()
            else if (active === 1) await loadOnGoing()
            else if (active === 2) await loadPending()
            else if (active === 3) await loadDone()
            else if (active === 4) await loadCancelled()
        }

        if (userCtx.user) loadData()
    }, [userCtx, active])

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
                            </div>

                            {(active === 3 || active === 4) && (
                                <h3 style={{ textAlign: 'center' }}>Today</h3>
                            )}

                            <div className={styles['tasks_container']}>
                                {isLoading || deptLoading ? (
                                    skeletons
                                ) : !tasks ? (
                                    <>
                                        {active === 0 && (
                                            <p>
                                                There are currently no assigned
                                                tasks.
                                            </p>
                                        )}
                                        {active === 1 && (
                                            <p>
                                                There are currently no on-going
                                                tasks.
                                            </p>
                                        )}
                                        {active === 2 && (
                                            <p>
                                                There are currently no pending
                                                tasks.
                                            </p>
                                        )}
                                        {active === 3 && (
                                            <p>
                                                There are currently no
                                                accomplished tasks today.
                                            </p>
                                        )}
                                        {active === 4 && (
                                            <p>
                                                There are currently no cancelled
                                                tasks today.
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    tasks?.map((task, index) => {
                                        return (
                                            <Link
                                                className={'card-link'}
                                                key={index}
                                                to={`/tasks/${task.id}`}
                                            >
                                                <div
                                                    className={
                                                        styles['task_card']
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles['col1']
                                                        }
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                // padding: '2px 8px',
                                                                // border: '1px solid #1ca457',
                                                                borderRadius:
                                                                    '12px',
                                                                width: 'fit-content',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <div
                                                                className={
                                                                    styles[
                                                                        'room_chip'
                                                                    ]
                                                                }
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'center',
                                                                        gap: '4px',
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            display:
                                                                                'flex',
                                                                            alignItems:
                                                                                'center',
                                                                        }}
                                                                    >
                                                                        <IconMapPin
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    </Box>{' '}
                                                                    {task.room}
                                                                </Box>
                                                                <span
                                                                    className={
                                                                        styles[
                                                                            'priority-chip'
                                                                        ]
                                                                    }
                                                                    style={{
                                                                        backgroundColor:
                                                                            task.priority ===
                                                                            1
                                                                                ? '#C0362D'
                                                                                : task.priority ===
                                                                                  2
                                                                                ? '#EAAA08'
                                                                                : task.priority ===
                                                                                  3
                                                                                ? '#2DC044'
                                                                                : task.priority ===
                                                                                  4
                                                                                ? '#2d9bc0'
                                                                                : '#000',
                                                                    }}
                                                                >
                                                                    {task.priority ===
                                                                    1
                                                                        ? 'HIGH'
                                                                        : task.priority ===
                                                                          2
                                                                        ? 'MEDIUM'
                                                                        : task.priority ===
                                                                          3
                                                                        ? 'NORMAL'
                                                                        : task.priority ===
                                                                          4
                                                                        ? 'LOW'
                                                                        : ''}
                                                                </span>
                                                            </div>
                                                            {/* {task.status === 1 && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    // padding: '2px 8px',
                                                    // border: '1px solid #1ca457',
                                                    borderRadius: '12px',
                                                    width: 'fit-content',
                                                    gap: '4px',
                                                }}
                                            >
                                                <span
                                                    className={styles['blob']}
                                                ></span>
                                                <p
                                                    style={{
                                                        fontSize: '10px',
                                                        letterSpacing: '1px',
                                                        color: '#1ca457',
                                                        fontWeight: 700,
                                                    }}
                                                >@
                                                    ACTIVE
                                                </p>
                                            </Box>
                                        )} */}
                                                        </Box>

                                                        <h4>{task.issue}</h4>
                                                        {active === 0 && (
                                                            <>
                                                                <p
                                                                    style={{
                                                                        fontSize:
                                                                            '12px',
                                                                        color: 'var(--fc-body)',
                                                                    }}
                                                                >
                                                                    by{' '}
                                                                    <strong>{`${task.requestor.first_name} ${task.requestor.last_name}`}</strong>
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        fontSize:
                                                                            '12px',
                                                                        color: 'var(--fc-body)',
                                                                    }}
                                                                >
                                                                    {' '}
                                                                    <Moment
                                                                        fromNow
                                                                    >
                                                                        {
                                                                            task.created_at
                                                                        }
                                                                    </Moment>
                                                                </p>
                                                            </>
                                                        )}

                                                        {
                                                            //TODO: PERMISSION: change to dynamic
                                                            active === 1 &&
                                                                task.assignee_id &&
                                                                userCtx.user
                                                                    .position_id ===
                                                                    3 && (
                                                                    <p
                                                                        style={{
                                                                            fontSize:
                                                                                '12px',
                                                                            color: 'var(--fc-body)',
                                                                        }}
                                                                    >
                                                                        Assignee:{' '}
                                                                        <strong>{`${task.assignee.first_name} ${task.assignee.last_name}`}</strong>
                                                                    </p>
                                                                )
                                                        }
                                                        {active === 1 &&
                                                            task.assignee_id &&
                                                            task.assignee_id !==
                                                                userCtx.user
                                                                    .id && (
                                                                <p
                                                                    style={{
                                                                        fontSize:
                                                                            '12px',
                                                                        color: 'var(--fc-body)',
                                                                    }}
                                                                >
                                                                    assigned to{' '}
                                                                    <strong>{`${task.assignee.first_name} ${task.assignee.last_name}`}</strong>
                                                                </p>
                                                            )}
                                                        {active === 1 && (
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '12px',
                                                                    color: 'var(--fc-body)',
                                                                }}
                                                            >
                                                                {dayjs().isAfter(
                                                                    dayjs(
                                                                        task.schedule
                                                                    )
                                                                ) ? (
                                                                    'OVERDUE'
                                                                ) : (
                                                                    <span>
                                                                        {' '}
                                                                        Accomplish
                                                                        before:{' '}
                                                                        <Moment
                                                                            format="h:mma"
                                                                            style={{
                                                                                color: 'var(--accent)',
                                                                                fontWeight: 600,
                                                                            }}
                                                                        >
                                                                            {
                                                                                task.schedule
                                                                            }
                                                                        </Moment>
                                                                    </span>
                                                                )}
                                                            </p>
                                                        )}
                                                        {
                                                            //TODO: PERMISSION: change to dynamic
                                                            active === 2 &&
                                                                task.assignee_id &&
                                                                userCtx.user
                                                                    .position_id ===
                                                                    3 && (
                                                                    <>
                                                                        <p
                                                                            style={{
                                                                                fontSize:
                                                                                    '12px',
                                                                                color: 'var(--fc-body)',
                                                                            }}
                                                                        >
                                                                            Assignee:{' '}
                                                                            {
                                                                                task
                                                                                    .assignee
                                                                                    .first_name
                                                                            }{' '}
                                                                            {
                                                                                task
                                                                                    .assignee
                                                                                    .last_name
                                                                            }
                                                                        </p>
                                                                    </>
                                                                )
                                                        }

                                                        {active === 2 && (
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '12px',
                                                                    color: 'var(--fc-body)',
                                                                }}
                                                            >
                                                                Accomplish
                                                                before:{' '}
                                                                <Moment format="MMM D [at] h:mma">
                                                                    {
                                                                        task.schedule
                                                                    }
                                                                </Moment>
                                                            </p>
                                                        )}
                                                        {active === 3 && (
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '12px',
                                                                    color: 'var(--fc-body)',
                                                                }}
                                                            >
                                                                Accomplished on:{' '}
                                                                <Moment format="MMM D [at] h:mma">
                                                                    {
                                                                        task.updated_at
                                                                    }
                                                                </Moment>
                                                            </p>
                                                        )}
                                                        {active === 4 && (
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '12px',
                                                                    color: 'var(--accent-danger)',
                                                                }}
                                                            >
                                                                Cancelled on:{' '}
                                                                <Moment format="MMM D [at] h:mma">
                                                                    {
                                                                        task.updated_at
                                                                    }
                                                                </Moment>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={
                                                            styles['col2']
                                                        }
                                                    >
                                                        <IconButton aria-label="delete">
                                                            <IconChevronRight />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                )}
                            </div>
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
