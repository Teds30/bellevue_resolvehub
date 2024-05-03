import { Backdrop, Box, Checkbox, FormControlLabel } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useValidate from '../../hooks/validate-input-hook'
import Modal from '../../components/Modal/Modal'
import TextField from '../../components/TextField/TextField'
import Dropdown from '../../components/Dropdown/Dropdown'
import { IconBuilding } from '@tabler/icons-react'
import useHttp from '../../hooks/http-hook'
import PrimaryButton from '../../components/Button/PrimaryButton'
import OutlinedButton from '../../components/Button/OutlinedButton'

const EditPerson = (props) => {
    const { open, handleClose, person, loadData, department_id } = props

    const {
        value: enteredFirstName,
        isValid: enteredFirstNameIsValid,
        hasError: enteredFirstNameHasError,
        valueChangeHandler: firstNameChangeHandler,
        inputBlurHandler: firstNameBlurHandler,
        reset: firstNameReset,
        defaultValueHandler: firstNameDefaultValue,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: enteredLastName,
        isValid: enteredLastNameIsValid,
        hasError: enteredLastNameHasError,
        valueChangeHandler: lastNameChangeHandler,
        inputBlurHandler: lastNameBlurHandler,
        reset: lastNameReset,
        defaultValueHandler: lastNameDefaultValue,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: enteredUsername,
        isValid: enteredUsernameIsValid,
        hasError: enteredUsernameHasError,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        reset: usernameReset,
        defaultValueHandler: usernameDefaultValue,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: enteredPassword,
        isValid: enteredPasswordIsValid,
        hasError: enteredPasswordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: passwordReset,
        defaultValueHandler: passwordDefaultValue,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: enteredNumber,
        isValid: enteredNumberIsValid,
        hasError: enteredNumberHasError,
        valueChangeHandler: numberChangeHandler,
        inputBlurHandler: numberBlurHandler,
        reset: numberReset,
        defaultValueHandler: numberDefaultValue,
    } = useValidate((value) => value.trim() !== '')

    const [positions, setPositions] = useState()
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState()

    const [isChangePass, setIsChangePass] = useState(false)

    const { sendRequest, isLoading } = useHttp()

    const handleSelectPosition = (e) => {
        setSelectedPosition(e.target.value)
    }

    useEffect(() => {
        loadPositions()
    }, [])

    // useEffect(() => {
    //     const changeDefault = () => {
    //         setSelectedPosition(person.position.id)
    //         console.log(person.position.id)
    //     }
    //     changeDefault()
    // }, [positions])

    useEffect(() => {
        firstNameDefaultValue(person.first_name)
        lastNameDefaultValue(person.last_name)
        numberDefaultValue(person.phone_number ?? '')
        usernameDefaultValue(person.username)
        setSelectedPosition(person.position.id)
        // passwordDefaultValue()
    }, [person])

    const loadPositions = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_positions/${department_id}`,
        })

        setPositions(res.data)
    }

    const handleCheck = (event) => {
        if (event.target.checked) {
            setIsChangePass(true)
            return
        }

        setIsChangePass(false)
    }

    let formIsValid =
        enteredFirstNameIsValid &&
        enteredLastNameIsValid &&
        // enteredNumberIsValid &&
        enteredUsernameIsValid &&
        !!selectedPosition

    formIsValid = isChangePass ? formIsValid && enteredPassword : formIsValid

    const handleSaveChanges = async () => {
        if (isChangePass) {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/users/${
                    person.id
                }`,
                method: 'PATCH',
                body: JSON.stringify({
                    first_name: enteredFirstName,
                    last_name: enteredLastName,
                    phone_number: enteredNumber,
                    username: enteredUsername,
                    position_id: selectedPosition,
                    password: enteredPassword,
                }),
            })
        } else {
            const res2 = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/users/${
                    person.id
                }`,
                method: 'PATCH',
                body: JSON.stringify({
                    first_name: enteredFirstName,
                    last_name: enteredLastName,
                    phone_number: enteredNumber,
                    username: enteredUsername,
                    position_id: selectedPosition,
                }),
            })
        }
        handleClose()
        loadData()
    }

    const handleDelete = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/users/${person.id}`,
            method: 'PATCH',
            body: JSON.stringify({
                d_status: 0,
            }),
        })
        handleClose()
        setIsDeleting(false)
        loadData()
    }

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
            // onClick={handleClose}
        >
            <Modal
                onClose={handleClose}
                title="Editing account"
                maxWidth={'500px'}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginTop: '24px',
                    }}
                >
                    {isDeleting ? (
                        <Box
                            sx={{
                                color: 'var(--fc-body)',
                            }}
                        >
                            <Box
                                sx={{
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    padding: '12px',
                                    marginBottom: '12px',
                                }}
                            >
                                <h3>
                                    {person.first_name} {person.last_name}
                                </h3>
                            </Box>
                            <p className="title">
                                Are you sure you want to archive this user?
                            </p>
                            <p>
                                This user will not be able to log in to their
                                account.
                            </p>
                            <Box
                                sx={{
                                    margin: '24px 0',
                                    display: 'flex',
                                    gap: '12px',
                                }}
                            >
                                <OutlinedButton
                                    onClick={() => setIsDeleting(false)}
                                >
                                    Cancel
                                </OutlinedButton>
                                <PrimaryButton
                                    width="100%"
                                    onClick={handleDelete}
                                    isLoading={isLoading}
                                    loadingText="Deleting"
                                    btnType="danger"
                                >
                                    Archive User
                                </PrimaryButton>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <TextField
                                label="First Name"
                                placeholder="Enter the first name"
                                value={enteredFirstName}
                                onChange={firstNameChangeHandler}
                                onBlur={firstNameBlurHandler}
                                helperText={
                                    enteredFirstNameHasError &&
                                    'This field is required.'
                                }
                                disabled={isDeleting}
                                error
                            />
                            <TextField
                                label="Last Name"
                                placeholder="Enter the last name"
                                value={enteredLastName}
                                onChange={lastNameChangeHandler}
                                onBlur={lastNameBlurHandler}
                                helperText={
                                    enteredLastNameHasError &&
                                    'This field is required.'
                                }
                                disabled={isDeleting}
                                error
                            />
                            <TextField
                                label="Phone number"
                                placeholder="Enter phone number"
                                value={enteredNumber}
                                onChange={numberChangeHandler}
                                onBlur={numberBlurHandler}
                                disabled={isDeleting}
                                // error
                            />

                            <Dropdown
                                leadingIcon={
                                    <IconBuilding
                                        size={20}
                                        color="var(--fc-body)"
                                    />
                                }
                                label="Position"
                                placeholder="Select position"
                                items={positions}
                                value={selectedPosition}
                                selected={selectedPosition}
                                handleSelect={handleSelectPosition}
                                defaultValue={person.position.id}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    marginTop: '24px',
                                }}
                            >
                                <h3>Login Details</h3>
                                <TextField
                                    label="Username"
                                    placeholder="Enter username"
                                    value={enteredUsername}
                                    onChange={usernameChangeHandler}
                                    onBlur={usernameBlurHandler}
                                    helperText={
                                        enteredUsernameHasError &&
                                        'This field is required.'
                                    }
                                    disabled={isDeleting}
                                    error
                                />

                                <FormControlLabel
                                    sx={{ color: 'var(--fc-body)' }}
                                    control={
                                        <Checkbox
                                            onChange={handleCheck}
                                            style={{ color: 'var(--accent)' }}
                                        />
                                    }
                                    label="Change password"
                                />
                                {isChangePass && (
                                    <TextField
                                        label="Change password"
                                        placeholder="Enter new password"
                                        value={enteredPassword}
                                        onChange={passwordChangeHandler}
                                        onBlur={passwordBlurHandler}
                                        helperText={
                                            enteredPasswordHasError &&
                                            'This field is required.'
                                        }
                                        disabled={!isChangePass}
                                        error
                                    />
                                )}
                            </Box>
                            <Box sx={{ marginTop: '12px' }}>
                                <Box
                                    sx={{
                                        margin: '24px 0',
                                        color: 'var(--accent-danger)',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                    }}
                                    onClick={() => setIsDeleting(true)}
                                >
                                    Archive user
                                </Box>
                                <PrimaryButton
                                    width="100%"
                                    onClick={handleSaveChanges}
                                    isLoading={isLoading}
                                    disabled={!formIsValid}
                                    loadingText="Saving changes"
                                >
                                    Save changes
                                </PrimaryButton>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Backdrop>
    )
}

export default EditPerson
