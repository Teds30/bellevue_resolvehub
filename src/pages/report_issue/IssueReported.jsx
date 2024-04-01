import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { IconSquareRoundedCheckFilled } from '@tabler/icons-react'

import useHttp from '../../hooks/http-hook'

import styles from './IssueReported.module.css'
import PrimaryButton from '../../components/Button/PrimaryButton'
import { Box } from '@mui/material'

const IssueReported = () => {
    const { search } = useLocation()
    const queryParams = new URLSearchParams(search)
    const id = queryParams.get('id')

    const location = useLocation()
    const receivedData = location.state

    const { sendRequest } = useHttp()

    const [dept, setDept] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/departments/${
                    receivedData.department
                }`,
            })

            setDept(res.data.name)
        }

        loadData()
    }, [])

    return (
        <div className={styles['container']}>
            <div className={styles['top']}>
                <IconSquareRoundedCheckFilled
                    size={120}
                    style={{ color: 'var(--accent)' }}
                />
                <h3>Issue Reported</h3>
                <p className={styles['lowcaption']}>#{id}</p>
            </div>

            <Box
                sx={{
                    marginTop: '12px',
                    width: '100%',
                }}
            >
                <p>
                    Your report has been successfully submitted to the{' '}
                    <strong>{dept}</strong>.
                </p>
            </Box>
            <Box
                sx={{
                    marginTop: '64px',
                    width: '100%',
                }}
            >
                <PrimaryButton
                    width="100%"
                    onClick={() => {
                        navigate('/tasks')
                    }}
                >
                    Done
                </PrimaryButton>
            </Box>
        </div>
    )
}

export default IssueReported
