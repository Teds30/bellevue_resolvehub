import React, { useContext, useEffect, useState } from 'react'

import useHttp from '../../hooks/http-hook'
import AuthContext from '../../context/auth-context'
import { Box } from '@mui/system'
const TopEmployees = () => {
    const userCtx = useContext(AuthContext)
    const [topEmployees, setTopEmployees] = useState()

    const { sendRequest } = useHttp()

    useEffect(() => {
        const loadData = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/top_employees/${
                    userCtx.department.id
                }`,
            })

            setTopEmployees(res)
        }

        if (userCtx.department) loadData()
    }, [userCtx])

    return (
        <div>
            <h3>Top Performing</h3>
            {topEmployees &&
                topEmployees?.map((emp, index) => {
                    return (
                        <Box
                            key={index}
                            sx={{
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                padding: '12px',
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <p>
                                    {emp.assignee.first_name}{' '}
                                    {emp.assignee.last_name}
                                </p>
                            </Box>
                            <Box>
                                <p className="title">{emp.completed_tasks}</p>
                            </Box>
                        </Box>
                    )
                })}
        </div>
    )
}

export default TopEmployees
