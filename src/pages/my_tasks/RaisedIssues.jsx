import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/auth-context'
import useHttp from '../../hooks/http-hook'
import { Box, IconButton } from '@mui/material'
import moment from 'moment'

import styles from './MyTasks.module.css'
import { Link } from 'react-router-dom'
import { IconMapPin } from '@tabler/icons-react'
import { IconChevronRight } from '@tabler/icons-react'
import Moment from 'react-moment'

const RaisedIssues = (props) => {
    const { params } = props
    const [tasks, setTasks] = useState([])

    const userCtx = useContext(AuthContext)

    const { sendRequest, isLoading } = useHttp()
    const [day, setDay] = useState('weekly')

    useEffect(() => {
        const loadData = async () => {
            setTasks()
            const res = await sendRequest({
                url: `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/user_raised_issues/${userCtx.user.id}${params}`,
            })

            const { data } = res

            const formattedData = []

            // Iterate over each date in the data object
            for (const date in data) {
                if (data.hasOwnProperty(date)) {
                    const tasks = data[date]
                    const formattedTasks = []

                    formattedData.push({
                        date: date,
                        tasks: tasks,
                    })
                }
            }

            // console.log(formattedData)
            setTasks(formattedData)
        }

        if (userCtx.user) loadData()
    }, [userCtx, params])
    return (
        <div>
            {tasks && tasks.length > 0 && !isLoading ? (
                tasks?.map((date, index) => {
                    let label
                    const dateMoment = moment(date.date)
                    if (dateMoment.isSame(moment(), 'day')) {
                        label = 'Today'
                    } else if (
                        dateMoment.isSame(moment().subtract(1, 'days'), 'day')
                    ) {
                        label = 'Yesterday'
                    } else {
                        label = dateMoment.format('MMM D')
                    }

                    return (
                        <Box
                            key={index}
                            sx={{
                                marginBottom: '32px',
                            }}
                        >
                            <h3
                                style={{
                                    textAlign: 'center',
                                    marginBottom: '18px',
                                }}
                            >
                                {label}
                            </h3>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    gap: '24px',
                                    width: '100%',
                                }}
                            >
                                {date.tasks?.map((task, index) => {
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
                                                    </Box>

                                                    <h4>{task.issue}</h4>

                                                    <>
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
                })
            ) : (
                <p>There are currently no forwarded issues.</p>
            )}
        </div>
    )
}

export default RaisedIssues
