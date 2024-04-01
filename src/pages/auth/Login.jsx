import React, { useContext } from 'react'

import styles from './Login.module.css'
import TextField from '../../components/TextField/TextField'
import useValidate from '../../hooks/validate-input-hook'
import PrimaryButton from '../../components/Button/PrimaryButton'

import brand from '../../assets/bellevue.png'

import useHttp from '../../hooks/http-hook'

import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/auth-context'

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

    const login = async (body) => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/login`,
            body: JSON.stringify(body),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return res
    }

    const handleSubmit = async () => {
        const user = await login({
            username: enteredUsername,
            password: enteredPassword,
        })

        if (user.data.user) {
            userCtx.onLogin({ user: user.data.user, token: user.data.token })
        }
    }

    return (
        <div className={styles['container']}>
            <div className={styles['card']}>
                <div className={styles['brand']}>
                    <img src={brand} alt="bellevue" width={'100px'} />
                </div>
                <div className={styles['content']}>
                    <TextField
                        fullWidth
                        label="Username"
                        placeholder="Enter your username"
                        value={enteredUsername}
                        onChange={usernameChangeHandler}
                        onBlur={usernameBlurHandler}
                        helperText={
                            enteredUsernameHasError && 'Enter a valid username.'
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
                            enteredPasswordHasError && 'Incorrect password.'
                        }
                        error
                        type="password"
                    />

                    <PrimaryButton
                        width="100%"
                        disabled={
                            !enteredUsernameIsValid || !enteredPasswordIsValid
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
    )
}

export default Login
