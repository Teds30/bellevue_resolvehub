import React, { useContext, useState } from 'react'

import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'

import styles from './Reports.module.css'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Fab, IconButton } from '@mui/material'
import AuthContext from '../../context/auth-context'
import { IconPlus } from '@tabler/icons-react'
import userPermission from '../../hooks/userPermission'
import { useNavigate } from 'react-router-dom'
import useHttp from '../../hooks/http-hook'
import ReportsTable from './ReportsTable'
import ProjectsTable from './ProjectsTable'

const Reports = () => {
    const { hasPermission } = userPermission()
    const navigate = useNavigate()

    const { sendRequest, isLoading } = useHttp()

    const [value, setValue] = useState(0)

    const userCtx = useContext(AuthContext)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const [active, setActive] = useState(0)

    const handleActive = (id) => {
        setActive(id)
    }

    return (
        <>
            <div className={styles['container']}>
                <h2>Reports</h2>

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
                                    backgroundColor: 'var(--accent)',
                                },
                            }}
                        >
                            <Tab label="Tasks" value={0} />
                            <Tab label="Projects" value={1} />
                        </TabList>
                    </Box>
                    <TabPanel
                        value={0}
                        sx={{
                            padding: '0',
                            paddingTop: '24px',
                            maxWidth: '100%',
                        }}
                    >
                        <ReportsTable />
                    </TabPanel>
                    <TabPanel
                        value={1}
                        sx={{
                            padding: '0',
                            paddingTop: '24px',
                            maxWidth: '100%',
                        }}
                    >
                        <ProjectsTable />
                    </TabPanel>
                </TabContext>
            </div>
            <BottomNavigationBar current={5} />
        </>
    )
}

export default Reports
