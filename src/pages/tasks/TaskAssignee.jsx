import React, { useContext, useEffect, useState } from 'react'

import styles from './Task.module.css'
import Moment from 'react-moment'
import {
    IconArrowNarrowLeft,
    IconArrowNarrowRight,
    IconBuilding,
    IconCircleCheckFilled,
    IconCircleXFilled,
} from '@tabler/icons-react'
import SwipeableCard from '../../components/SwipeableCard/SwipeableCard'
import PrimaryButton from '../../components/Button/PrimaryButton'
import OutlinedButton from '../../components/Button/OutlinedButton'

import useHttp from '../../hooks/http-hook'
import { Box, IconButton } from '@mui/material'
import TextField from '../../components/TextField/TextField'
import useValidate from '../../hooks/validate-input-hook'
import DatePicker from '../../components/DateSelector/DateSelector'
import DateSelector from '../../components/DateSelector/DateSelector'
import TimeSelector from '../../components/DateSelector/TimeSelector'
import dayjs from 'dayjs'

import AuthContext from '../../context/auth-context'
import { IconSquareRoundedCheckFilled } from '@tabler/icons-react'
import userPermission from '../../hooks/userPermission'

const TaskAssignee = (props) => {
    const { task, onRefreshData } = props

    const {
        value: pendingReason,
        isValid: pendingReasonIsValid,
        hasError: pendingReasonHasError,
        valueChangeHandler: pendingReasonChangeHandler,
        inputBlurHandler: pendingReasonBlurHandler,
        reset: pendingReasonReset,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: cancelReason,
        isValid: cancelReasonIsValid,
        hasError: cancelReasonHasError,
        valueChangeHandler: cancelReasonChangeHandler,
        inputBlurHandler: cancelReasonBlurHandler,
        reset: candelReasonReset,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: actionTaken,
        isValid: actionTakenIsValid,
        hasError: actionTakenHasError,
        valueChangeHandler: actionTakenChangeHandler,
        inputBlurHandler: actionTakenBlurHandler,
        reset: actionTakenReset,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: remarks,
        isValid: remarksIsValid,
        hasError: remarksHasError,
        valueChangeHandler: remarksChangeHandler,
        inputBlurHandler: remarksBlurHandler,
        reset: remarksReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()
    const userCtx = useContext(AuthContext)

    const { hasPermission } = userPermission()

    const [openPending, setOpenPending] = useState()
    const [openCancel, setOpenCancel] = useState()
    const [openSubmit, setOpenSubmit] = useState()

    const [date, setDate] = useState(dayjs())
    const [time, setTime] = useState(dayjs())

    const togglePendingDrawer = (newOpen) => {
        setOpenPending(newOpen)
    }
    const toggleCancelDrawer = (newOpen) => {
        setOpenCancel(newOpen)
    }
    const toggleSubmitDrawer = (newOpen) => {
        setOpenSubmit(newOpen)
    }

    const handleClosePendingDrawer = () => {
        setOpenPending(false)
    }
    const handleCloseCancelDrawer = () => {
        setOpenCancel(false)
    }
    const handleCloseSubmitDrawer = () => {
        setOpenSubmit(false)
    }

    const handleAccept = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task.id}`,
            method: 'PATCH',
            body: JSON.stringify({
                status: 1,
            }),
        })

        onRefreshData()
    }

    const handleDone = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task.id}`,
            method: 'PATCH',
            body: JSON.stringify({
                status: 4,
                remarks: remarks,
                action_taken: actionTaken,
                completed_marker_id: userCtx.user.id,
            }),
        })

        onRefreshData()
        handleCloseSubmitDrawer()
    }

    const handlePending = async () => {
        const _date = dayjs(date)
        const combinedDateTime = _date
            .hour(time.hour())
            .minute(time.minute())
            .second(time.second())
            .unix()

        const mysqlTimestamp = dayjs
            .unix(combinedDateTime)
            .format('YYYY-MM-DD HH:mm:ss')

        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task.id}`,
            method: 'PATCH',
            body: JSON.stringify({
                status: 2,
                pending_marker_id: userCtx.user.id,
                pending_reason: pendingReason,
                schedule: mysqlTimestamp,
            }),
        })

        onRefreshData()
        handleClosePendingDrawer()
    }

    const handleCancel = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task.id}`,
            method: 'PATCH',
            body: JSON.stringify({
                status: 3,
                remarks: cancelReason,
                completed_marker_id: userCtx.user.id,
            }),
        })

        onRefreshData()
        handleCloseCancelDrawer()
    }

    useEffect(() => {
        const changeDate = () => {
            setDate(dayjs(task.schedule))
            setTime(dayjs(task.schedule))
        }
        changeDate()
    }, [])

    return (
        <section>
            {task && (
                <div className={styles['history-container']}>
                    {task.assignee_id === null &&
                        task.requestor_id === userCtx.user.id && (
                            <Box>
                                <p style={{ marginBottom: '8px' }}>
                                    No one was assigned to this task yet.
                                </p>
                                {task.completed_marker_id === null && (
                                    <OutlinedButton
                                        btnType="danger"
                                        onClick={toggleCancelDrawer}
                                        width="100%"
                                        // isLoading={isLoading}
                                        loadingText="Cancelling"
                                    >
                                        Cancel
                                    </OutlinedButton>
                                )}
                            </Box>
                        )}
                    {task.assignee && (
                        <>
                            {task.assignee_id === userCtx.user.id ? (
                                <p>
                                    <span className="title">You </span> were
                                    assigned by
                                </p>
                            ) : (
                                <p>
                                    <span className="title">
                                        {`${task.assignee.first_name} ${task.assignee.last_name}`}{' '}
                                    </span>{' '}
                                    was assigned by
                                </p>
                            )}

                            <div className={styles['person-container']}>
                                <div className={styles['avatar']}>
                                    <img src="" alt="" />
                                </div>
                                <div className={styles['person']}>
                                    <p className="title">
                                        {`${task.assignor.first_name} ${task.assignor.last_name}`}
                                    </p>
                                    <p className="smaller-text">
                                        {task.assignor.position.department.name}
                                    </p>
                                </div>
                            </div>

                            <p
                                style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: 'var(--fc-body-light',
                                }}
                            >
                                {task.assigned_timestamp && (
                                    <Moment fromNow>
                                        {task.assigned_timestamp}
                                    </Moment>
                                )}
                            </p>
                        </>
                    )}

                    {task.assignee_id === userCtx.user.id &&
                    task.status === 0 ? (
                        <div className={styles['actions_container']}>
                            {hasPermission('107') && (
                                <OutlinedButton
                                    btnType="danger"
                                    onClick={toggleCancelDrawer}
                                    // isLoading={isLoading}
                                    loadingText="Cancelling"
                                >
                                    Cancel
                                </OutlinedButton>
                            )}
                            {hasPermission('105') && (
                                <PrimaryButton
                                    width="100%"
                                    onClick={handleAccept}
                                    isLoading={isLoading}
                                    loadingText="Accepting"
                                >
                                    Accept
                                </PrimaryButton>
                            )}
                        </div>
                    ) : task.status === 1 || task.status === 2 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '12px',
                                flexDirection: 'column',
                                marginTop: '16px',
                            }}
                        >
                            <PrimaryButton
                                width="100%"
                                onClick={toggleSubmitDrawer}
                                isLoading={isLoading}
                                loadingText="Accomplishing"
                            >
                                Accomplish
                            </PrimaryButton>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '12px',
                                }}
                            >
                                {hasPermission('107') && (
                                    <OutlinedButton
                                        btnType="danger"
                                        width="100%"
                                        onClick={toggleCancelDrawer}
                                        // isLoading={isLoading}
                                        loadingText="Cancelling"
                                    >
                                        Cancel
                                    </OutlinedButton>
                                )}
                                {hasPermission('106') && (
                                    <OutlinedButton
                                        width="100%"
                                        onClick={togglePendingDrawer}
                                        isLoading={isLoading}
                                        // loadingText="Pending"
                                    >
                                        Pending
                                    </OutlinedButton>
                                )}
                            </Box>
                        </Box>
                    ) : (
                        ''
                    )}
                </div>
            )}

            <SwipeableCard
                open={openPending}
                onOpen={togglePendingDrawer}
                closeDrawer={handleClosePendingDrawer}
                title="Pending Task"
            >
                <Box
                    sx={{
                        padding: '24px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}
                >
                    <TextField
                        rows={4}
                        multiline
                        label="Details"
                        placeholder="Explain the reason"
                        fillWidth={true}
                        value={pendingReason}
                        onChange={pendingReasonChangeHandler}
                        onBlur={pendingReasonBlurHandler}
                        helperText={
                            pendingReasonHasError && 'Enter the reason.'
                        }
                        error
                    />
                    <Box>
                        <h4
                            style={{
                                fontWeight: 500,
                                color: 'var(--fc-strong)',
                                marginBottom: '6px',
                            }}
                        >
                            Schedule
                        </h4>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '12px',
                                marginTop: '24px',
                            }}
                        >
                            <DateSelector
                                currentValue={date}
                                handleSetValue={setDate}
                                minDate={dayjs()}
                            />
                            <TimeSelector
                                currentValue={time}
                                handleSetValue={setTime}
                            />
                        </Box>
                    </Box>

                    <OutlinedButton
                        onClick={handlePending}
                        disabled={!pendingReasonIsValid}
                        isLoading={isLoading}
                        loadingText="Pending"
                    >
                        Mark Pending
                    </OutlinedButton>
                </Box>
            </SwipeableCard>
            {/*



*/}
            <SwipeableCard
                open={openCancel}
                onOpen={toggleCancelDrawer}
                closeDrawer={handleCloseCancelDrawer}
                title="Task Cancellation"
            >
                <Box
                    sx={{
                        padding: '24px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}
                >
                    <TextField
                        rows={4}
                        multiline
                        label="Details"
                        placeholder="Explain the reason"
                        fillWidth={true}
                        value={cancelReason}
                        onChange={cancelReasonChangeHandler}
                        onBlur={cancelReasonBlurHandler}
                        helperText={cancelReasonHasError && 'Enter the reason.'}
                        error
                    />

                    <OutlinedButton
                        btnType="danger"
                        onClick={handleCancel}
                        disabled={!cancelReasonIsValid}
                        isLoading={isLoading}
                        loadingText="Cancelling Task"
                    >
                        Cancel Task
                    </OutlinedButton>
                </Box>
            </SwipeableCard>
            {/*



*/}
            <SwipeableCard
                open={openSubmit}
                onOpen={toggleSubmitDrawer}
                closeDrawer={handleCloseSubmitDrawer}
                title="Task Completion"
            >
                <Box
                    sx={{
                        padding: '24px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}
                >
                    <TextField
                        rows={4}
                        multiline
                        label="Action taken"
                        placeholder="Describe the steps taken"
                        fillWidth={true}
                        value={actionTaken}
                        onChange={actionTakenChangeHandler}
                        onBlur={actionTakenBlurHandler}
                        helperText={
                            actionTakenHasError && 'Enter the action taken.'
                        }
                        error
                    />
                    <TextField
                        rows={4}
                        multiline
                        label="Remarks"
                        placeholder="Add your comments here"
                        fillWidth={true}
                        value={remarks}
                        onChange={remarksChangeHandler}
                        onBlur={remarksBlurHandler}
                        helperText={remarksHasError && 'Enter the remarks.'}
                        error
                    />

                    <PrimaryButton
                        onClick={handleDone}
                        disabled={!remarksIsValid || !actionTakenIsValid}
                        isLoading={isLoading}
                        loadingText="Accomplishing"
                    >
                        Accomplish
                    </PrimaryButton>
                </Box>
            </SwipeableCard>
        </section>
    )
}

export default TaskAssignee
