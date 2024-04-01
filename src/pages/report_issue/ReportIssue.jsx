import React, { useContext, useEffect, useState } from 'react'
import TextField from '../../components/TextField/TextField'

import styles from './ReportIssue.module.css'
import Dropdown from '../../components/Dropdown/Dropdown'
import PrimaryButton from '../../components/Button/PrimaryButton'

import { IconButton } from '@mui/material'

import {
    IconBuilding,
    IconMessageReport,
    IconArrowNarrowLeft,
} from '@tabler/icons-react'
import DropdownSearch from '../../components/Dropdown/DropdownSearch'

import useHttp from '../../hooks/http-hook'
import useValidate from '../../hooks/validate-input-hook'
import Priorities from './Priorities'
import UploadedImages from './UploadedImages'

import AuthContext from '../../context/auth-context'
import { useNavigate } from 'react-router-dom'

const ReportIssue = () => {
    const {
        value: enteredRoom,
        isValid: enteredRoomIsValid,
        hasError: enteredRoomHasError,
        valueChangeHandler: roomChangeHandler,
        inputBlurHandler: roomBlurHandler,
        reset: roomReset,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: enteredDetails,
        isValid: enteredDetailsIsValid,
        hasError: enteredDetailsHasError,
        valueChangeHandler: detailsChangeHandler,
        inputBlurHandler: detailsBlurHandler,
        reset: detailsReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()

    const [departments, setDepartments] = useState()
    const [issues, setIssues] = useState()
    const userCtx = useContext(AuthContext)

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/departments`,
            })

            const res2 = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/issues`,
            })

            setDepartments(res.data)
            setIssues(res2.data)
        }

        loadData()
    }, [])

    const [selectedDepartment, setSelectedDepartment] = useState()
    const [selectedIssue, setSelectedIssue] = useState()
    const navigate = useNavigate()

    const handleSelectDepartment = (e) => {
        console.log(e.target.value)
        setSelectedDepartment(e.target.value)
    }
    const handleSelectIssue = (e) => {
        setSelectedIssue(e.target.value)
    }

    const [inputValue, setInputValue] = React.useState('')

    const [selectedPriority, setSelectedPriority] = useState(1)
    const [uploadedImages, setUploadedImages] = useState([])

    let formIsValid =
        enteredRoomIsValid &&
        enteredDetailsIsValid &&
        !!selectedDepartment &&
        !!selectedIssue

    const handleFileUpload = async (image, task_id, i) => {
        const formData = new FormData()

        formData.append('image', image)
        formData.append('name', `task${task_id}_${i}`)
        formData.append('task_id', task_id)

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/task_images`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            const data = await res.json()
            return data
        } catch (err) {}
    }

    const uploadImages = async (task_id) => {
        try {
            // Use Promise.all to wait for all uploads to complete
            const uploadPromises = uploadedImages.map(async (img, index) => {
                return await handleFileUpload(img, task_id, index)
            })

            const results = await Promise.all(uploadPromises)

            // Process results if needed
            console.log('Upload results:', results)

            // Continue with the rest of your code here...
        } catch (error) {
            console.error('Error uploading images:', error)
        }
    }

    const handleSubmit = async () => {
        try {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
                body: JSON.stringify({
                    room: enteredRoom,
                    issue_id: selectedIssue.id,
                    details: enteredDetails,
                    department_id: selectedDepartment,
                    requestor_id: userCtx.user.id,
                    priority: selectedPriority,
                    // schedule: '2024-03-10 15:00',
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            // console.log(res)

            uploadImages(res.id)

            navigate(`/new-issue-reported?id=${res.id}`, {
                state: {
                    id: res.id,
                    department: selectedDepartment,
                },
            })
        } catch (err) {
            console.log(err)
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
                <h3>Report an Issue</h3>
            </div>
            <TextField
                label="Room"
                placeholder="Enter the room number"
                value={enteredRoom}
                onChange={roomChangeHandler}
                onBlur={roomBlurHandler}
                helperText={enteredRoomHasError && 'Please enter the room ID.'}
                error
            />
            <Dropdown
                leadingIcon={<IconBuilding size={20} color="var(--fc-body)" />}
                label="Department"
                placeholder="Select department"
                items={departments}
                value={selectedDepartment}
                selected={selectedDepartment}
                handleSelect={handleSelectDepartment}
            />

            <DropdownSearch
                label="Issue"
                leadingIcon={
                    <IconMessageReport size={20} color="var(--fc-body)" />
                }
                value={selectedIssue}
                placeholder="Select issue"
                onValueChange={setSelectedIssue}
                onInputChange={setInputValue}
                inputValue={inputValue}
                options={issues}
            />

            <TextField
                rows={4}
                multiline
                label="Details"
                placeholder="Explain the issue here"
                fillWidth
                value={enteredDetails}
                onChange={detailsChangeHandler}
                onBlur={detailsBlurHandler}
                helperText={
                    enteredDetailsHasError && 'Please enter the details.'
                }
                error
            />
            <Priorities
                selected={selectedPriority}
                setSelected={setSelectedPriority}
            />

            <UploadedImages
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
            />

            <PrimaryButton disabled={!formIsValid} onClick={handleSubmit}>
                Submit Issue
            </PrimaryButton>
        </div>
    )
}

export default ReportIssue
