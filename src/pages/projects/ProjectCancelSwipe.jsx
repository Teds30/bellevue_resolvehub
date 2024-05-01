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
import useValidate from '../../hooks/validate-input-hook'
import PrimaryButton from '../../components/Button/PrimaryButton'

const ProjectCancelSwipe = (props) => {
    const { isOpen, setIsOpen, project, userCtx, onRefreshData } = props

    const {
        value: cancelReason,
        isValid: cancelReasonIsValid,
        hasError: cancelReasonHasError,
        valueChangeHandler: cancelReasonChangeHandler,
        inputBlurHandler: cancelReasonBlurHandler,
        reset: candelReasonReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()

    const toggleDrawer = (newOpen) => {
        setIsOpen(newOpen)
    }

    const handleCloseDrawer = () => {
        setIsOpen(false)
    }

    const handleCancel = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/projects/${
                project.id
            }`,
            body: JSON.stringify({
                status: 3,
                remarks: cancelReason,
                completed_marker_id: userCtx.user.id,
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
            title="Cancel Project"
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
                    label="Reason"
                    placeholder="Explain the reason"
                    fillWidth={true}
                    value={cancelReason}
                    onChange={cancelReasonChangeHandler}
                    onBlur={cancelReasonBlurHandler}
                    helperText={cancelReasonHasError && 'Enter the reason.'}
                    error
                />

                <PrimaryButton
                    btnType="danger"
                    onClick={handleCancel}
                    disabled={!cancelReasonIsValid}
                >
                    Cancel Project
                </PrimaryButton>
            </Box>
        </SwipeableCard>
    )
}

export default ProjectCancelSwipe
