import React, { useContext, useState } from 'react'
import SwipeableCard from '../../components/SwipeableCard/SwipeableCard'

import dayjs from 'dayjs'
import useHttp from '../../hooks/http-hook'
import AuthContext from '../../context/auth-context'
import { Box } from '@mui/material'
import TextField from '../../components/TextField/TextField'
import DateSelector from '../../components/DateSelector/DateSelector'
import TimeSelector from '../../components/DateSelector/TimeSelector'
import OutlinedButton from '../../components/Button/OutlinedButton'
import combineDateTime from '../../hooks/combineDateTime'

const ProjectPendingSwipe = (props) => {
    const { isOpen, setIsOpen, project, userCtx, onRefreshData } = props

    const [startDate, setStartDate] = useState(dayjs(project.schedule))
    const [startTime, setStartTime] = useState(dayjs(project.schedule))

    const [deadlineDate, setDeadlineDate] = useState(dayjs(project.deadline))
    const [deadlineTime, setDeadlineTime] = useState(dayjs(project.deadline))

    const { sendRequest, isLoading } = useHttp()

    const toggleDrawer = (newOpen) => {
        setIsOpen(newOpen)
    }

    const handleCloseDrawer = () => {
        setIsOpen(false)
    }

    const handlePending = async () => {
        const startFormatted = combineDateTime(startDate, startTime)
        const deadlineFormatted = combineDateTime(deadlineDate, deadlineTime)

        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/projects/${
                project.id
            }`,
            body: JSON.stringify({
                schedule: startFormatted,
                deadline: deadlineFormatted,
            }),
            method: 'PATCH',
        })

        setIsOpen(false)
        onRefreshData()
    }

    return (
        <SwipeableCard
            open={isOpen}
            onOpen={toggleDrawer}
            closeDrawer={handleCloseDrawer}
            title="Pending Project"
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
                            marginTop: '12px',
                        }}
                    >
                        <DateSelector
                            currentValue={startDate}
                            handleSetValue={setStartDate}
                            defaultValue={null}
                            maxDate={deadlineDate && deadlineDate}
                            minDate={dayjs()}
                        />
                        <TimeSelector
                            currentValue={startTime}
                            handleSetValue={setStartTime}
                        />
                    </Box>
                </Box>
                <Box>
                    <h4
                        style={{
                            fontWeight: 500,
                            color: 'var(--fc-strong)',
                            marginBottom: '6px',
                        }}
                    >
                        Deadline
                    </h4>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '12px',
                            marginTop: '12px',
                        }}
                    >
                        <DateSelector
                            currentValue={deadlineDate}
                            handleSetValue={setDeadlineDate}
                            minDate={startDate}
                            defaultValue={null}
                        />
                        <TimeSelector
                            currentValue={deadlineTime}
                            handleSetValue={setDeadlineTime}
                        />
                    </Box>
                </Box>

                <OutlinedButton
                    onClick={handlePending}
                    disabled={isLoading}
                    isLoading={isLoading}
                    loadingText={'Setting new schedule'}
                >
                    Set schedule
                </OutlinedButton>
            </Box>
        </SwipeableCard>
    )
}

export default ProjectPendingSwipe
