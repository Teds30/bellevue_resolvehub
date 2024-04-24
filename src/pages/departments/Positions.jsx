import React, { useContext, useEffect, useState } from 'react'
import useHttp from '../../hooks/http-hook'

import styles from './Positions.module.css'
import Moment from 'react-moment'
import { Box, IconButton } from '@mui/material'
import { IconChevronRight, IconPencil, IconPlus } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import Backdrop from '@mui/material/Backdrop'
import Modal from '../../components/Modal/Modal'
import TextField from '../../components/TextField/TextField'
import useValidate from '../../hooks/validate-input-hook'
import OutlinedButton from '../../components/Button/OutlinedButton'
import PrimaryButton from '../../components/Button/PrimaryButton'
import AddPosition from './AddPosition'
import AuthContext from '../../context/auth-context'
import BellevueLoading from '../../components/LoadingSpinner/BellevueLoading'

const Positions = (props) => {
    const { department_id } = props

    const {
        value: enteredTitle,
        isValid: enteredTitleIsValid,
        hasError: enteredTitleHasError,
        valueChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler,
        reset: titleReset,
        defaultValueHandler: titleDefaultValue,
    } = useValidate((value) => value.trim() !== '')

    const navigate = useNavigate()
    const userCtx = useContext(AuthContext)

    const { sendRequest, isLoading } = useHttp()
    const [positions, setPositions] = useState([])
    const [editing, setEditing] = useState()
    const [isDeleting, setIsDeleting] = useState(false)

    const [open, setOpen] = React.useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    const [openAdd, setOpenAdd] = useState(false)
    const handleAddClose = () => {
        setOpenAdd(false)
    }
    const handleAddOpen = () => {
        setOpenAdd(true)
    }

    useEffect(() => {
        loadData()
    }, [department_id])

    const loadData = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_positions/${department_id}`,
        })

        setPositions(res.data)
    }

    const handleSaveChanges = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/positions/${editing}`,
            method: 'PATCH',
            body: JSON.stringify({
                name: enteredTitle,
            }),
        })
        handleClose()
        loadData()
    }

    const handleDelete = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/positions/${editing}`,
            method: 'DELETE',
        })
        handleClose()
        loadData()
    }

    return (
        <div className={styles['container']}>
            {positions &&
                positions?.map((position, index) => (
                    <div className={styles['position']} key={index}>
                        <div className={styles['details']}>
                            <h4>{position.name}</h4>
                            <p>
                                Created on{' '}
                                <Moment format="MMMM DD, YYYY">
                                    {position.created_at}
                                </Moment>
                            </p>
                        </div>
                        {isLoading && (
                            <Box
                                sx={{
                                    marginTop: '48px',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '48px',
                                }}
                            >
                                <BellevueLoading />
                                <h4>Fetching</h4>
                            </Box>
                        )}

                        {!isLoading &&
                            userCtx.user &&
                            userCtx.hasPermission('304') && (
                                <IconButton
                                    onClick={() => {
                                        handleOpen()
                                        setEditing(position.id)
                                        titleDefaultValue(position.name)
                                    }}
                                >
                                    <IconPencil />
                                </IconButton>
                            )}
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
                                title="Editing Position"
                                maxWidth={'500px'}
                            >
                                <Box sx={{ marginTop: '24px' }}>
                                    <TextField
                                        label="Name"
                                        placeholder="Enter the title"
                                        value={enteredTitle}
                                        onChange={titleChangeHandler}
                                        onBlur={titleBlurHandler}
                                        helperText={
                                            enteredTitleHasError &&
                                            'This field is required.'
                                        }
                                        disabled={isDeleting}
                                        error
                                    />
                                    {isDeleting ? (
                                        <Box
                                            sx={{
                                                marginTop: '48px',
                                                color: 'var(--fc-body)',
                                            }}
                                        >
                                            <p className="title">
                                                Are you sure you want to delete
                                                this position?
                                            </p>
                                            <p>
                                                All employees in this position
                                                will need to be reassigned to
                                                another position.
                                            </p>
                                            <Box
                                                sx={{
                                                    margin: '24px 0',
                                                    display: 'flex',
                                                    gap: '12px',
                                                }}
                                            >
                                                <OutlinedButton
                                                    onClick={() =>
                                                        setIsDeleting(false)
                                                    }
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
                                                    Delete Position
                                                </PrimaryButton>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box sx={{ marginTop: '48px' }}>
                                            <Box
                                                sx={{
                                                    margin: '24px 0',
                                                    color: 'var(--accent-danger)',
                                                    fontWeight: 600,
                                                    textAlign: 'center',
                                                }}
                                                onClick={() =>
                                                    setIsDeleting(true)
                                                }
                                            >
                                                Delete Position
                                            </Box>
                                            <PrimaryButton
                                                width="100%"
                                                onClick={handleSaveChanges}
                                                isLoading={isLoading}
                                                loadingText="Saving changes"
                                            >
                                                Save changes
                                            </PrimaryButton>
                                        </Box>
                                    )}
                                </Box>
                            </Modal>
                        </Backdrop>
                    </div>
                ))}
            {isLoading && (
                <Box
                    sx={{
                        marginTop: '48px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '48px',
                    }}
                >
                    <BellevueLoading />
                    <h4>Fetching</h4>
                </Box>
            )}

            {!isLoading && userCtx.user && userCtx.hasPermission('303') && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '48px',
                    }}
                >
                    <PrimaryButton
                        width="250px"
                        leftIcon={<IconPlus />}
                        onClick={() => {
                            setOpenAdd(true)
                        }}
                    >
                        Add new
                    </PrimaryButton>
                </Box>
            )}
            {openAdd && (
                <AddPosition
                    department_id={department_id}
                    open={openAdd}
                    handleClose={handleAddClose}
                    loadData={loadData}
                />
            )}
        </div>
    )
}

export default Positions
