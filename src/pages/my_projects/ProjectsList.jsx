import React from 'react'

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
import { Box, IconButton } from '@mui/material'

const ProjectsList = (props) => {
    const { projects } = props

    const navigate = useNavigate()
    return (
        <div>
            {projects && (
                <div className={styles['projects-container']}>
                    {projects?.map((project, index) => {
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
                                            className={styles['chip-container']}
                                        >
                                            <div className={styles['chip']}>
                                                {project.type == 0
                                                    ? 'MINOR'
                                                    : 'MAJOR'}
                                            </div>
                                            <div className={styles['status']}>
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    {project.status == 0 ? (
                                                        <IconSend size={18} />
                                                    ) : project.status == 1 ? (
                                                        <IconHourglassHigh
                                                            size={18}
                                                        />
                                                    ) : project.status == 2 ? (
                                                        <IconPlayerPlay
                                                            size={18}
                                                            color="var(--success)"
                                                        />
                                                    ) : project.status == 3 ? (
                                                        <IconCircleX
                                                            size={18}
                                                        />
                                                    ) : project.status == 4 ? (
                                                        <IconCircleCheck
                                                            size={18}
                                                        />
                                                    ) : project.status == 5 ? (
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
                </div>
            )}
        </div>
    )
}

export default ProjectsList
