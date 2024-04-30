import React, { useContext, useEffect, useState } from 'react'

import styles from './Task.module.css'
import DropdownSearch from '../../components/Dropdown/DropdownSearch'
import {
    IconCircleCheck,
    IconEdit,
    IconHourglassHigh,
    IconUser,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import TimeSelector from '../../components/DateSelector/TimeSelector'
import DateSelector from '../../components/DateSelector/DateSelector'
import { Box } from '@mui/material'
import PrimaryButton from '../../components/Button/PrimaryButton'

import useHttp from '../../hooks/http-hook'

import AuthContext from '../../context/auth-context'
import SwipeableCard from '../../components/SwipeableCard/SwipeableCard'
import OutlinedButton from '../../components/Button/OutlinedButton'

const TaskAssignor = (props) => {
    const { task, onRefreshData } = props

    const [people, setPeople] = useState([])
    const [selectedPerson, setPerson] = useState()
    const [displaySelectedPerson, setDisplaySelectedPerson] = useState()

    const [inputValue, setInputValue] = React.useState()
    const [displayInputValue, setDisplayInputValue] = React.useState()

    const [date, setDate] = useState(dayjs())
    const [time, setTime] = useState()

    const { sendRequest, isLoading } = useHttp()
    const userCtx = useContext(AuthContext)

    const [openAssign, setOpenAssign] = useState(false)

    const toggleAssignDrawer = (newOpen) => {
        setOpenAssign(newOpen)
    }

    const handleCloseAssignDrawer = () => {
        setOpenAssign(false)
    }

    useEffect(() => {
        const changeData = () => {
            setDisplaySelectedPerson(selectedPerson)
        }
        changeData()
    }, [selectedPerson])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_employees/${task.department_id}`,
        })

        let modified = []
        res.data?.map((p) => {
            modified = [
                ...modified,
                {
                    id: p.id,
                    name: `${p.first_name} ${p.last_name}`,
                    position: p.position.name,
                },
            ]
        })

        if (task.assignee_id)
            setPerson({
                id: task.assignee.id,
                name: `${task.assignee.first_name} ${task.assignee.last_name}`,
                position: task.assignee.position.name,
            })
        setDisplaySelectedPerson({
            id: task.assignee.id,
            name: `${task.assignee.first_name} ${task.assignee.last_name}`,
            position: task.assignee.position.name,
        })

        setPeople(modified)
    }

    const handleAssign = async () => {
        const _date = dayjs(date)
        const combinedDateTime = _date
            .hour(time.hour())
            .minute(time.minute())
            .second(time.second())
            .unix()

        const mysqlTimestamp = dayjs
            .unix(combinedDateTime)
            .format('YYYY-MM-DD HH:mm:ss')

        // console.log({
        //     assignee_id: selectedPerson.id,
        //     assignor_id: userCtx.user.id,
        //     schedule: mysqlTimestamp,
        //     assigned_timestamp: dayjs().unix(),
        // })

        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task.id}`,
            method: 'PATCH',
            body: JSON.stringify({
                assignee_id: selectedPerson.id,
                assignor_id: userCtx.user.id,
                status: 0,
                schedule: mysqlTimestamp,
                assigned_timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }),
        })
        toggleAssignDrawer()
        onRefreshData()
    }

    return (
        <section>
            {task.assignee_id && (
                <DropdownSearch
                    label={`Assignee`}
                    leadingIcon={<IconUser size={20} color="var(--fc-body)" />}
                    value={displaySelectedPerson}
                    placeholder="Select assignee"
                    onValueChange={setDisplaySelectedPerson}
                    onInputChange={setDisplayInputValue}
                    inputValue={displayInputValue}
                    options={[]}
                    defaultValue={
                        task.assignee_id
                            ? {
                                  id: task.assignee.id,
                                  name: `${task.assignee.first_name} ${task.assignee.last_name}`,
                                  position: task.assignee.position.name,
                              }
                            : null
                    }
                    isPerson={true}
                    disabled={true}
                    customEndAdornment={
                        task.status === 0 ? (
                            <IconHourglassHigh />
                        ) : (
                            <IconCircleCheck color="#03b077" />
                        )
                    }
                />
            )}

            {task.assignee_id ? (
                <OutlinedButton width="100%" onClick={toggleAssignDrawer}>
                    Change assignee
                </OutlinedButton>
            ) : (
                <PrimaryButton width="100%" onClick={toggleAssignDrawer}>
                    Assign a person
                </PrimaryButton>
            )}

            <SwipeableCard
                open={openAssign}
                onOpen={toggleAssignDrawer}
                closeDrawer={handleCloseAssignDrawer}
                title="Assign task"
            >
                <div className={styles['assignor-container']}>
                    <div className={styles['assign-container']}>
                        <DropdownSearch
                            label="Assignee"
                            leadingIcon={
                                <IconUser size={20} color="var(--fc-body)" />
                            }
                            // value={selectedPerson}
                            placeholder="Select assignee"
                            onValueChange={setPerson}
                            onInputChange={setInputValue}
                            inputValue={inputValue}
                            options={people}
                            defaultValue={
                                task.assignee_id
                                    ? {
                                          id: task.assignee.id,
                                          name: `${task.assignee.first_name} ${task.assignee.last_name}`,
                                          position: task.assignee.position.name,
                                      }
                                    : null
                            }
                            isPerson={true}
                            // customEndAdornment={
                            //     task.status === 0 ? (
                            //         <IconEdit
                            //             size={20}
                            //             color="var(--fc-body)"
                            //         />
                            //     ) : (
                            //         <IconCircleCheck color="#03b077" />
                            //     )
                            // }
                        />
                        <>
                            <Box>
                                <h4
                                    style={{
                                        fontWeight: 500,
                                        color: 'var(--fc-strong)',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Schedule
                                </h4>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '12px',
                                        marginTop: '12px',
                                    }}
                                >
                                    <DateSelector
                                        currentValue={date}
                                        handleSetValue={setDate}
                                    />
                                    <TimeSelector
                                        currentValue={time}
                                        handleSetValue={setTime}
                                    />
                                </Box>
                            </Box>
                            <PrimaryButton
                                onClick={handleAssign}
                                disabled={!selectedPerson || !date || !time}
                                isLoading={isLoading}
                                loadingText="Assigning"
                            >
                                Assign
                            </PrimaryButton>
                        </>
                    </div>
                </div>
            </SwipeableCard>
        </section>
    )
}

export default TaskAssignor
