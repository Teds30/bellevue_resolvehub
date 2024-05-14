import { Box } from '@mui/material'
import React, { useContext, useState } from 'react'
import PrimaryButton from '../../components/Button/PrimaryButton'
import OutlinedButton from '../../components/Button/OutlinedButton'
import {
    IconCircleCheck,
    IconClipboardCheck,
    IconFileDislike,
    IconPlayerPause,
    IconPlayerStop,
    IconRubberStamp,
    IconThumbDown,
    IconThumbUp,
    IconX,
} from '@tabler/icons-react'
import useHttp from '../../hooks/http-hook'

import Echo from 'laravel-echo'
import AuthContext from '../../context/auth-context'

import styles from './Project.module.css'
import { MdOutlinePendingActions } from 'react-icons/md'
import dayjs from 'dayjs'
import { IconCalendarTime } from '@tabler/icons-react'
import ProjectPendingSwipe from './ProjectPendingSwipe'
import ProjectAccomplishSwipe from './ProjectAccomplishSwipe'
import Moment from 'react-moment'
import ProjectCancelSwipe from './ProjectCancelSwipe'
import ProjectRejectSwipe from './ProjectRejectSwipe'
import userPermission from '../../hooks/userPermission'
import { IconMessages } from '@tabler/icons-react'

