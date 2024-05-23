import React, { useContext, useEffect, useMemo, useState } from 'react'

import styles from './MyProjects.module.css'

import useHttp from '../../hooks/http-hook'
import Moment from 'react-moment'
import {
    IconChevronRight,
    IconCircleCheck,
    IconCircleX,
    IconFilter,
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
import Dropdown from '../../components/Dropdown/Dropdown'
import dayjs from 'dayjs'
import DateFilter from '../my_tasks/DateFilter'
import AuthContext from '../../context/auth-context'

const ProjectsList = (props) => {
    const { type } = props

    const [projects, setProjects] = useState()

    const [requested, setRequested] = useState()
    const [ongoing, setOngoing] = useState()
    const [pending, setPending] = useState()
    const [cancelled, setCancelled] = useState()
    const [done, setDone] = useState()
    const [rejected, setRejected] = useState()

    const [active, setActive] = useState(0)
    const [filteredProjects, setfilteredProjects] = useState([])
    const [count, setCount] = useState({
        requested: 0,
        ongoing: 0,
        pending: 0,
        cancelled: 0,
        done: 0,
        rejected: 0,
    })

    const { sendRequest } = useHttp()

    const [selectedMetric, setSelectedMetric] = useState(1)
    const [params, setParams] = useState(`/daily`)
    const [status, setStatus] = useState(0)

    const userCtx = useContext(AuthContext)

    const handleSelectMetric = async (e) => {
        setSelectedMetric(e.target.value)
    }

    const handleActive = (id) => {
        setActive(id)
    }

    const loadDepartmentProjects = async (active) => {
        console.log('sd', active)
        if (active === 0) {
            setRequested()
        } else if (active === 1) {
            setPending()
        } else if (active === 2) {
            setOngoing()
        } else if (active === 3) {
            setCancelled()
        } else if (active === 4) {
            setDone()
        }

        setfilteredProjects()

        let _url
        if (params.includes('?')) {
            _url = `&status=${active}`
        } else {
            _url = `?status=${active}`
        }

        let _target = ''
        if (type === 'department') {
            _target = 'department_projects'
        } else if (type === 'my_projects') {
            _target = 'my_projects'
        } else if (type === 'assigned_to') {
            _target = 'assigned_to_projects'
        }

        const res_query = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/${_target}/${
                type === 'department'
                    ? userCtx.user.position.department_id
                    : userCtx.user.id
            }${params}${_url}`
        )

        const res = await res_query.json()

        if (res) {
            if (active === 0) {
                setRequested(res.data)
                setfilteredProjects(res.data)
            } else if (active === 1) {
                setPending(res.data)
                setfilteredProjects(res.data)
            } else if (active === 2) {
                setOngoing(res.data)
                setfilteredProjects(res.data)
            } else if (active === 3) {
                setCancelled(res.data)
                setfilteredProjects(res.data)
            } else if (active === 4) {
                setDone(res.data)
                setfilteredProjects(res.data)
            } else if (active === 5) {
                setRejected(res.data)
                setfilteredProjects(res.data)
            }
        }
    }

    useEffect(() => {
        // const countData = () => {
        //     let request, ongoing, pending, cancelled, done, rejected
        //     request = projects.filter((proj) => proj.status == 0).length
        //     pending = projects.filter((proj) => proj.status == 1).length
        //     ongoing = projects.filter((proj) => proj.status == 2).length
        //     cancelled = projects.filter((proj) => proj.status == 3).length
        //     done = projects.filter((proj) => proj.status == 4).length
        //     rejected = projects.filter((proj) => proj.status == 5).length
        //     setCount({
        //         request: request,
        //         ongoing: ongoing,
        //         pending: pending,
        //         cancelled: cancelled,
        //         done: done,
        //         rejected: rejected,
        //     })
        // }
        if (userCtx.user) {
            loadDepartmentProjects(active)
        }
    }, [userCtx, active, params])

    useEffect(() => {
        const changeData = () => {
            switch (active) {
                case 0:
                    setfilteredProjects(requested)
                    break
                case 1:
                    setfilteredProjects(pending)
                    break
                case 2:
                    setfilteredProjects(ongoing)
                    break
                case 3:
                    setfilteredProjects(cancelled)
                    break
                case 4:
                    setfilteredProjects(done)
                    break
                case 5:
                    setfilteredProjects(rejected)
                    break
            }
        }

        if (userCtx.department) changeData()
    }, [userCtx, active, requested])

    const navigate = useNavigate()

    const handleAppliedFilter = async (data) => {
        // queryClient.invalidateQueries({ queryKey: ['rows'] })

        let fetchParams = ''
        if (data) {
            if (data.selectedFilter == 1) {
                fetchParams = `/daily`
            } else if (data.selectedFilter == 2) {
                fetchParams = `/weekly`
            } else if (data.selectedFilter == 3) {
                fetchParams = `/monthly?month=${dayjs(data.month).format(
                    'MMMM'
                )}&year=${dayjs(data.month).format('YYYY')}`
            } else if (data.selectedFilter == 4) {
                fetchParams = `/yearly?year=${dayjs(data.year).format('YYYY')}`
            } else if (data.selectedFilter == 5) {
                // console.log(dayjs(data.custom).format('YYYY-MM-DD'))
                fetchParams = `/custom?custom=${dayjs(data.custom).format(
                    'YYYY-MM-DD'
                )}`
            }
        }

        setParams(fetchParams)
    }

    const viewMore = async (active, next_page_url) => {
        // Create a URL object (using window.location.origin to handle relative URLs)
        const urlObj = new URL(params, window.location.origin)

        // Get the query string without the leading '?'
        const queryString = urlObj.search.substring(1)

        const origUrl = new URL(next_page_url)
        const proxied = origUrl.pathname + origUrl.search
        const res = await sendRequest({
            url: `${proxied}&${queryString}&status=${active}`,
        })

        let _oldproj = [...requested.data, ...res.data.data]
        let _new = res.data
        _new.data = _oldproj

        if (active === 0) {
            setRequested(_new)
        } else if (active === 1) {
            setPending(_new)
        } else if (active === 2) {
            setOngoing(_new)
        } else if (active === 3) {
            setCancelled(_new)
        } else if (active === 4) {
            setDone(_new)
        }
    }

    return (
        <div>
            {
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
                            Requested{' '}
                            {!!count.requested && (
                                <span>{count.requested}</span>
                            )}
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
                        <div className={styles['date_container']}>
                            {/* <p className="title">Filter:</p> */}
                            <DateFilter
                                handleAppliedFilter={handleAppliedFilter}
                            />
                        </div>
                        {filteredProjects?.data?.map((project, index) => {
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

                                            <p className="smaller-text">
                                                created{' '}
                                                <Moment fromNow>
                                                    {project.created_at}
                                                </Moment>
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
                        {filteredProjects?.next_page_url && (
                            <p
                                onClick={() =>
                                    viewMore(
                                        active,
                                        filteredProjects.next_page_url
                                    )
                                }
                            >
                                View More
                            </p>
                        )}
                    </Box>
                </div>
            }
        </div>
    )
}

export default ProjectsList
