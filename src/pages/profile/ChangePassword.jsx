import React, { useContext } from 'react'
import Modal from '../../components/Modal/Modal'
import { Backdrop, Box } from '@mui/material'
import TextField from '../../components/TextField/TextField'
import PrimaryButton from '../../components/Button/PrimaryButton'
import useValidate from '../../hooks/validate-input-hook'
import useHttp from '../../hooks/http-hook'
import OutlinedButton from '../../components/Button/OutlinedButton'
import AuthContext from '../../context/auth-context'

const ChangePassword = (props) => {
    const { open, handleClose } = props

    const userCtx = useContext(AuthContext)

    const {
        value: password,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: passwordReset,
        defaultValueHandler: passwordDefaultValue,
    } = useValidate((value) => value.trim() !== '')
    const {
        value: confirmPassword,
        isValid: confirmPasswordIsValid,
        hasError: confirmPasswordHasError,
        valueChangeHandler: confirmPasswordChangeHandler,
        inputBlurHandler: confirmPasswordBlurHandler,
        reset: confirmPasswordReset,
        defaultValueHandler: confirmPasswordDefaultValue,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()

    const handleSaveChanges = async () => {
        const storedData = JSON.parse(localStorage.getItem('userData'))

        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/forgot_password`,
            method: 'POST',
            body: JSON.stringify({
                id: userCtx.user.id,
                password: password,
            }),
            headers: {
                Authorization: `Bearer ${storedData.token}`,
                'Content-Type': 'application/json',
            },
        })
        handleClose()
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
                title="Change password"
                maxWidth={'500px'}
            >
                <Box sx={{ marginTop: '24px' }}>
                    <TextField
                        type="password"
                        label="New password"
                        placeholder="New password"
                        value={password}
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                        helperText={
                            passwordHasError && 'This field is required.'
                        }
                        error
                        sx={{ marginBottom: '16px' }}
                    />
                    <TextField
                        type="password"
                        label="Confirm password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={confirmPasswordChangeHandler}
                        onBlur={confirmPasswordBlurHandler}
                        helperText={
                            confirmPasswordHasError && 'This field is required.'
                        }
                        error
                    />
                    <Box
                        sx={{ marginTop: '48px', display: 'flex', gap: '14px' }}
                    >
                        <OutlinedButton
                            onClick={handleClose}
                            isLoading={isLoading}
                            loadingText="Saving changes"
                        >
                            Cancel
                        </OutlinedButton>
                        <PrimaryButton
                            width="100%"
                            onClick={handleSaveChanges}
                            isLoading={isLoading}
                            loadingText="Saving changes"
                            disabled={
                                !!(password !== confirmPassword) ||
                                !passwordIsValid ||
                                !confirmPasswordIsValid
                            }
                        >
                            Save
                        </PrimaryButton>
                    </Box>
                </Box>
            </Modal>
        </Backdrop>
    )
}

export default ChangePassword
