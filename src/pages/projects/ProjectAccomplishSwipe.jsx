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

const ProjectAccomplishSwipe = (props) => {
    const { isOpen, setIsOpen, project, userCtx, onRefreshData } = props

    const {
        value: remarks,
        isValid: remarksIsValid,
        hasError: remarksHasError,
        valueChangeHandler: remarksChangeHandler,
        inputBlurHandler: remarksBlurHandler,
        reset: remarksReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()

    const toggleDrawer = (newOpen) => {
        setIsOpen(newOpen)
    }

    const handleCloseDrawer = () => {
        setIsOpen(false)
    }

    const handleDone = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/projects/${
                project.id
            }`,
            body: JSON.stringify({
                status: 4,
                remarks: remarks,
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
            title="Accomplish Project"
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
                    disabled={!remarksIsValid}
                    isLoading={isLoading}
                    loadingText="Submitting"
                >
                    Submit
                </PrimaryButton>
            </Box>
        </SwipeableCard>
    )
}

export default ProjectAccomplishSwipe
