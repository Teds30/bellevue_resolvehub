import React, { useContext, useEffect, useState } from 'react'
import SwipeableCard from '../../components/SwipeableCard/SwipeableCard'

import dayjs from 'dayjs'
import useHttp from '../../hooks/http-hook'
import AuthContext from '../../context/auth-context'
import { Box, IconButton } from '@mui/material'
import TextField from '../../components/TextField/TextField'
import DateSelector from '../../components/DateSelector/DateSelector'
import TimeSelector from '../../components/DateSelector/TimeSelector'
import OutlinedButton from '../../components/Button/OutlinedButton'
import combineDateTime from '../../hooks/combineDateTime'
import useValidate from '../../hooks/validate-input-hook'
import PrimaryButton from '../../components/Button/PrimaryButton'
import { IconSend2 } from '@tabler/icons-react'
import Moment from 'react-moment'

const ProjectCommentsSwipe = (props) => {
    const { isOpen, setIsOpen, project, comments, refreshComments } = props

    const {
        value: comment,
        isValid: commentIsValid,
        hasError: commentHasError,
        valueChangeHandler: commentChangeHandler,
        inputBlurHandler: commentBlurHandler,
        reset: commentReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest, isLoading } = useHttp()

    const userCtx = useContext(AuthContext)

    const toggleDrawer = (newOpen) => {
        setIsOpen(newOpen)
    }

    const handleCloseDrawer = () => {
        setIsOpen(false)
    }

    const handleSubmit = async () => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/project-comments`,
            method: 'POST',
            body: JSON.stringify({
                project_id: project.id,
                commentor_id: userCtx.user.id,
                comment: comment,
            }),
        })

        if (res) {
            refreshComments()
            commentReset()
        }
    }

    let sortedComments =
        comments &&
        comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    return (
        <SwipeableCard
            open={isOpen}
            onOpen={toggleDrawer}
            closeDrawer={handleCloseDrawer}
            title="Comments"
            action={
                project?.completed_marker_id === null && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: '#fff',
                            borderTop: '1px solid var(--border-color)',
                        }}
                    >
                        <TextField
                            label=""
                            placeholder="Add a comment"
                            fillWidth={true}
                            value={comment}
                            onChange={commentChangeHandler}
                            onBlur={commentBlurHandler}
                            error
                        />
                        <IconButton
                            onClick={handleSubmit}
                            disabled={!commentIsValid}
                        >
                            <IconSend2
                                color={
                                    commentIsValid
                                        ? 'var(--accent)'
                                        : 'var(--fc-body-lighter)'
                                }
                            />
                        </IconButton>
                    </Box>
                )
            }
        >
            <Box
                sx={{
                    padding: '24px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}
                >
                    {comments.length > 0
                        ? sortedComments.map((comment, index) => (
                              <Box
                                  key={index}
                                  sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      //   gap: '4px',
                                  }}
                              >
                                  <h5>
                                      {`${comment.commentor.first_name} ${comment.commentor.last_name}`}

                                      <span
                                          style={{
                                              color: 'var(--fc-body)',
                                              fontWeight: '400',
                                              fontSize: '11px',
                                          }}
                                      >
                                          &nbsp;•{' '}
                                          <Moment fromNow>
                                              {comment.created_at}
                                          </Moment>
                                      </span>
                                  </h5>
                                  <p
                                      style={{
                                          color: 'var(--fc-body)',
                                          fontWeight: '400',
                                          fontSize: '12px',
                                      }}
                                  >
                                      {comment.commentor.position.name}
                                  </p>
                                  <p>{comment.comment}</p>
                              </Box>
                          ))
                        : 'No comments yet.'}
                </Box>
            </Box>
        </SwipeableCard>
    )
}

export default ProjectCommentsSwipe
