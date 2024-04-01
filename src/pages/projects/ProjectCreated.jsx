import React, { useState } from 'react'

import styles from './ProjectCreated.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import useHttp from '../../hooks/http-hook'
import { Box } from '@mui/material'
import PrimaryButton from '../../components/Button/PrimaryButton'
import { MdOutlinePendingActions } from 'react-icons/md'

const ProjectCreated = () => {
    const { search } = useLocation()
    const queryParams = new URLSearchParams(search)
    const id = queryParams.get('id')

    const location = useLocation()
    const receivedData = location.state

    const { sendRequest } = useHttp()

    const [dept, setDept] = useState()
    const navigate = useNavigate()

    console.log(receivedData)

    return (
        <div className={styles['container']}>
            <div className={styles['top']}>
                <MdOutlinePendingActions size={120} color="var(--accent)" />
            </div>
            <h3>Project Submitted</h3>

            <p className={styles['lowcaption']}>Project ID: #{id}</p>
            <p>
                Your project proposal <strong>'{receivedData.title}'</strong>{' '}
                has been successfully submitted to the department.
            </p>

            <Box
                sx={{
                    marginTop: '64px',
                    width: '100%',
                }}
            >
                <PrimaryButton
                    width="100%"
                    onClick={() => {
                        navigate('/projects')
                    }}
                >
                    Done
                </PrimaryButton>
            </Box>
        </div>
    )
}

export default ProjectCreated
