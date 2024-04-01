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

const AddPerson = (props) => {
    const { open, handleClose, loadData, department_id } = props

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
    const [selectedPosition, setSelectedPosition] = useState()

    const { sendRequest, isLoading } = useHttp()

    const handleSelectPosition = (e) => {
        setSelectedPosition(e.target.value)
    }

    useEffect(() => {
        loadPositions()
    }, [])

    const loadPositions = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_positions/${department_id}`,
        })

        setPositions(res.data)
    }

    let formIsValid =
        enteredFirstNameIsValid &&
        enteredLastNameIsValid &&
        enteredNumberIsValid &&
        enteredUsernameIsValid &&
        !!selectedPosition

    console.log('opneing')

    const handleSaveChanges = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/register`,
            method: 'POST',
            body: JSON.stringify({
                first_name: enteredFirstName,
                last_name: enteredLastName,
                phone_number: enteredNumber,
                username: enteredUsername,
                position_id: selectedPosition,
                password: enteredPassword,
            }),
        })
        handleClose()
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
                title="Adding new account"
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
                        error
                    />
                    <TextField
                        label="Last Name"
                        placeholder="Enter the last name"
                        value={enteredLastName}
                        onChange={lastNameChangeHandler}
                        onBlur={lastNameBlurHandler}
                        helperText={
                            enteredLastNameHasError && 'This field is required.'
                        }
                        error
                    />
                    <TextField
                        label="Phone number"
                        placeholder="Enter phone number"
                        value={enteredNumber}
                        onChange={numberChangeHandler}
                        onBlur={numberBlurHandler}
                        // error
                    />
                    <Dropdown
                        leadingIcon={
                            <IconBuilding size={20} color="var(--fc-body)" />
                        }
                        label="Position"
                        placeholder="Select position"
                        items={positions}
                        value={selectedPosition}
                        selected={selectedPosition}
                        handleSelect={handleSelectPosition}
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
                            error
                        />

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
                            error
                        />
                    </Box>
                    <Box sx={{ marginTop: '12px' }}>
                        <PrimaryButton
                            width="100%"
                            onClick={handleSaveChanges}
                            isLoading={isLoading}
                            disabled={!formIsValid}
                            loadingText="Adding user"
                        >
                            Add user
                        </PrimaryButton>
                    </Box>
                </Box>
            </Modal>
        </Backdrop>
    )
}

export default AddPerson
