import React from 'react'
import { BsInfoCircle } from 'react-icons/bs'

import styles from './Alert.module.css'
const Alert = (props) => {
    const { message = 'Invalid Credentials.' } = props
    return (
        <div className={styles['container']}>
            <BsInfoCircle style={{ fill: '#ff4949' }} />
            {message}
        </div>
    )
}

export default Alert
