import React, { useContext, useEffect, useState } from 'react'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'

import styles from './MyProjects.module.css'

import useHttp from '../../hooks/http-hook'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Fab, IconButton } from '@mui/material'
import ProjectsList from './ProjectsList'
import AuthContext from '../../context/auth-context'
import { IconPlus } from '@tabler/icons-react'
import userPermission from '../../hooks/userPermission'
import { useNavigate } from 'react-router-dom'

const MyProjects = () => {
    const [projects, setProjects] = useState([])
    const [myProjects, setMyProjects] = useState([])
    const [assignedProjects, setAssignedProjects] = useState([])
    const { hasPermission } = userPermission()
    const navigate = useNavigate()

    const { sendRequest, isLoading } = useHttp()

    const [value, setValue] = React.useState(0)

    const userCtx = useContext(AuthContext)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        if (userCtx.user) {
            loadProjects()
            loadAssignedProjects()
            loadUserProjects()
        }
    }, [userCtx])

    const loadProjects = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/department_projects/${
                userCtx.user.position.department_id
            }`,
        })

        const newData = res.data.filter(
            (d) => d.requestor_id !== userCtx.user.id
        )

        setProjects(newData)
    }
    const loadUserProjects = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/user_projects/${
                userCtx.user.id
            }`,
        })

        setMyProjects(res.data)
    }

    const loadAssignedProjects = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/assigned_projects/${
                userCtx.user.id
            }`,
        })

        console.log(res)

        setAssignedProjects(res.data)
    }

    return (
        <>
            <div className={styles['container']}>
                <h2>Projects</h2>

                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            sx={{
                                '& .Mui-selected': {
                                    color: 'var(--accent) !important',
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'var(--accent)', // Change indicator color
                                },
                            }}
                            // indicatorColor='red'
                        >
                            {(hasPermission('201') || hasPermission('202')) && (
                                <Tab label="Department" value={0} />
                            )}
                            <Tab label="Assigned" value={1} />
                            <Tab label="My Projects" value={2} />
                        </TabList>
                    </Box>
                    <TabPanel
                        value={0}
                        sx={{ padding: '0', width: '100%', maxWidth: '500px' }}
                    >
                        {!isLoading ? (
                            <ProjectsList projects={projects} />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </TabPanel>
                    <TabPanel
                        value={1}
                        sx={{ padding: '0', width: '100%', maxWidth: '500px' }}
                    >
                        <ProjectsList projects={assignedProjects} />
                    </TabPanel>
                    <TabPanel
                        value={2}
                        sx={{ padding: '0', width: '100%', maxWidth: '500px' }}
                    >
                        <ProjectsList projects={myProjects} />
                    </TabPanel>
                </TabContext>
            </div>
            {hasPermission('217') && (
                <Fab
                    variant={'extended'}
                    sx={{
                        position: 'absolute',
                        bottom: 80,
                        right: 16,
                        color: '#fff',
                        backgroundColor: 'var(--accent)', // Specify your custom color here
                        '&:hover': {
                            backgroundColor: 'rgba(var(--accent-rgb), 0.8)', // Specify your custom hover color here
                        },
                    }}
                    onClick={() => {
                        navigate('/new-project')
                    }}
                >
                    <IconPlus sx={{ mr: 1 }} /> new project
                </Fab>
            )}
            <BottomNavigationBar current={2} />
        </>
    )
}

export default MyProjects
