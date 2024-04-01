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

const MyTasks = () => {
    const [active, setActive] = useState(0)
    const [tasks, setTasks] = useState([])
    const { sendRequest } = useHttp()
    const userCtx = useContext(AuthContext)
    const navigate = useNavigate()

    const { hasPermission } = userPermission()

    const {
        loadDepartmentAssigned,
        loadDepartmentOnGoing,
        loadDepartmentPending,
        isLoading,
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

    useEffect(() => {
        const loadData = async () => {
            let _tasks
            //TODO: PERMISSION: Change to dynamic
            if (hasPermission('101')) {
                setTasks(null)
                if (active === 0) _tasks = await loadDepartmentAssigned()
                if (active === 1) _tasks = await loadDepartmentOnGoing()
                if (active === 2) _tasks = await loadDepartmentPending()

                setTasks(_tasks)

                return
            }
            if (active === 0) await loadAssigned()
            else if (active === 1) await loadOnGoing()
            else if (active === 2) await loadPending()
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

                {(hasPermission('102') || hasPermission('101')) && (
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
                                {userCtx.user && hasPermission('104')
                                    ? 'Assign Tasks'
                                    : 'Assigned'}
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
                        </div>

                        <div className={styles['tasks_container']}>
                            {isLoading ? (
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
                                                className={styles['task_card']}
                                            >
                                                <div className={styles['col1']}>
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
                                                            <p>
                                                                Room #
                                                                {task.room}
                                                            </p>
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
                                                                                  3 ||
                                                                              task.priority ===
                                                                                  4
                                                                            ? '#2DC044'
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
                                                >
                                                    ACTIVE
                                                </p>
                                            </Box>
                                        )} */}
                                                    </Box>

                                                    <h4>{task.issue.name}</h4>
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
                                                                <Moment fromNow>
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

                                                    {active === 1 && (
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    '12px',
                                                                color: 'var(--fc-body)',
                                                            }}
                                                        >
                                                            Start:{' '}
                                                            <Moment format="h:mm A">
                                                                {task.schedule}
                                                            </Moment>
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
                                                            Start:{' '}
                                                            <Moment format="MMM D [at] h:mma">
                                                                {task.schedule}
                                                            </Moment>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className={styles['col2']}>
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
            {hasPermission('108') && (
                <Fab
                    variant={'extended'}
                    sx={{
                        position: 'absolute',
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
