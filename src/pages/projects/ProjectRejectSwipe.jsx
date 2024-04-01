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

const ProjectRejectSwipe = (props) => {
    const { isOpen, setIsOpen, project, userCtx, onRefreshData } = props

    const {
        value: rejectReason,
        isValid: rejectReasonIsValid,
        hasError: rejectReasonHasError,
        valueChangeHandler: rejectReasonChangeHandler,
        inputBlurHandler: rejectReasonBlurHandler,
        reset: rejectReasonReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()

    const toggleDrawer = (newOpen) => {
        setIsOpen(newOpen)
    }

    const handleCloseDrawer = () => {
        setIsOpen(false)
    }

    const handleReject = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/projects/${
                project.id
            }`,
            body: JSON.stringify({
                status: 5,
                remarks: rejectReason,
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
            title="Reject Project"
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
                    value={rejectReason}
                    onChange={rejectReasonChangeHandler}
                    onBlur={rejectReasonBlurHandler}
                    helperText={rejectReasonHasError && 'Enter the reason.'}
                    error
                />

                <PrimaryButton
                    btnType="danger"
                    onClick={handleReject}
                    disabled={!rejectReasonIsValid}
                >
                    Reject Project
                </PrimaryButton>
            </Box>
        </SwipeableCard>
    )
}

export default ProjectRejectSwipe
