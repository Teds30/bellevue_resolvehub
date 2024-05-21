import React, { useContext, useState } from 'react'

import styles from './Task.module.css'
import OutlinedButton from '../../components/Button/OutlinedButton'
import SwipeableCard from '../../components/SwipeableCard/SwipeableCard'
import { Box } from '@mui/material'
import TextField from '../../components/TextField/TextField'
import DateSelector from '../../components/DateSelector/DateSelector'
import TimeSelector from '../../components/DateSelector/TimeSelector'
import PrimaryButton from '../../components/Button/PrimaryButton'

import AuthContext from '../../context/auth-context'
import useHttp from '../../hooks/http-hook'
import dayjs from 'dayjs'
import useValidate from '../../hooks/validate-input-hook'

const TaskAssignSelf = (props) => {
    const { task, onRefreshData } = props

    const {
        value: cancelReason,
        isValid: cancelReasonIsValid,
        hasError: cancelReasonHasError,
        valueChangeHandler: cancelReasonChangeHandler,
        inputBlurHandler: cancelReasonBlurHandler,
        reset: candelReasonReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()
    const userCtx = useContext(AuthContext)

    const [openAssign, setOpenAssign] = useState(false)

    const toggleAssignDrawer = (newOpen) => {
        setOpenAssign(newOpen)
    }

    const handleCloseAssignDrawer = () => {
        setOpenAssign(false)
    }

    const [date, setDate] = useState(dayjs())
    const [time, setTime] = useState(dayjs())

    const handleSubmit = async () => {
        const _date = dayjs(date)
        const combinedDateTime = _date
            .hour(time.hour())
            .minute(time.minute())
            .second(time.second())
            .unix()

        const schedule = dayjs
            .unix(combinedDateTime)
            .format('YYYY-MM-DD HH:mm:ss')

        const unixTimestamp = dayjs().unix()

        // Convert the Unix timestamp to a MySQL timestamp format
        const mysqlTimestamp = dayjs
            .unix(unixTimestamp)
            .format('YYYY-MM-DD HH:mm:ss')

        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task.id}`,
            method: 'PATCH',
            body: JSON.stringify({
                assignee_id: userCtx.user.id,
                assignor_id: userCtx.user.id,
                schedule: schedule,
                assigned_timestamp: mysqlTimestamp,
            }),
        })
        handleCloseAssignDrawer()
        onRefreshData()
    }

    return (
        <div className={styles['actions_container']}>
            <OutlinedButton width="100%" onClick={toggleAssignDrawer}>
                Assign to myself
            </OutlinedButton>
            <SwipeableCard
                open={openAssign}
                onOpen={toggleAssignDrawer}
                closeDrawer={handleCloseAssignDrawer}
                title="Assign task to myself"
            >
                <Box
                    sx={{
                        padding: '24px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}
                >
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

                    <PrimaryButton
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Saving"
                    >
                        Save
                    </PrimaryButton>
                </Box>
            </SwipeableCard>
        </div>
    )
}

export default TaskAssignSelf
