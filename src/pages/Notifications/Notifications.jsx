import React, { useContext, useEffect, useState } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging'

const firebaseConfig = {
    apiKey: 'AIzaSyCHderxK3GHFan_OcO-8tbcbCbIji3vONU',
    authDomain: 'bellevue-notifications.firebaseapp.com',
    projectId: 'bellevue-notifications',
    storageBucket: 'bellevue-notifications.appspot.com',
    messagingSenderId: '329712442874',
    appId: '1:329712442874:web:3d700e0a0a94ffa6261843',
}
firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

import PrimaryButton from '../../components/Button/PrimaryButton'

import styles from './Notifications.module.css'
import { IconArrowNarrowLeft, IconChevronRight } from '@tabler/icons-react'
import NotificationContent from './NotificationContent'
import useHttp from '../../hooks/http-hook'
import AuthContext from '../../context/auth-context'
import { Box, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SwipeableNotification from './SwipeableNotification'
import BellevueLoading from '../../components/LoadingSpinner/BellevueLoading'
import BottomNavigationBar from '../../components/BottomNavigationBar/BottomNavigationBar'

const Notifications = () => {
    const [isInit, setIsInit] = useState(false)
    const [thetoken, setToken] = useState()
    const [notif, setNotif] = useState()

    const userCtx = useContext(AuthContext)

    const [granted, setGranted] = useState(false)

    const { sendRequest, isLoading } = useHttp()

    const navigate = useNavigate()

    useEffect(() => {
        // Request permission to receive notifications

        const loadNotifications = async () => {
            const res = await sendRequest({
                url: `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/user_notifications/${userCtx.user.id}`,
            })

            setNotif(res.data)
        }

        if (userCtx.user) loadNotifications()
        requestPermission()
    }, [userCtx])

    useEffect(() => {
        const saveToken = async () => {
            const res = await sendRequest({
                url: `${import.meta.env.VITE_BACKEND_URL}/api/device_tokens`,
                method: 'POST',
                body: JSON.stringify({
                    user_id: userCtx.user.id,
                    token: thetoken,
                }),
            })

            console.log('saved token')
        }

        if (granted && userCtx.user) saveToken()
    }, [granted, userCtx])

    const requestPermission = async () => {
        Notification.requestPermission()
            .then(() => {
                // Token is retrieved when permissions are granted or if already granted
                //@@@@@@@@@@@@@@@@@@
                return messaging.getToken()
            })
            .then((token) => {
                console.log('Permission granted')
                console.log('Token:', token)
                setGranted(true)
                setToken(token)
                // Send the token to your server if needed
            })
            .catch((error) => {
                setGranted(false)
                console.error('Permission denied:', error)
            })
    }

    function myFunction() {
        // Get the text field
        var copyText = document.getElementById('myInput')

        // Select the text field
        copyText.select()
        copyText.setSelectionRange(0, 99999) // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value)

        // Alert the copied text
        alert('Copied the text: ' + copyText.value)
    }

    const handleArchive = () => {
        // Implement your archive logic here.
        console.log('Archived')
    }

    const handleDelete = async (id) => {
        // Implement your delete logic here.
        console.log('Deleted: ', id)
        // const res = await deleteUserNotification(id)
    }

    const handleClick = async ({ url = '', id = null }) => {
        // Implement your delete logic here.
        // console.log('Clicked: ', url)
        // const res = await readUserNotification(id)
        // navigate(url)
    }

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['topnav']}>
                    <IconButton
                        aria-label="delete"
                        onClick={() => {
                            navigate(-1)
                        }}
                    >
                        <IconArrowNarrowLeft color="var(--fc-strong)" />
                    </IconButton>
                    <h3>Notifications</h3>
                </div>

                <div>
                    <button
                        onClick={async () => {
                            await requestPermission()
                            const t = await messaging.getToken()
                            console.log(t)
                            alert(t)
                        }}
                    >
                        Request token
                    </button>
                    <input type="text" value={thetoken} id="myInput"></input>
                    {thetoken && (
                        <button onClick={myFunction}>Copy Token</button>
                    )}
                </div>
                {!granted && (
                    <div className={styles['allow-notif']}>
                        <h4>Please allow the Notification</h4>
                        <PrimaryButton
                            onClick={async () => {
                                await requestPermission()
                                const t = await messaging.getToken()
                                console.log(t)
                                alert(t)
                            }}
                        >
                            Allow Notification
                        </PrimaryButton>
                    </div>
                )}
                <div className={styles['notif-container']}>
                    {notif &&
                        !isLoading &&
                        notif.map((not, index) => {
                            // return <NotificationContent content={not} key={index} />
                            return (
                                <SwipeableNotification
                                    key={index}
                                    data={not}
                                    is_read={true}
                                    onArchive={handleArchive}
                                    onDelete={() => {
                                        handleDelete(not.id)
                                    }}
                                    onVisit={handleClick}
                                />
                            )
                        })}
                    {!isLoading && !notif && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '48px',
                                width: '100%',
                                height: '50vh',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <h5>You have notifications</h5>
                        </Box>
                    )}
                    {isLoading && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '48px',
                                width: '100%',
                                height: '50vh',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <BellevueLoading />
                            <h5>Getting notifications</h5>
                        </Box>
                    )}
                </div>
            </div>
            <BottomNavigationBar current={4} />
        </>
    )
}

export default Notifications
