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

const PriorityTask = (props) => {
    const { items, priority, active } = props

    const userCtx = useContext(AuthContext)

    const [filtered, setFiltered] = useState([])
    const [label, setLabel] = useState('')
    const [low, setLow] = useState([])
    const [normal, setNormal] = useState([])
    const [medium, setMedium] = useState([])
    const [high, setHigh] = useState([])

    useEffect(() => {
        const filterItems = () => {
            let toFilter
            if (priority === 'low') {
                toFilter = items.filter((item) => {
                    return item.priority === 4
                })
                setLabel('Low')
            } else if (priority === 'normal') {
                toFilter = items.filter((item) => {
                    return item.priority === 3
                })
                setLabel('Normal')
            } else if (priority === 'medium') {
                toFilter = items.filter((item) => {
                    return item.priority === 2
                })
                setLabel('Medium')
            }
            if (priority === 'high') {
                toFilter = items.filter((item) => {
                    return item.priority === 1
                })
                setLabel('High')
            }

            setFiltered(toFilter)

            console.log('filterd: ', toFilter)
        }

        filterItems()
    }, [items])

    return (
        filtered &&
        filtered.length > 0 && (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <Box
                        sx={{
                            width: '100px',
                            height: '1px',
                            backgroundColor: '#ccc',
                        }}
                    ></Box>
                    <Box
                        sx={{
                            // backgroundColor: 'var(--bg-layer2)',
                            // padding: '4px 6px',
                            // borderRadius: '4px',
                            // fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <h3>{label}</h3>

                        <Box
                            sx={{
                                backgroundColor: 'var(--bg-layer2)',
                                padding: '4px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                            }}
                        >
                            {filtered.length}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: '100px',
                            height: '1px',
                            backgroundColor: '#ccc',
                        }}
                    ></Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '24px',
                        width: '100%',
                    }}
                >
                    {filtered?.map((task, index) => {
                        return (
                            <Link
                                className={'card-link'}
                                key={index}
                                to={`/tasks/${task.id}`}
                            >
                                <div className={styles['task_card']}>
                                    <div className={styles['col1']}>
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
                                            <div
                                                className={styles['room_chip']}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                        }}
                                                    >
                                                        <IconMapPin size={12} />
                                                    </Box>{' '}
                                                    {task.room}
                                                </Box>
                                                <span
                                                    className={
                                                        styles['priority-chip']
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            task.priority === 1
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
                                                    {task.priority === 1
                                                        ? 'HIGH'
                                                        : task.priority === 2
                                                        ? 'MEDIUM'
                                                        : task.priority === 3
                                                        ? 'NORMAL'
                                                        : task.priority === 4
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
                                                        fontSize: '12px',
                                                        color: 'var(--fc-body)',
                                                    }}
                                                >
                                                    by{' '}
                                                    <strong>{`${task.requestor.first_name} ${task.requestor.last_name}`}</strong>
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: '12px',
                                                        color: 'var(--fc-body)',
                                                    }}
                                                >
                                                    {' '}
                                                    <Moment fromNow>
                                                        {task.created_at}
                                                    </Moment>
                                                </p>
                                            </>
                                        )}

                                        {
                                            //TODO: PERMISSION: change to dynamic
                                            active === 1 &&
                                                task.assignee_id &&
                                                userCtx.user.position_id ===
                                                    3 && (
                                                    <p
                                                        style={{
                                                            fontSize: '12px',
                                                            color: 'var(--fc-body)',
                                                        }}
                                                    >
                                                        Assignee:{' '}
                                                        <strong>{`${task.assignee.first_name} ${task.assignee.last_name}`}</strong>
                                                    </p>
                                                )
                                        }
                                        {(active === 1 || active === 2) &&
                                            task.assignee_id &&
                                            task.assignee_id !==
                                                userCtx.user.id && (
                                                <p
                                                    style={{
                                                        fontSize: '12px',
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
                                                    fontSize: '12px',
                                                    color: 'var(--fc-body)',
                                                }}
                                            >
                                                {dayjs().isAfter(
                                                    dayjs(task.schedule)
                                                ) ? (
                                                    'OVERDUE'
                                                ) : (
                                                    <span>
                                                        {' '}
                                                        Accomplish before:{' '}
                                                        <Moment
                                                            format="h:mma"
                                                            style={{
                                                                color: 'var(--accent)',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {task.schedule}
                                                        </Moment>
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                        {active === 2 &&
                                            task.assignee_id &&
                                            userCtx.user.position_id === 3 && (
                                                <>
                                                    <p
                                                        style={{
                                                            fontSize: '12px',
                                                            color: 'var(--fc-body)',
                                                        }}
                                                    >
                                                        Assignee:{' '}
                                                        {
                                                            task.assignee
                                                                .first_name
                                                        }{' '}
                                                        {
                                                            task.assignee
                                                                .last_name
                                                        }
                                                    </p>
                                                </>
                                            )}

                                        {active === 2 && (
                                            <p
                                                style={{
                                                    fontSize: '12px',
                                                    color: 'var(--fc-body)',
                                                }}
                                            >
                                                Accomplish before:{' '}
                                                <Moment format="MMM D [at] h:mma">
                                                    {task.schedule}
                                                </Moment>
                                            </p>
                                        )}
                                        {active === 3 && (
                                            <p
                                                style={{
                                                    fontSize: '12px',
                                                    color: 'var(--fc-body)',
                                                }}
                                            >
                                                Accomplished on:{' '}
                                                <Moment format="MMM D [at] h:mma">
                                                    {task.updated_at}
                                                </Moment>
                                            </p>
                                        )}
                                        {active === 4 && (
                                            <p
                                                style={{
                                                    fontSize: '12px',
                                                    color: 'var(--accent-danger)',
                                                }}
                                            >
                                                Cancelled on:{' '}
                                                <Moment format="MMM D [at] h:mma">
                                                    {task.updated_at}
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
                    })}
                </Box>
            </Box>
        )
    )
}

export default PriorityTask
