import React, { useEffect, useMemo, useState } from 'react'

import styles from './MyProjects.module.css'

import useHttp from '../../hooks/http-hook'
import Moment from 'react-moment'
import {
    IconChevronRight,
    IconCircleCheck,
    IconCircleX,
    IconMapPin,
    IconPlayerPlay,
} from '@tabler/icons-react'

import { useNavigate } from 'react-router-dom'
import { IconFileDislike } from '@tabler/icons-react'
import { IconHourglassHigh } from '@tabler/icons-react'
import { IconSend } from '@tabler/icons-react'
import { IconPlayerPlayFilled } from '@tabler/icons-react'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Badge, Box, IconButton } from '@mui/material'

const ProjectsList = (props) => {
    const { projects } = props

    const [active, setActive] = useState(0)
    const [filteredProjects, setfilteredProjects] = useState([])
    const [count, setCount] = useState({
        request: 0,
        ongoing: 0,
        pending: 0,
        cancelled: 0,
        done: 0,
        rejected: 0,
    })

    const { sendRequest } = useHttp()

    const handleActive = (id) => {
        setActive(id)
    }

    useEffect(() => {
        const changeData = () => {
            setfilteredProjects(projects.filter((proj) => proj.status == 0))
        }

        const countData = () => {
            let request, ongoing, pending, cancelled, done, rejected

            request = projects.filter((proj) => proj.status == 0).length
            pending = projects.filter((proj) => proj.status == 1).length
            ongoing = projects.filter((proj) => proj.status == 2).length
            cancelled = projects.filter((proj) => proj.status == 3).length
            done = projects.filter((proj) => proj.status == 4).length
            rejected = projects.filter((proj) => proj.status == 4).length

            setCount({
                request: request,
                ongoing: ongoing,
                pending: pending,
                cancelled: cancelled,
                done: done,
                rejected: rejected,
            })
        }

        countData()

        changeData()
    }, [projects])

    useEffect(() => {
        const changeData = () => {
            switch (active) {
                case 0:
                    setfilteredProjects(
                        projects.filter((proj) => proj.status == 0)
                    )
                    break
                case 1:
                    setfilteredProjects(
                        projects.filter((proj) => proj.status == 1)
                    )
                    break
                case 2:
                    setfilteredProjects(
                        projects.filter((proj) => proj.status == 2)
                    )
                    break
                case 3:
                    setfilteredProjects(
                        projects.filter((proj) => proj.status == 3)
                    )
                    break
                case 4:
                    setfilteredProjects(
                        projects.filter((proj) => proj.status == 4)
                    )
                    break
                case 5:
                    setfilteredProjects(
                        projects.filter((proj) => proj.status == 5)
                    )
                    break
            }
        }

        changeData()
    }, [active])

    const navigate = useNavigate()
    return (
        <div>
            {projects && (
                <div className={styles['projects-container']}>
                    <div className={styles['nav_container']}>
                        <div
                            className={`${styles['nav_btn']} ${
                                active === 0 && styles['nav_btn_active']
                            }`}
                            onClick={() => {
                                handleActive(0)
                            }}
                        >
                            Request{' '}
                            {!!count.request && <span>{count.request}</span>}
                        </div>
                        <div
                            className={`${styles['nav_btn']} ${
                                active === 1 && styles['nav_btn_active']
                            }`}
                            onClick={() => {
                                // navigate('tasks')
                                handleActive(1)
                            }}
                        >
                            Pending
                            {!!count.pending && <span>{count.pending}</span>}
                        </div>
                        <div
                            className={`${styles['nav_btn']} ${
                                active === 2 && styles['nav_btn_active']
                            }`}
                            onClick={() => {
                                // navigate('tasks')
                                handleActive(2)
                            }}
                        >
                            On-Going
                            {!!count.ongoing && <span>{count.ongoing}</span>}
                        </div>
                        <div
                            className={`${styles['nav_btn']} ${
                                active === 3 && styles['nav_btn_active']
                            }`}
                            onClick={() => {
                                // navigate('tasks')
                                handleActive(3)
                            }}
                        >
                            Cancelled
                            {!!count.cancelled && (
                                <span>{count.cancelled}</span>
                            )}
                        </div>
                        <div
                            className={`${styles['nav_btn']} ${
                                active === 4 && styles['nav_btn_active']
                            }`}
                            onClick={() => {
                                // navigate('tasks')
                                handleActive(4)
                            }}
                        >
                            Done
                            {!!count.done && <span>{count.done}</span>}
                        </div>
                        <div
                            className={`${styles['nav_btn']} ${
                                active === 5 && styles['nav_btn_active']
                            }`}
                            onClick={() => {
                                // navigate('tasks')
                                handleActive(5)
                            }}
                        >
                            Rejected
                            {!!count.rejected && <span>{count.rejected}</span>}
                        </div>
                    </div>
                    <Box>
                        {filteredProjects?.map((project, index) => {
                            return (
                                <div
                                    key={index}
                                    className={styles['project']}
                                    onClick={() => {
                                        navigate(`/projects/${project.id}`)
                                    }}
                                >
                                    <div className={styles['col1']}>
                                        <div className={styles['date']}>
                                            <h3>
                                                <Moment format="DD">
                                                    {project.schedule}
                                                </Moment>
                                            </h3>
                                            <p>
                                                <Moment format="MMM">
                                                    {project.schedule}
                                                </Moment>
                                            </p>
                                        </div>
                                        <div className={styles['details']}>
                                            <div
                                                className={
                                                    styles['chip-container']
                                                }
                                            >
                                                <div className={styles['chip']}>
                                                    {project.type == 0
                                                        ? 'MINOR'
                                                        : 'MAJOR'}
                                                </div>
                                                <div
                                                    className={styles['status']}
                                                >
                                                    <span
                                                        style={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                        }}
                                                    >
                                                        {project.status == 0 ? (
                                                            <IconSend
                                                                size={18}
                                                            />
                                                        ) : project.status ==
                                                          1 ? (
                                                            <IconHourglassHigh
                                                                size={18}
                                                            />
                                                        ) : project.status ==
                                                          2 ? (
                                                            <IconPlayerPlay
                                                                size={18}
                                                                color="var(--success)"
                                                            />
                                                        ) : project.status ==
                                                          3 ? (
                                                            <IconCircleX
                                                                size={18}
                                                            />
                                                        ) : project.status ==
                                                          4 ? (
                                                            <IconCircleCheck
                                                                size={18}
                                                            />
                                                        ) : project.status ==
                                                          5 ? (
                                                            <IconFileDislike
                                                                size={18}
                                                            />
                                                        ) : (
                                                            ''
                                                        )}
                                                    </span>
                                                    {project.status == 0
                                                        ? 'REQUEST'
                                                        : project.status == 1
                                                        ? 'PENDING'
                                                        : project.status == 2
                                                        ? 'ON-GOING'
                                                        : project.status == 3
                                                        ? 'CANCELLED'
                                                        : project.status == 4
                                                        ? 'DONE'
                                                        : project.status == 5
                                                        ? 'REJECTED'
                                                        : ''}
                                                </div>
                                            </div>
                                            <h4>{project.title}</h4>
                                            <p>
                                                <span>
                                                    <IconMapPin size={14} />
                                                </span>{' '}
                                                {project.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles['col2']}>
                                        <IconButton>
                                            <IconChevronRight />
                                        </IconButton>
                                    </div>
                                </div>
                            )
                        })}
                    </Box>
                </div>
            )}
        </div>
    )
}

export default ProjectsList
