import React, { useState } from 'react'
import { Box } from '@mui/material'

import styles from './Priorities.module.css'

// DUE TO URGENT CHANGE : No updates directly to the database will happen;
// data from the database is reversed as shown in the frontend;
// 1 from the database is high === 4 in the frontend
// 2 from the database is medium === 3 in the frontend
// 3 from the database is normal === 2 in the frontend
// 4 from the database is low === 1 in the frontend

const priorities = [
    { id: 4, prio_label: 1, label: 'LOW', color: '#2d9bc0' },
    { id: 3, prio_label: 2, label: 'NORMAL', color: '#2DC071' },
    { id: 2, prio_label: 3, label: 'MEDIUM', color: '#BDC02D' },
    { id: 1, prio_label: 4, label: 'HIGH', color: '#C0362D' },
]

const Priorities = (props) => {
    const { selected, setSelected } = props

    const handleSelect = (val) => {
        // console.log(val)
        setSelected(val)
    }

    const selectedStyle = `${styles['priority-card']} ${styles['card-selected']}`

    return (
        <Box>
            <p className="title">Priority</p>
            <div className={styles['container']}>
                {priorities.map((priority, index) => {
                    return (
                        <div
                            key={index}
                            className={
                                selected === priority.id
                                    ? selectedStyle
                                    : styles['priority-card']
                            }
                            style={
                                selected === priority.id
                                    ? {
                                          border: `2px solid ${priority.color}`,
                                          backgroundColor: `${priority.color}08`,
                                      }
                                    : {
                                          borderColor: 'none',
                                      }
                            }
                            onClick={() => handleSelect(priority.id)}
                        >
                            {/* {selected} */}
                            <h3>{priority.prio_label}</h3>
                            <p>{priority.label}</p>
                        </div>
                    )
                })}
            </div>
        </Box>
    )
}

export default Priorities
