import React, { useContext, useEffect, useState } from 'react'

import styles from './Task.module.css'
import { Box, IconButton } from '@mui/material'

import useHttp from '../../hooks/http-hook'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import TaskImage from './TaskImage'
import Moment from 'react-moment'

import AuthContext from '../../context/auth-context'
import {
    IconArrowNarrowLeft,
    IconBuilding,
    IconCircleCheck,
    IconCircleCheckFilled,
    IconCircleXFilled,
} from '@tabler/icons-react'
import TaskAssignee from './TaskAssignee'
import { IconArrowNarrowRight } from '@tabler/icons-react'
import OutlinedButton from '../../components/Button/OutlinedButton'
import PrimaryButton from '../../components/Button/PrimaryButton'
import SwipeableCard from '../../components/SwipeableCard/SwipeableCard'
import TaskAssignSelf from './TaskAssignSelf'
import TaskAssignor from './TaskAssignor'
import userPermission from '../../hooks/userPermission'
import { IconHourglassHigh } from '@tabler/icons-react'

const Task = () => {
    const { sendRequest } = useHttp()
    const { id } = useParams()

    const { hasPermission } = userPermission()

    const navigate = useNavigate()
    const [task, setTask] = useState()
    const [images, setImages] = useState()

    const userCtx = useContext(AuthContext)

    useEffect(() => {
        if (userCtx.user) loadData()
    }, [userCtx])

    const loadData = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`,
        })

        setTask(res.data)
    }

    const today = moment().startOf('day')
    let formattedDate

    if (task && task.schedule) {
        const momentDate = moment(task.schedule)

        if (momentDate.isSame(today, 'day')) {
            formattedDate = 'Today'
        } else if (momentDate.isSame(today.clone().subtract(1, 'day'), 'day')) {
            formattedDate = 'Yesterday'
        } else {
            // For dates beyond yesterday, use a custom format or fromNow
            formattedDate = momentDate.calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd',
                lastDay: '[Yesterday]',
                lastWeek: '[Last] dddd',
                sameElse: 'MMMM D, YYYY',
            })
        }
    }

    return (
        <div className={styles['container']}>
            <div className={styles['topnav']}>
                <IconButton
                    aria-label="delete"
                    onClick={() => {
                        navigate(-1)
                    }}
                >
                    <IconArrowNarrowLeft color="var(--fc-strong)" />
                </IconButton>
            </div>
            {task && (
                <div className={styles['rows']}>
                    <div className={styles['row1']}>
                        <div>
                            <p className="pre-title">ISSUE</p>
                            <h2
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                            >
                                {task.issue}
                                {task.status == 4 && (
                                    <span style={{ marginLeft: '4px' }}>
                                        <IconCircleCheck color="#03b077" />
                                    </span>
                                )}
                            </h2>
                        </div>
                        <div className={styles['info-container']}>
                            <div className={styles['info']}>
                                <p className="pre-title">PRIORITY</p>
                                <div className={styles['info-data']}>
                                    <div
                                        className={styles['priority-chip']}
                                        style={{
                                            backgroundColor:
                                                task.priority === 1
                                                    ? '#C0362D'
                                                    : task.priority === 2
                                                    ? '#EAAA08'
                                                    : task.priority === 3 ||
                                                      task.priority === 4
                                                    ? '#2DC044'
                                                    : '#000',
                                        }}
                                    >
                                        {task && task.priority === 1
                                            ? 'HIGH'
                                            : task.priority === 2
                                            ? 'MEDIUM'
                                            : task.priority === 3
                                            ? 'NORMAL'
                                            : task.priority === 4
                                            ? 'LOW'
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className={styles['info-line']}></div>
                            <div className={styles['info']}>
                                <p className="pre-title">AREA</p>
                                <div className={styles['info-data']}>
                                    <p>{task && task.room}</p>
                                </div>
                            </div>
                            {task && task.schedule && (
                                <div className={styles['info-line']}></div>
                            )}
                            {task && task.schedule && (
                                <div className={styles['info']}>
                                    <p className="pre-title">DEADLINE</p>

                                    <div className={styles['info-data']}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <p>{formattedDate}</p>
                                            <p>
                                                <Moment format="h:mm A">
                                                    {task.schedule}
                                                </Moment>
                                            </p>
                                        </Box>
                                    </div>
                                </div>
                            )}
                        </div>
                        <section>
                            <p className="title">Details</p>
                            <p>{task.details}</p>
                        </section>
                        <section>
                            <p className="title">Images</p>
                            <div className={styles['images-container']}>
                                {task &&
                                    task.task_images?.map((img, index) => {
                                        return (
                                            <TaskImage
                                                key={index}
                                                img_url={img.url}
                                            />
                                        )
                                    })}
                            </div>
                        </section>
                        {task && (
                            <>
                                <p className="title">
                                    Requestor{'  '}
                                    <span
                                        style={{
                                            marginLeft: '4px',
                                            fontWeight: '400',
                                            fontSize: '12px',
                                            color: 'var(--fc-body-light)',
                                        }}
                                    >
                                        • {'  '}{' '}
                                        <Moment fromNow>
                                            {task.created_at}
                                        </Moment>
                                    </span>
                                </p>
                                <div className={styles['requestor_container']}>
                                    <div className={styles['person-container']}>
                                        <div className={styles['avatar']}>
                                            <img src="" alt="" />
                                        </div>
                                        <div className={styles['person']}>
                                            <p className="title">
                                                {`${task.requestor.first_name} ${task.requestor.last_name}`}
                                            </p>
                                            <p className="smaller-text">
                                                {
                                                    task.requestor.position
                                                        .department.name
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <IconArrowNarrowRight />
                                    <div className={styles['to_department']}>
                                        <IconBuilding size={18} />
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                color: 'var(--fc-body)',
                                                fontSize: '1em',
                                            }}
                                        >
                                            {task.department.name}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {
                            //TODO: PERMISSION change to dynamic
                        }
                        {task &&
                            userCtx.user &&
                            task.assignee_id === null &&
                            hasPermission('103') && (
                                <TaskAssignSelf
                                    task={task}
                                    onRefreshData={loadData}
                                />
                            )}

                        {
                            //TODO: PERMISSION change to dynamic
                        }
                        {task &&
                            userCtx.user &&
                            hasPermission('104') &&
                            task.status !== 4 && (
                                <div className={styles['row2']}>
                                    <TaskAssignor
                                        task={task}
                                        onRefreshData={loadData}
                                    />
                                </div>
                            )}
                    </div>

                    <div className={styles['row2']}>
                        {task &&
                            userCtx.user &&
                            task.assignee_id === userCtx.user.id && (
                                <TaskAssignee
                                    onRefreshData={loadData}
                                    task={task}
                                />
                            )}
                        {task && task.pending_reason && (
                            <div className={styles['marked-done-container']}>
                                <div
                                    className={
                                        styles['marked-done-title-pending']
                                    }
                                >
                                    <IconHourglassHigh
                                        style={{
                                            color: 'var(--fc-body)',
                                        }}
                                    />
                                    <p>
                                        <strong>Pending </strong> by{' '}
                                        {task.pending_marker.first_name}{' '}
                                        {task.pending_marker.last_name}.
                                    </p>
                                </div>
                                <div className={styles['marked-done-details']}>
                                    <p className="title">Reason</p>
                                    <div className={styles['done-content']}>
                                        <div className={styles['border']}></div>
                                        <p>{task.pending_reason}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {task && task.status === 4 ? (
                            <div className={styles['marked-done-container']}>
                                <Box>
                                    <div
                                        className={styles['marked-done-title']}
                                    >
                                        <IconCircleCheckFilled
                                            style={{ color: '#03b077' }}
                                        />
                                        <Box>
                                            <p>
                                                This task has been marked as{' '}
                                                <strong>Done</strong> by{' '}
                                                {
                                                    task.completed_marker
                                                        .first_name
                                                }{' '}
                                                {
                                                    task.completed_marker
                                                        .last_name
                                                }
                                                .
                                            </p>
                                            <p className="smaller-text">
                                                <Moment format="MMMM DD, YYYY [at] h:m A">
                                                    {task.updated_at}
                                                </Moment>
                                            </p>
                                        </Box>
                                    </div>
                                </Box>

                                <div className={styles['marked-done-details']}>
                                    <p className="title">Action taken</p>
                                    <div className={styles['done-content']}>
                                        <div className={styles['border']}></div>
                                        <p>{task.action_taken}</p>
                                    </div>
                                </div>
                                <div className={styles['marked-done-details']}>
                                    <p className="title">Remarks</p>
                                    <div className={styles['done-content']}>
                                        <div className={styles['border']}></div>
                                        <p>{task.remarks}</p>
                                    </div>
                                </div>
                            </div>
                        ) : task.status === 3 ? (
                            <div className={styles['marked-done-container']}>
                                <div
                                    className={
                                        styles['marked-done-title-cancelled']
                                    }
                                >
                                    <IconCircleXFilled
                                        style={{
                                            color: 'var(--accent-danger)',
                                        }}
                                    />
                                    <p>
                                        This task has been{' '}
                                        <strong>Cancelled</strong> by{' '}
                                        {task.completed_marker.first_name}{' '}
                                        {task.completed_marker.last_name}.
                                    </p>
                                </div>
                                <div className={styles['marked-done-details']}>
                                    <p className="title">Reason</p>
                                    <div className={styles['done-content']}>
                                        <div className={styles['border']}></div>
                                        <p>{task.remarks}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Task
