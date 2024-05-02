import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/auth-context'

import styles from './ProfileDetails.module.css'
import TextField from '../../components/TextField/TextField'
import PrimaryButton from '../../components/Button/PrimaryButton'
import OutlinedButton from '../../components/Button/OutlinedButton'
import useValidate from '../../hooks/validate-input-hook'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useHttp from '../../hooks/http-hook'
import ChangePassword from './ChangePassword'

const ProfileDetails = () => {
    const {
        value: firstname,
        isValid: firstnameIsValid,
        hasError: firstnameHasError,
        valueChangeHandler: firstnameChangeHandler,
        inputBlurHandler: firstnameBlurHandler,
        reset: firstnameReset,
        defaultValueHandler: firstnameDefault,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: lastname,
        isValid: lastnameIsValid,
        hasError: lastnameHasError,
        valueChangeHandler: lastnameChangeHandler,
        inputBlurHandler: lastnameBlurHandler,
        reset: lastnameReset,
        defaultValueHandler: lastnameDefault,
    } = useValidate((value) => value.trim() !== '')

    const userCtx = useContext(AuthContext)
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    const [isEditing, setIsEditing] = useState(false)
    const { sendRequest, isLoading } = useHttp()

    useEffect(() => {
        if (userCtx.user) {
            firstnameDefault(userCtx.user.first_name)
            lastnameDefault(userCtx.user.last_name)
        }
    }, [userCtx])

    const handleSubmit = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/users/${
                userCtx.user.id
            }`,
            method: 'PATCH',
            body: JSON.stringify({
                first_name: firstname,
                last_name: lastname,
            }),
        })

        setIsEditing(false)
    }

    return (
        <div className={styles['container']}>
            {userCtx && (
                <div className={styles['profile_card']}>
                    <h2>Profile</h2>
                    <div className={styles['details']}>
                        <TextField
                            label="First Name"
                            placeholder="Enter your first name"
                            value={firstname}
                            onChange={firstnameChangeHandler}
                            onBlur={firstnameBlurHandler}
                            helperText={firstnameHasError && 'Invalid input.'}
                            disabled={!isEditing}
                            error
                        />
                        <TextField
                            label="Last Name"
                            placeholder="Enter your last name"
                            value={lastname}
                            onChange={lastnameChangeHandler}
                            onBlur={lastnameBlurHandler}
                            helperText={lastnameHasError && 'Invalid input.'}
                            disabled={!isEditing}
                            error
                        />
                        <TextField
                            label="Position"
                            placeholder="Enter your last name"
                            disabled
                            value={userCtx.user && userCtx.user.position.name}
                        />
                    </div>
                    <div className={styles['actions']}>
                        {isEditing && (
                            <Box>
                                <Box sx={{ display: 'flex', gap: '14px' }}>
                                    <OutlinedButton
                                        width="100%"
                                        onClick={() => {
                                            setIsEditing(false)
                                        }}
                                    >
                                        Cancel
                                    </OutlinedButton>
                                    <PrimaryButton
                                        width="100%"
                                        onClick={handleSubmit}
                                        isLoading={isLoading}
                                        loadingText="Saving"
                                    >
                                        Save
                                    </PrimaryButton>
                                </Box>
                                <Box
                                    sx={{
                                        marginTop: '24px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            color: 'var(--fc-strong)',
                                            textDecoration: 'underline',
                                        }}
                                        width="100%"
                                        onClick={handleOpen}
                                    >
                                        Change Password
                                    </p>
                                </Box>
                            </Box>
                        )}

                        {!isEditing && (
                            <>
                                <OutlinedButton
                                    width="100%"
                                    onClick={() => {
                                        setIsEditing(true)
                                    }}
                                >
                                    Edit Profile
                                </OutlinedButton>
                                <OutlinedButton
                                    btnType="danger"
                                    width="100%"
                                    onClick={() => {
                                        navigate('/logout')
                                    }}
                                >
                                    Logout
                                </OutlinedButton>
                            </>
                        )}
                    </div>
                </div>
            )}
            {<ChangePassword open={open} handleClose={handleClose} />}
        </div>
    )
}

export default ProfileDetails
