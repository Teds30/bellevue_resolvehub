import React, { useContext, useEffect, useState } from 'react'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'

import styles from './MyProjects.module.css'

import useHttp from '../../hooks/http-hook'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Fab, IconButton, Skeleton } from '@mui/material'
import ProjectsList from './ProjectsList'
import AuthContext from '../../context/auth-context'
import { IconPlus } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import Dropdown from '../../components/Dropdown/Dropdown'
import { IconFilter } from '@tabler/icons-react'

const MyProjects = () => {
    const [projects, setProjects] = useState([])
    const [myProjects, setMyProjects] = useState([])
    const [assignedProjects, setAssignedProjects] = useState([])
    const navigate = useNavigate()

    const { sendRequest, isLoading } = useHttp()

    const [value, setValue] = React.useState(1)

    const userCtx = useContext(AuthContext)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        if (userCtx.user) {
            if (userCtx.hasPermission('201') || userCtx.hasPermission('202')) {
                // loadProjects()
            }
            loadAssignedProjects()
            loadUserProjects()
        }
    }, [userCtx.user])

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
                            {userCtx.user &&
                                (userCtx.hasPermission('201') ||
                                    userCtx.hasPermission('202')) && (
                                    <Tab
                                        label="My Department"
                                        value={0}
                                        // onClick={() => loadProjects()}
                                    />
                                )}
                            {userCtx.user &&
                                (userCtx.hasPermission('203') ||
                                    userCtx.hasPermission('204')) && (
                                    <Tab
                                        label="My Projects"
                                        value={1}
                                        onClick={() => loadAssignedProjects()}
                                    />
                                )}

                            <Tab
                                label="Assigned To"
                                value={2}
                                onClick={() => loadUserProjects()}
                            />
                        </TabList>
                    </Box>
                    <TabPanel
                        value={0}
                        sx={{ padding: '0', width: '100%', maxWidth: '720px' }}
                    >
                        {!isLoading ? (
                            <ProjectsList type="department" />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </TabPanel>
                    <TabPanel
                        value={1}
                        sx={{ padding: '0', width: '100%', maxWidth: '720px' }}
                    >
                        <ProjectsList type="my_projects" />
                    </TabPanel>
                    <TabPanel
                        value={2}
                        sx={{ padding: '0', width: '100%', maxWidth: '720px' }}
                    >
                        <ProjectsList type="assigned_to" />
                    </TabPanel>
                </TabContext>
            </div>

            {userCtx.user && userCtx.hasPermission('217') && (
                <Fab
                    variant={'extended'}
                    sx={{
                        position: 'fixed',
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
