import React, { useContext, useEffect, useState } from 'react'

import styles from './Login.module.css'
import TextField from '../../components/TextField/TextField'
import useValidate from '../../hooks/validate-input-hook'
import PrimaryButton from '../../components/Button/PrimaryButton'

import BellevueLoading from '../../components/LoadingSpinner/BellevueLoading'

import brand from '../../assets/bellevue.png'

import useHttp from '../../hooks/http-hook'

import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/auth-context'
import Alert from '../../components/Alert/Alert'
import { Backdrop, Box } from '@mui/material'

const Login = () => {
    const {
        value: enteredUsername,
        isValid: enteredUsernameIsValid,
        hasError: enteredUsernameHasError,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        reset: usernameReset,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: enteredPassword,
        isValid: enteredPasswordIsValid,
        hasError: enteredPasswordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: passwordReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()
    const navigate = useNavigate()
    const userCtx = useContext(AuthContext)

    const [error, setError] = useState()
    const [open, setOpen] = useState(true)
    const [loginProgress, setLoginProgress] = useState(true)

    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'))

        if (storedData) {
            const loadData = async () => {
                const res = await userCtx.fetchUserData(storedData)
                if (res) {
                    navigate('/tasks')
                }

                setLoginProgress(false)
                handleClose()
            }
            if (userCtx.user) loadData()
        }

        setLoginProgress(false)
        handleClose()
    }, [userCtx])

    const login = async (body) => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/login`,
            body: JSON.stringify(body),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!res.success) {
            setError(res.message)
            return null
        }

        setError(null)

        return res
    }

    const handleSubmit = async () => {
        const user = await login({
            username: enteredUsername,
            password: enteredPassword,
        })

        if (user) {
            userCtx.onLogin({ user: user.data.user, token: user.data.token })
        }
    }

    return (
        <>
            {!loginProgress && (
                <div className={styles['container']}>
                    <div className={styles['card']}>
                        <div className={styles['brand']}>
                            <img src={brand} alt="bellevue" width={'100px'} />
                        </div>
                        <div className={styles['content']}>
                            {error && <Alert message={error} />}
                            <TextField
                                fullWidth
                                label="Username"
                                placeholder="Enter your username"
                                value={enteredUsername}
                                onChange={usernameChangeHandler}
                                onBlur={usernameBlurHandler}
                                helperText={
                                    enteredUsernameHasError &&
                                    'Enter a valid username.'
                                }
                                error
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                placeholder="Enter your password"
                                value={enteredPassword}
                                onChange={passwordChangeHandler}
                                onBlur={passwordBlurHandler}
                                helperText={
                                    enteredPasswordHasError &&
                                    'Incorrect password.'
                                }
                                error
                                type="password"
                            />

                            <PrimaryButton
                                width="100%"
                                disabled={
                                    !enteredUsernameIsValid ||
                                    !enteredPasswordIsValid
                                }
                                onClick={handleSubmit}
                                isLoading={isLoading}
                                loadingText={'Logging in'}
                            >
                                Login
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(255,255,255, 1)',
                }}
                open={open}
                onClick={handleClose}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: '32px',
                    }}
                >
                    <BellevueLoading />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',

                            // gap: '32px',
                        }}
                    >
                        <h2>THE BELLEVUE MANILA</h2>
                        <h3>Operations Management System</h3>
                    </Box>
                </Box>
            </Backdrop>
        </>
    )
}

export default Login
