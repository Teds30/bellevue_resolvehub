import React from 'react'

import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from 'react-swipeable-list'
import 'react-swipeable-list/dist/styles.css'

import styles from './Notifications.module.css'

import { AiFillDelete } from 'react-icons/ai'
import NotificationContent from './NotificationContent'

const trailingActions = ({ onDelete }) => (
    <TrailingActions>
        <SwipeAction
            destructive={true}
            onClick={onDelete}
            className={styles['swipe-action']}
        >
            <span style={{ alignSelf: 'center' }}>Delete</span>
        </SwipeAction>
    </TrailingActions>
)

const SwipeableNotification = ({
    onVisit,
    onDelete,
    data = {},
    is_read = false,
}) => {
    return (
        <SwipeableList className={styles['swipe-content']}>
            <SwipeableListItem
                onClick={() => {
                    onVisit({ url: data.redirect_url, id: data.id })
                }}
                trailingActions={trailingActions({ onDelete })}
            >
                <NotificationContent content={data} is_read={!!data.is_read} />
            </SwipeableListItem>
        </SwipeableList>
    )
}

export default SwipeableNotification
