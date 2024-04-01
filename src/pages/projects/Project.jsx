import React, { useContext, useEffect, useState } from 'react'
import useHttp from '../../hooks/http-hook'
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../../context/auth-context'

import styles from './Project.module.css'
import { Box, IconButton } from '@mui/material'
import {
    IconArrowNarrowLeft,
    IconArrowNarrowRight,
    IconBuilding,
    IconMapPin,
} from '@tabler/icons-react'
import Moment from 'react-moment'
import ProjectApproval from './ProjectApproval'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'
import { IconUser } from '@tabler/icons-react'

const Project = () => {
    const { sendRequest } = useHttp()
    const { id } = useParams()

    const navigate = useNavigate()
    const [project, setProject] = useState()

    const userCtx = useContext(AuthContext)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}`,
        })

        setProject(res.data)
    }

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['topnav']}>
                    <IconButton
                        onClick={() => {
                            navigate('/projects')
                        }}
                    >
                        <IconArrowNarrowLeft color="var(--fc-strong)" />
                    </IconButton>
                </div>
                {project && userCtx.user && (
                    <div className={styles['rows']}>
                        <div className={styles['row1']}>
                            <section>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '8px',
                                        alignItems: 'center',
                                        marginBottom: '8px',
                                    }}
                                >
                                    <div
                                        className={styles['project-type-chip']}
                                    >
                                        {project.type === 1
                                            ? 'MAJOR PROJECT'
                                            : 'MINOR PROJECT'}
                                    </div>
                                    {project.status === 2 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: '4px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                className={styles['blob']}
                                            ></div>
                                            <h6
                                                style={{
                                                    letterSpacing: '1px',
                                                    margin: 0,
                                                }}
                                            >
                                                ON-GOING
                                            </h6>
                                        </Box>
                                    )}
                                </Box>
                                <h2>{project.title}</h2>
                                <p>
                                    requested by{' '}
                                    <span style={{ color: 'var(--accent)' }}>
                                        {project.requestor.first_name}{' '}
                                        {project.requestor.last_name}
                                    </span>
                                </p>
                            </section>
                            <section>
                                <div className={styles['to_department']}>
                                    <IconBuilding size={18} />
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            color: 'var(--fc-body)',
                                            fontSize: '1em',
                                        }}
                                    >
                                        {project.department.name}
                                    </p>
                                </div>
                                <div className={styles['to_department']}>
                                    <IconUser size={18} />
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            color: 'var(--fc-body)',
                                            fontSize: '1em',
                                        }}
                                    >
                                        {project.incharge.first_name}{' '}
                                        {project.incharge.last_name}
                                    </p>
                                </div>
                            </section>
                            <section>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: '24px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            gap: '8px',
                                        }}
                                    >
                                        <IconMapPin />
                                        {project.location}
                                    </Box>
                                    <div
                                        className={styles['schedule-container']}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <div className="pre-title">
                                                START DATE
                                            </div>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <h3>
                                                    <Moment format="MMMM D">
                                                        {project.schedule}
                                                    </Moment>
                                                </h3>
                                                <p style={{ fontWeight: 600 }}>
                                                    <Moment format="h:mm A">
                                                        {project.schedule}
                                                    </Moment>
                                                </p>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                background: 'var(--bg-layer2)',
                                                alignSelf: 'center',
                                                display: 'flex',
                                                borderRadius: '50%',
                                                padding: '8px',
                                            }}
                                        >
                                            <IconArrowNarrowRight />
                                        </Box>
                                        {/* <Box
                                        sx={{
                                            background: 'var(--border-color)',
                                            width: '2px',
                                            height: '40px',
                                            alignSelf: 'center',
                                        }}
                                    ></Box> */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <div className="pre-title">
                                                DEADLINE
                                            </div>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <h3>
                                                    <Moment format="MMMM D">
                                                        {project.deadline}
                                                    </Moment>
                                                </h3>
                                                <p style={{ fontWeight: 600 }}>
                                                    <Moment format="h:mm A">
                                                        {project.deadline}
                                                    </Moment>
                                                </p>
                                            </Box>
                                        </Box>
                                    </div>
                                </Box>
                            </section>
                            <section>
                                <p className="title">Details</p>
                                <p>{project.details}</p>
                            </section>
                        </div>
                        <div className={styles['row2']}>
                            <ProjectApproval
                                project={project}
                                onRefreshData={loadData}
                            />
                        </div>
                    </div>
                )}
            </div>
            <BottomNavigationBar />
        </>
    )
}

export default Project
