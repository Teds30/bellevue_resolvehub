import React, { useContext, useEffect, useRef, useState } from 'react'
import TextField from '../../components/TextField/TextField'
import Dropdown from '../../components/Dropdown/Dropdown'
import {
    IconArrowNarrowLeft,
    IconBuilding,
    IconMessageReport,
    IconUser,
} from '@tabler/icons-react'
import DropdownSearch from '../../components/Dropdown/DropdownSearch'
import PrimaryButton from '../../components/Button/PrimaryButton'

import styles from './CreateProject.module.css'
import { Box, IconButton } from '@mui/material'
import useValidate from '../../hooks/validate-input-hook'

import AuthContext from '../../context/auth-context'

import useHttp from '../../hooks/http-hook'
import DateSelector from '../../components/DateSelector/DateSelector'
import TimeSelector from '../../components/DateSelector/TimeSelector'
import dayjs from 'dayjs'
import combineDateTime from '../../hooks/combineDateTime'
import { useNavigate } from 'react-router-dom'
import userPermission from '../../hooks/userPermission'

const CreateProject = () => {
    const {
        value: enteredTitle,
        isValid: enteredTitleIsValid,
        hasError: enteredTitleHasError,
        valueChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler,
        reset: titleReset,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: enteredLocation,
        isValid: enteredLocationIsValid,
        hasError: enteredLocationHasError,
        valueChangeHandler: locationChangeHandler,
        inputBlurHandler: locationBlurHandler,
        reset: locationReset,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: enteredDetails,
        isValid: enteredDetailsIsValid,
        hasError: enteredDetailsHasError,
        valueChangeHandler: detailsChangeHandler,
        inputBlurHandler: detailsBlurHandler,
        reset: detailsReset,
    } = useValidate((value) => value.trim() !== '')

    const [departments, setDepartments] = useState()
    const [issues, setIssues] = useState()
    const userCtx = useContext(AuthContext)
    const { sendRequest } = useHttp()

    const [people, setPeople] = useState([])
    const [selectedPerson, setPerson] = useState()

    const [inputValue, setInputValue] = useState()

    const [startDate, setStartDate] = useState()
    const [startTime, setStartTime] = useState()

    const [deadlineDate, setDeadlineDate] = useState()
    const [deadlineTime, setDeadlineTime] = useState()

    const { hasPermission } = userPermission()

    const navigate = useNavigate()

    const isMajorRef = useRef(null)

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/departments`,
            })
            setDepartments(res.data)
        }

        loadData()
    }, [])

    const [selectedDepartment, setSelectedDepartment] = useState()

    const handleSelectDepartment = (e) => {
        console.log(e.target.value)
        setSelectedDepartment(e.target.value)
    }

    useEffect(() => {
        loadPeople()
    }, [selectedDepartment])

    const loadPeople = async () => {
        try {
            setPerson()
            setPeople([])
            setInputValue('')
            const res = await sendRequest({
                url: `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/department_employees/${selectedDepartment}`,
            })

            let modified = []
            res.data?.map((p) => {
                modified = [
                    ...modified,
                    {
                        id: p.id,
                        name: `${p.first_name} ${p.last_name}`,
                        position: p.position.name,
                    },
                ]
            })

            setPeople(modified)
        } catch (err) {}
    }

    const handleCheckboxChange = () => {
        const isChecked = isMajorRef.current.checked
        // console.log('Checkbox value:', isChecked)
    }

    // console.log(isMajorRef.current.value)

    let formIsValid =
        enteredTitleIsValid &&
        enteredLocationIsValid &&
        enteredDetailsIsValid &&
        !!selectedDepartment &&
        !!selectedPerson &&
        startDate &&
        startTime &&
        deadlineDate &&
        deadlineTime

    const handleSubmit = async () => {
        try {
            const startFormatted = combineDateTime(startDate, startTime)
            const deadlineFormatted = combineDateTime(
                deadlineDate,
                deadlineTime
            )

            // console.log({
            //     title: enteredTitle,
            //     location: enteredLocation,
            //     details: enteredDetails,
            //     schedule: startFormatted,
            //     deadline: deadlineFormatted,
            //     type: isMajorRef.current.checked ? 1 : 0,
            //     requestor_id: userCtx.user.id,
            //     department_id: selectedDepartment,
            //     incharge_id: selectedPerson.id,
            // })
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/projects`,
                body: JSON.stringify({
                    title: enteredTitle,
                    location: enteredLocation,
                    details: enteredDetails,
                    schedule: startFormatted,
                    deadline: deadlineFormatted,
                    type: isMajorRef.current.checked ? 1 : 0,
                    requestor_id: userCtx.user.id,
                    department_id: selectedDepartment,
                    incharge_id: selectedPerson.id,

                    // TODO: PERMISSION change to dynamic
                    // bypass pending
                    //status: {has_access} ? 2 : 0
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            navigate(`/new-project-submitted?id=${res.id}`, {
                state: {
                    id: res.id,
                    title: enteredTitle,
                },
            })
        } catch (err) {
            console.log('false ', err)
        }
    }

    return (
        <div className={styles['container']}>
            <div className={styles['topnav']}>
                <IconButton aria-label="delete">
                    <IconArrowNarrowLeft color="var(--fc-strong)" />
                </IconButton>
                <h3>Create a project</h3>
            </div>
            <input
                type="checkbox"
                ref={isMajorRef}
                id="toggle"
                onChange={handleCheckboxChange}
                disabled={!hasPermission('206')}
                class={styles['toggleCheckbox']}
            />
            <label for="toggle" class={styles['toggleContainer']}>
                <div>Minor</div>
                <div>Major</div>
            </label>
            <TextField
                label="Project Title"
                placeholder="Enter the title"
                value={enteredTitle}
                onChange={titleChangeHandler}
                onBlur={titleBlurHandler}
                helperText={enteredTitleHasError && 'This field is required.'}
                error
            />
            <TextField
                label="Project Location"
                placeholder="Enter the location"
                value={enteredLocation}
                onChange={locationChangeHandler}
                onBlur={locationBlurHandler}
                helperText={
                    enteredLocationHasError && 'This field is required.'
                }
                error
            />

            <TextField
                rows={4}
                multiline
                label="Details"
                placeholder="What is the project about"
                fillWidth
                value={enteredDetails}
                onChange={detailsChangeHandler}
                onBlur={detailsBlurHandler}
                helperText={
                    enteredDetailsHasError && 'Please enter the details.'
                }
                error
            />
            <Dropdown
                leadingIcon={<IconBuilding size={20} color="var(--fc-body)" />}
                label="Lead Department"
                placeholder="Select department"
                items={departments}
                value={selectedDepartment}
                selected={selectedDepartment}
                handleSelect={handleSelectDepartment}
            />

            <DropdownSearch
                label={`Personnel In-Charge`}
                leadingIcon={<IconUser size={20} color="var(--fc-body)" />}
                value={selectedPerson}
                placeholder="Select the person in-charge"
                onValueChange={setPerson}
                onInputChange={setInputValue}
                inputValue={inputValue}
                options={people}
                isPerson={true}
                disabled={!selectedDepartment}
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
                        marginTop: '12px',
                    }}
                >
                    <DateSelector
                        currentValue={startDate}
                        handleSetValue={setStartDate}
                        defaultValue={null}
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
                        defaultValue={null}
                    />
                    <TimeSelector
                        currentValue={deadlineTime}
                        handleSetValue={setDeadlineTime}
                    />
                </Box>
            </Box>

            <PrimaryButton disabled={!formIsValid} onClick={handleSubmit}>
                Create Project
            </PrimaryButton>
        </div>
    )
}

export default CreateProject
