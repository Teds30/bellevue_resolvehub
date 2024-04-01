import React, { useState } from 'react'

import styles from './Priorities.module.css'

const priorities = [
    { id: 1, label: 'HIGH', color: '#C0362D' },
    { id: 2, label: 'MEDIUM', color: '#BDC02D' },
    { id: 3, label: 'NORMAL', color: '#2DC071' },
    { id: 4, label: 'LOW', color: '#2DC071' },
]

const Priorities = (props) => {
    const { selected, setSelected } = props

    const handleSelect = (val) => {
        // console.log(val)
        setSelected(val)
    }

    const selectedStyle = `${styles['priority-card']} ${styles['card-selected']}`

    return (
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
                        <h3>{priority.id}</h3>
                        <p>{priority.label}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Priorities
