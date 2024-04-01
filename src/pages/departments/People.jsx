import React, { useEffect, useState } from 'react'
import useHttp from '../../hooks/http-hook'

import styles from './Positions.module.css'
import Moment from 'react-moment'
import { Box, IconButton } from '@mui/material'
import {
    IconBuilding,
    IconChevronRight,
    IconPencil,
    IconPlus,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import Backdrop from '@mui/material/Backdrop'
import Modal from '../../components/Modal/Modal'
import TextField from '../../components/TextField/TextField'
import useValidate from '../../hooks/validate-input-hook'
import OutlinedButton from '../../components/Button/OutlinedButton'
import PrimaryButton from '../../components/Button/PrimaryButton'
import AddPosition from './AddPosition'
import Dropdown from '../../components/Dropdown/Dropdown'
import EditPerson from './EditPerson'
import AddPerson from './AddPerson'

const People = (props) => {
    const { department_id } = props

    const navigate = useNavigate()

    const { sendRequest, isLoading } = useHttp()
    const [people, setPeople] = useState([])
    const [editing, setEditing] = useState()

    const [open, setOpen] = React.useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    const [openAdd, setOpenAdd] = useState(false)
    const handleAddClose = () => {
        setOpenAdd(false)
    }
    const handleAddOpen = () => {
        setOpenAdd(true)
    }

    useEffect(() => {
        loadData()
    }, [department_id])

    const loadData = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_employees/${department_id}`,
        })

        setPeople(res.data)
    }

    return (
        <div className={styles['container']}>
            {people &&
                people?.map((person, index) => (
                    <div className={styles['position']} key={index}>
                        <div className={styles['avatar']}></div>
                        <div className={styles['details']}>
                            <h4>
                                {person.first_name} {person.last_name}
                            </h4>
                            <p>{person.position.name}</p>
                        </div>
                        <IconButton
                            onClick={() => {
                                handleOpen()
                                setEditing(person.id)
                            }}
                        >
                            <IconPencil />
                        </IconButton>
                        {editing === person.id && (
                            <EditPerson
                                department_id={department_id}
                                loadData={loadData}
                                person={person}
                                open={open}
                                handleClose={handleClose}
                            />
                        )}
                    </div>
                ))}

            <AddPerson
                department_id={department_id}
                loadData={loadData}
                open={openAdd}
                handleClose={handleAddClose}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '48px',
                }}
            >
                <PrimaryButton
                    width="250px"
                    leftIcon={<IconPlus />}
                    onClick={handleAddOpen}
                >
                    Add new
                </PrimaryButton>
            </Box>
        </div>
    )
}

export default People
