import React from 'react'

import styles from './Notifications.module.css'
import { IconChevronRight } from '@tabler/icons-react'
import moment from 'moment'

const NotificationContent = (props) => {
    const { content, isRead } = props

    // Parse the datetime string using moment
    const dateTime = moment(content.created_at)

    // Calculate the "ago" format
    const agoFormat = dateTime.fromNow()
    return (
        <div
            className={`${styles['notif']}  ${
                !content.is_read && styles['notification_highlight']
            }`}
        >
            <div className={styles['avatar']}></div>
            <div className={styles['content']}>
                <div className={styles['title-container']}>
                    <span className={`${styles['title-wrap']} title`}>
                        {content.title}
                    </span>
                    {!content.is_read && (
                        <div className={styles['is_read_dot']}></div>
                    )}
                </div>
                <p>{content.details}</p>
                <div className={styles['date']}>{agoFormat}</div>
            </div>
            {/* <div className={styles['action']}>
                <IconChevronRight />
            </div> */}
        </div>
    )
}

export default NotificationContent
