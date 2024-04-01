import React from 'react'

import styles from './Modal.module.css'
import { IconX } from '@tabler/icons-react'
import { IconButton } from '@mui/material'

const Modal = (props) => {
    const { onClose, title, maxWidth = null } = props
    return (
        <div
            className={styles['card']}
            style={maxWidth && { maxWidth: maxWidth }}
        >
            <div className={styles['title']}>
                <h3>{title}</h3>

                <div className={styles['close']}>
                    <IconX onClick={onClose} color="var(--fc-body)" />
                </div>
            </div>
            {props.children}
        </div>
    )
}

export default Modal