const ProjectApproval = (props) => {
    const { project, onRefreshData } = props

    const { sendRequest, isLoading } = useHttp()
    const userCtx = useContext(AuthContext)

    const [pendingOpen, setPendingOpen] = useState()
    const [accomplishOpen, setAccomplishOpen] = useState()
    const [cancelOpen, setCancelOpen] = useState()
    const [rejectOpen, setRejectOpen] = useState()

    const { hasPermission } = userPermission()

    const handleApprove = async () => {
        const is_ongoing =
            dayjs(project.schedule) < dayjs() &&
            dayjs() < dayjs(project.deadline)

        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/projects/${
                project.id
            }`,
            body: JSON.stringify({
                status: is_ongoing ? 2 : 1,
            }),
            method: 'PATCH',
        })

        onRefreshData()
        // console.log(res)
    }
    const handleReject = async () => {}
    const handlePending = async () => {}
    const handleCancel = async () => {}
    const handleAccomplish = async () => {
        // const res = await sendRequest({
        //     url: `${import.meta.env.VITE_BACKEND_URL}/api/projects/${
        //         project.id
        //     }`,
        //     body: JSON.stringify({
        //         status: 4,
        //     }),
        //     method: 'PATCH',
        // })
        // onRefreshData()
    }

    return (
        <Box
            sx={{
                display: 'flex',
                gap: '12px',
                flexDirection: 'column',
                marginTop: '64px',
            }}
        >
            {/* //TODO: PERMISSION */}
            {/* PERMISSION > use can (approve/accomplish) Major project  */}
            {project.status == 0 &&
                project.type == 0 &&
                hasPermission('207') && (
                    <PrimaryButton
                        width="100%"
                        onClick={handleApprove}
                        isLoading={isLoading}
                        loadingText={'Approving'}
                        leftIcon={<IconThumbUp />}
                    >
                        Approve
                    </PrimaryButton>
                )}
            {project.status == 0 &&
                project.type == 1 &&
                hasPermission('208') && (
                    <PrimaryButton
                        width="100%"
                        onClick={handleApprove}
                        isLoading={isLoading}
                        loadingText={'Approving'}
                        leftIcon={<IconThumbUp />}
                    >
                        Approve
                    </PrimaryButton>
                )}

            {/* //TODO: PERMISSION */}

            {(project.status === 2 || project.status === 1) && (
                <PrimaryButton
                    width="100%"
                    // onClick={handleAccomplish}
                    leftIcon={<IconCircleCheck />}
                    isLoading={false}
                    loadingText={'Accomplishing'}
                    onClick={() => setAccomplishOpen(true)}
                >
                    Accomplish Project
                </PrimaryButton>
            )}
            <Box
                sx={{
                    display: 'flex',
                    gap: '12px',
                }}
            >
                {/* //TODO: PERMISSION */}
                {project.status === 0 &&
                    project.type == 0 &&
                    hasPermission('209') && (
                        <OutlinedButton
                            btnType="danger"
                            width="100%"
                            // onClick={handleReject}
                            onClick={() => setRejectOpen(true)}
                            leftIcon={<IconThumbDown />}
                        >
                            Reject
                        </OutlinedButton>
                    )}
                {project.status === 0 &&
                    project.type == 1 &&
                    hasPermission('210') && (
                        <OutlinedButton
                            btnType="danger"
                            width="100%"
                            // onClick={handleReject}
                            onClick={() => setRejectOpen(true)}
                            leftIcon={<IconThumbDown />}
                        >
                            Reject
                        </OutlinedButton>
                    )}

                {/* //TODO: PERMISSION */}

                {(project.status === 1 || project.status === 2) && (
                    <OutlinedButton
                        btnType="danger"
                        width="100%"
                        // onClick={handleCancel}
                        leftIcon={<IconPlayerStop />}
                        onClick={() => setCancelOpen(true)}
                    >
                        Cancel
                    </OutlinedButton>
                )}

                {/* //TODO: PERMISSION */}

                {/* pending of minor projects from employee */}

                {project.status !== 3 &&
                    project.status !== 4 &&
                    project.status !== 5 &&
                    hasPermission('215') && (
                        <OutlinedButton
                            width="100%"
                            // onClick={handlePending}
                            leftIcon={<IconCalendarTime />}
                            onClick={() => setPendingOpen(true)}
                        >
                            Reschedule
                        </OutlinedButton>
                    )}
            </Box>

            {project.status === 0 &&
                userCtx.user.id === project.requestor.id && (
                    <div className={styles['project-submitted']}>
                        <div className={styles['submit-icon']}>
                            <MdOutlinePendingActions
                                size={32}
                                color="var(--accent)"
                            />
                        </div>
                        <p>
                            This project proposal has been submitted and is
                            awaiting approval.
                        </p>
                    </div>
                )}

            {project.status === 4 && (
                <div className={styles['project-submitted']}>
                    <div className={styles['submit-icon']}>
                        <IconClipboardCheck size={32} color="var(--accent)" />
                    </div>
                    <p>
                        This project has been accomplished on{' '}
                        <strong>
                            <Moment format="MMMM DD, YYYY">
                                {project.updated_at}
                            </Moment>
                        </strong>{' '}
                        by{' '}
                        <strong>
                            {project.completed_marker.first_name}{' '}
                            {project.completed_marker.last_name}.
                        </strong>
                    </p>
                </div>
            )}
            {project.status === 3 && (
                <div className={styles['project-submitted']}>
                    <div className={styles['submit-icon']}>
                        <IconX size={32} color="var(--accent-danger)" />
                    </div>
                    <div>
                        <p>
                            This project has been cancelled by{' '}
                            {project.completed_marker.first_name}{' '}
                            {project.completed_marker.last_name}.
                        </p>
                        <p className="title" style={{ marginTop: '6px' }}>
                            Reason: {project.remarks}
                        </p>
                    </div>
                </div>
            )}
            {project.status === 5 && (
                <div className={styles['project-submitted']}>
                    <div className={styles['submit-icon']}>
                        <IconFileDislike
                            size={32}
                            color="var(--accent-danger)"
                        />
                    </div>
                    <div>
                        <p>
                            This project has been rejected by{' '}
                            {project.completed_marker.first_name}{' '}
                            {project.completed_marker.last_name}.
                        </p>
                        <p className="title" style={{ marginTop: '6px' }}>
                            Reason: {project.remarks}
                        </p>
                    </div>
                </div>
            )}
            <ProjectPendingSwipe
                onRefreshData={onRefreshData}
                isOpen={pendingOpen}
                setIsOpen={setPendingOpen}
                project={project}
                userCtx={userCtx}
            />
            <ProjectAccomplishSwipe
                onRefreshData={onRefreshData}
                isOpen={accomplishOpen}
                setIsOpen={setAccomplishOpen}
                project={project}
                userCtx={userCtx}
            />
            <ProjectCancelSwipe
                onRefreshData={onRefreshData}
                isOpen={cancelOpen}
                setIsOpen={setCancelOpen}
                project={project}
                userCtx={userCtx}
            />
            <ProjectRejectSwipe
                onRefreshData={onRefreshData}
                isOpen={rejectOpen}
                setIsOpen={setRejectOpen}
                project={project}
                userCtx={userCtx}
            />
        </Box>
    )
}

export default ProjectApproval
